'use strict';

/**
 * Shared rutina validation module.
 *
 * Isomorphic by design: this file must run unmodified in Node (this
 * project's scripts/validate-rutina.js CLI) AND, later, in the browser
 * as part of rutina-pwa's "Import rutina" screen (bundled via webpack/
 * vite, which resolve the `require('ajv')` and the JSON schema import
 * below to browser-safe equivalents — ajv ships a browser build).
 *
 * No Node-only APIs (fs, path, process) appear anywhere in this file.
 * File I/O (reading the candidate rutina.json and data/equipment.json
 * off disk) is the CLI wrapper's job, not this module's — see
 * scripts/validate-rutina.js.
 */

const Ajv = require('ajv');
const schema = require('../../data/schema/rutina.schema.json');

// allErrors: true is required so ajv reports every violation in one pass
// (e.g. multiple missing required fields across different nested objects)
// instead of stopping at the first one — this project's validator
// contract is "collect all errors, report the union in a single run."
// strict: false avoids ajv's strict-mode errors for schema conventions
// (like the plain-string `lastUpdated` date field) that don't need a
// separate `ajv-formats` dependency for this project's purposes.
const ajv = new Ajv({ allErrors: true, strict: false });
const runSchemaValidation = ajv.compile(schema);

/**
 * Convert an ajv instancePath (e.g. "/program/phaseName" or "/days/0")
 * into the project's pasteable dotted/bracket path style
 * (e.g. "program.phaseName" or "days[0]").
 */
function formatInstancePath(instancePath) {
  return (instancePath || '')
    .split('/')
    .filter(Boolean)
    .map((segment) => (/^\d+$/.test(segment) ? `[${segment}]` : `.${segment}`))
    .join('')
    .replace(/^\./, '');
}

/**
 * Format a single ajv error object into a one-line, LLM-pasteable message.
 */
function formatSchemaError(err) {
  const path = formatInstancePath(err.instancePath);

  if (err.keyword === 'required') {
    const missing = err.params.missingProperty;
    return path ? `${path}.${missing}: required` : `${missing}: required`;
  }

  if (err.keyword === 'additionalProperties') {
    const extra = err.params.additionalProperty;
    const full = path ? `${path}.${extra}` : extra;
    return `${full}: unrecognized property (not allowed by schema)`;
  }

  const label = path || '(root)';
  return `${label}: ${err.message}`;
}

/**
 * Cross-check every days[].exercises[].equipmentId against a known-good
 * set of equipment ids. Null-safe on purpose: this must produce useful
 * output even when the input already failed schema validation and
 * `days`/`exercises` are missing, malformed, or not arrays at all.
 *
 * @param {*} data - parsed rutina.json contents (may be structurally invalid)
 * @param {Array} equipmentArray - parsed data.equipment array from equipment.json
 * @returns {string[]} one formatted error per unresolved equipmentId
 */
function crossCheckEquipmentIds(data, equipmentArray) {
  const errors = [];
  const validIds = new Set(
    (Array.isArray(equipmentArray) ? equipmentArray : [])
      .map((item) => item && item.id)
      .filter((id) => id !== undefined)
  );

  const days = data && Array.isArray(data.days) ? data.days : [];
  days.forEach((day, dayIndex) => {
    const exercises = day && Array.isArray(day.exercises) ? day.exercises : [];
    exercises.forEach((exercise, exerciseIndex) => {
      if (!exercise || typeof exercise !== 'object') return;
      const id = exercise.equipmentId;
      if (id === undefined) return; // a missing id is already a schema error
      if (!validIds.has(id)) {
        errors.push(
          `days[${dayIndex}].exercises[${exerciseIndex}].equipmentId "${id}" not found in data/equipment.json`
        );
      }
    });
  });

  return errors;
}

/**
 * Count days/exercises for the success summary line. Null-safe.
 */
function countDaysAndExercises(data) {
  const days = data && Array.isArray(data.days) ? data.days : [];
  const dayCount = days.length;
  const exerciseCount = days.reduce(
    (sum, day) => sum + (day && Array.isArray(day.exercises) ? day.exercises.length : 0),
    0
  );
  return { dayCount, exerciseCount };
}

/**
 * Validate a parsed rutina object against the schema AND cross-check every
 * equipment reference against the parsed equipment catalog.
 *
 * Both passes ALWAYS run, regardless of whether the other one failed —
 * schema validation failing does not short-circuit the equipment
 * cross-check (traversal is null-safe). Callers get the full union of
 * errors from a single call, matching validate-data.js's existing
 * accumulate-then-report style.
 *
 * @param {*} data - parsed rutina.json contents
 * @param {Array} equipmentArray - parsed data.equipment array from equipment.json
 * @returns {{ valid: boolean, errors: string[], dayCount: number, exerciseCount: number }}
 */
function validateRutina(data, equipmentArray) {
  const errors = [];

  const schemaOk = runSchemaValidation(data);
  if (!schemaOk) {
    (runSchemaValidation.errors || []).forEach((err) => errors.push(formatSchemaError(err)));
  }

  // Always run, even when schema validation failed above.
  errors.push(...crossCheckEquipmentIds(data, equipmentArray));

  const { dayCount, exerciseCount } = countDaysAndExercises(data);

  return {
    valid: errors.length === 0,
    errors,
    dayCount,
    exerciseCount,
  };
}

module.exports = {
  validateRutina,
  crossCheckEquipmentIds,
  formatSchemaError,
};
