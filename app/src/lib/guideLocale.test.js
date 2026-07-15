import { describe, it, expect } from 'vitest';
import { detectGuideLocale } from './guideLocale.js';

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
