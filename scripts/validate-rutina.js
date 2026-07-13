#!/usr/bin/env node

/**
 * Validation script for rutina.json files.
 *
 * Validates a candidate rutina against data/schema/rutina.schema.json
 * (via ajv, see scripts/lib/rutina-validator.js) AND cross-checks every
 * days[].exercises[].equipmentId against data/equipment.json. Both checks
 * always run in the same pass — the equipment cross-check is not gated
 * on schema validation succeeding, so a single invocation reports the
 * full union of schema errors and equipment-id errors together.
 *
 * Usage:
 *   npm run validate-rutina -- <path-to-rutina.json>
 */

const fs = require('fs');
const path = require('path');
const { validateRutina } = require('./lib/rutina-validator');

function readJson(filePath, label) {
  const content = fs.readFileSync(filePath, 'utf8');
  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Could not parse ${label} as JSON: ${error.message}`);
  }
}

function validate() {
  const targetPath = process.argv[2];

  if (!targetPath) {
    console.log('Usage: npm run validate-rutina -- <path-to-rutina.json>');
    console.log('Example: npm run validate-rutina -- data/examples/phase1-monday.json');
    return 1;
  }

  const resolvedTarget = path.resolve(process.cwd(), targetPath);
  const equipmentPath = path.join(__dirname, '..', 'data', 'equipment.json');

  console.log(`Validating ${targetPath}...\n`);

  let rutina;
  try {
    rutina = readJson(resolvedTarget, targetPath);
    console.log(`✓ Read ${targetPath}`);
  } catch (error) {
    console.error(`✗ Error reading ${targetPath}: ${error.message}`);
    return 1;
  }

  let equipmentData;
  try {
    equipmentData = readJson(equipmentPath, 'data/equipment.json');
    console.log(`✓ Read data/equipment.json (${(equipmentData.equipment || []).length} items)`);
  } catch (error) {
    console.error(`✗ Error reading data/equipment.json: ${error.message}`);
    return 1;
  }

  const equipmentArray = Array.isArray(equipmentData.equipment) ? equipmentData.equipment : [];

  console.log('\nValidating schema + equipment references...');
  const result = validateRutina(rutina, equipmentArray);

  if (result.valid) {
    console.log(`\n✓ Valid rutina: ${result.dayCount} days, ${result.exerciseCount} exercises`);
    return 0;
  }

  console.error(`\n✗ Validation failed with ${result.errors.length} error(s):\n`);
  result.errors.forEach((error, index) => {
    console.error(`  ${index + 1}. ${error}`);
  });
  return 1;
}

if (require.main === module) {
  const exitCode = validate();
  process.exit(exitCode);
}

module.exports = { validate };
