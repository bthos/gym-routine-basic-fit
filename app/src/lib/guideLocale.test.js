import { describe, it, expect } from 'vitest';
import { detectGuideLocale } from './guideLocale.js';
// Namespace import (not named) so a not-yet-implemented export resolves to
// `undefined` instead of a hard module-resolution error — keeps failures
// clean and pinpointed while these constants are pending (llm-guide-file-downloads).
import * as guideLocale from './guideLocale.js';

describe('detectGuideLocale', () => {
  it('returns es for Spanish browser languages', () => {
    expect(detectGuideLocale('es')).toBe('es');
    expect(detectGuideLocale('es-ES')).toBe('es');
  });

  it('returns be for Belarusian browser languages', () => {
    expect(detectGuideLocale('be')).toBe('be');
    expect(detectGuideLocale('be-BY')).toBe('be');
  });

  it('returns en for English and other unsupported languages', () => {
    expect(detectGuideLocale('en-US')).toBe('en');
    expect(detectGuideLocale('fr')).toBe('en');
  });

  it('defaults to en when language is missing', () => {
    expect(detectGuideLocale(undefined)).toBe('en');
    expect(detectGuideLocale('')).toBe('en');
  });
});

// llm-guide-file-downloads (AC3, AC4 wiring): pending Cmok implementation —
// see tech-plan.md for the exact GUIDE_DATA_FILES / GUIDE_DATA_FILES_BASE_URL shape.
describe('GUIDE_DATA_FILES (LLM guide file-download card)', () => {
  it('lists the four DATA SOURCES files in canonical AC3 order', () => {
    const files = guideLocale.GUIDE_DATA_FILES;
    expect(Array.isArray(files)).toBe(true);
    expect(files.map((f) => f.filename)).toEqual([
      'rutina.schema.json',
      'equipment.json',
      'gyms.json',
      'phase1-monday.json',
    ]);
  });

  it('mirrors the dist/data/... subpaths the build step copies files to (AC4)', () => {
    const files = guideLocale.GUIDE_DATA_FILES;
    expect(files.map((f) => f.path)).toEqual([
      'data/schema/rutina.schema.json',
      'data/equipment.json',
      'data/gyms.json',
      'data/examples/phase1-monday.json',
    ]);
  });

  it('points at the production GitHub Pages origin, not raw.githubusercontent.com (AC2)', () => {
    expect(guideLocale.GUIDE_DATA_FILES_BASE_URL).toBe(
      'https://bthos.github.io/gym-routine-basic-fit/'
    );
  });
});
