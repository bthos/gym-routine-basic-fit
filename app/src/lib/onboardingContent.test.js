import { describe, it, expect } from 'vitest';
import { ONBOARDING_STEPS } from './onboardingContent.js';

// onboarding-screens (AC3, AC4, AC8): pending Cmok implementation — see
// tech-plan.md. Failures here are expected until Cmok implements
// onboardingContent.js with this exact shape.
describe('ONBOARDING_STEPS', () => {
  it('has exactly 4 steps (AC3)', () => {
    expect(Array.isArray(ONBOARDING_STEPS)).toBe(true);
    expect(ONBOARDING_STEPS).toHaveLength(4);
  });

  it('every step has a string icon name and title', () => {
    for (const step of ONBOARDING_STEPS) {
      expect(typeof step.icon).toBe('string');
      expect(typeof step.title).toBe('string');
      expect(step.title.length).toBeGreaterThan(0);
    }
  });

  it('is Spanish-only — no locale-keyed objects anywhere (AC8)', () => {
    for (const step of ONBOARDING_STEPS) {
      for (const key of ['title', 'body', 'footnote']) {
        if (step[key] !== undefined) {
          expect(typeof step[key]).not.toBe('object');
        }
      }
      if (step.steps !== undefined) {
        expect(Array.isArray(step.steps)).toBe(true);
        for (const line of step.steps) {
          expect(typeof line).toBe('string');
        }
      }
    }
  });

  it('the third step (index 2) carries the relocated "How it works" flow as a 4-line list (AC4)', () => {
    const step3 = ONBOARDING_STEPS[2];
    expect(Array.isArray(step3.steps)).toBe(true);
    expect(step3.steps).toHaveLength(4);
    expect(typeof step3.footnote).toBe('string');
  });
});
