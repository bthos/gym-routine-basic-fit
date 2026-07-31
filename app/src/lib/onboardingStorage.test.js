// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { hasSeenOnboarding, markOnboardingSeen } from './onboardingStorage.js';

// onboarding-screens (AC2, AC9-equivalent): pending Cmok implementation — see
// tech-plan.md Decision 1 (localStorage, not idb) for why this is a plain
// module rather than a db.js-style idb wrapper. Failures here are expected
// until Cmok implements onboardingStorage.js.
describe('onboardingStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('defaults to not-seen when the key is unset', () => {
    expect(hasSeenOnboarding()).toBe(false);
  });

  it('persists seen-state across calls (round-trip)', () => {
    markOnboardingSeen();
    expect(hasSeenOnboarding()).toBe(true);
  });

  it('returns false, does not throw, when localStorage.getItem throws (private-browsing/storage-disabled)', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage disabled');
    });
    expect(() => hasSeenOnboarding()).not.toThrow();
    expect(hasSeenOnboarding()).toBe(false);
  });

  it('does not throw when localStorage.setItem throws (private-browsing/storage-disabled)', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('storage disabled');
    });
    expect(() => markOnboardingSeen()).not.toThrow();
  });
});
