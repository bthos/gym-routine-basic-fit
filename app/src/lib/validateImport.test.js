import { describe, it, expect } from 'vitest';
import { validateImportedRutina } from './validateImport.js';
import goldenRutina from '../../../data/examples/phase1-monday.json';

// Thin smoke test — tech-plan.md's Known Gaps flags this module as needing
// one once it exists (its only logic is a one-line delegation to the
// already-tested scripts/lib/rutina-validator.js). Reuses the already-
// shipped example rutina as the golden fixture rather than inventing a
// duplicate one.
describe('validateImportedRutina', () => {
  it('accepts the shipped example rutina (golden fixture)', () => {
    const result = validateImportedRutina(goldenRutina);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('reports schema + equipment-id errors together for a broken rutina', () => {
    const broken = {
      schemaVersion: 1,
      days: [{ label: 'Lunes', exercises: [{ equipmentId: 'g3-xx' }] }],
      // missing: program, phaseInfo, warmup, cooldown, rules, notes
    };
    const result = validateImportedRutina(broken);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('program'))).toBe(true);
    expect(result.errors.some((e) => e.includes('g3-xx'))).toBe(true);
  });
});
