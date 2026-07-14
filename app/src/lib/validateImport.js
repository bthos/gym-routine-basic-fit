// Thin browser wrapper around the already-shipped, Bagnik-passed validator —
// tech-plan.md's explicit decision: reuse scripts/lib/rutina-validator.js
// directly rather than fork/duplicate it. That module is isomorphic by
// design (no fs/path/process); this file is the only place the PWA imports
// it from, cross-root, which is why vite.config.js's server.fs.allow must
// include the repo root (see that file's comment).
import { validateRutina } from '../../../scripts/lib/rutina-validator.js';
import equipmentData from '../../../data/equipment.json';

/**
 * @param {*} parsed - JSON.parse()'d candidate rutina
 * @returns {{valid: boolean, errors: string[], dayCount: number, exerciseCount: number}}
 */
export function validateImportedRutina(parsed) {
  return validateRutina(parsed, equipmentData.equipment);
}
