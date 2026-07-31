/**
 * Persisted "has the user seen onboarding" flag (onboarding-screens feature,
 * tech-plan.md Decision 1: plain localStorage boolean, not a new idb store —
 * a single flag with no query/index needs doesn't justify db.js's
 * async-open/upgrade/close overhead, and Shell needs to read it synchronously
 * at mount, in the same tick as component init).
 *
 * Defensive by design: private-browsing / storage-disabled environments must
 * degrade to "always show onboarding" rather than throw and break app boot.
 */

const ONBOARDING_SEEN_KEY = 'rutina:onboardingSeen';

/** @returns {boolean} true once the user has skipped or completed onboarding. */
export function hasSeenOnboarding() {
  try {
    return localStorage.getItem(ONBOARDING_SEEN_KEY) === 'true';
  } catch {
    // Storage disabled (e.g. private browsing) — degrade to "always show."
    return false;
  }
}

/** Marks onboarding as seen. Idempotent; safe to call on every skip/finish/revisit-close. */
export function markOnboardingSeen() {
  try {
    localStorage.setItem(ONBOARDING_SEEN_KEY, 'true');
  } catch {
    // Storage disabled — nothing persists, onboarding will just show again
    // next boot. Never throw: this must not break the close/skip action.
  }
}
