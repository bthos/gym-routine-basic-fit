/**
 * Session lifecycle: pure reducer, no I/O. lib/db.js persists whatever this
 * returns; the caller (screens/ActiveSessionScreen.jsx via App.jsx) owns the
 * "at most one active session" business rule (tech-plan.md) — this module
 * has no opinion on that, it only executes the action it's given.
 *
 * Actions: START is not a reducer action — starting a session means calling
 * createSession() directly (it returns a full new session object) and
 * persisting it; the reducer only handles transitions on an existing session:
 * COMPLETE_EXERCISE, UNDO_EXERCISE, FINISH, ABANDON, RESUME.
 */

function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback for environments without the Web Crypto API (older Node in CI).
  // Not cryptographically random — fine for a local, non-security-sensitive
  // client-side record id.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Starts a new active session for a day. `exercises` is that day's
 * exercises (rutina.days[dayIndex].exercises); only `equipmentId` and
 * `name` are carried into the per-session tracking record — everything
 * else (sets/reps/rest/technique) stays in the rutina and is joined back
 * in at render time, never duplicated into session state.
 */
export function createSession(dayLabel, dayIndex, exercises, now) {
  return {
    id: generateId(),
    dayLabel,
    dayIndex,
    status: 'active',
    startedAt: now,
    endedAt: null,
    exercises: exercises.map((ex) => ({
      equipmentId: ex.equipmentId,
      name: ex.name,
      weightUsed: null,
      difficulty: null,
      completedAt: null,
    })),
  };
}

export function sessionReducer(session, action) {
  switch (action.type) {
    case 'RESUME':
      // Hydrate from a persisted record — round-trips unchanged.
      return action.session;

    case 'COMPLETE_EXERCISE':
      return {
        ...session,
        exercises: session.exercises.map((ex) =>
          ex.equipmentId === action.equipmentId
            ? { ...ex, weightUsed: action.weightUsed, difficulty: action.difficulty, completedAt: action.now }
            : ex
        ),
      };

    case 'UNDO_EXERCISE':
      return {
        ...session,
        exercises: session.exercises.map((ex) =>
          ex.equipmentId === action.equipmentId ? { ...ex, weightUsed: null, difficulty: null, completedAt: null } : ex
        ),
      };

    case 'FINISH':
      // Allowed with exercises still pending — "user ends early" (spec.md).
      return { ...session, status: 'completed', endedAt: action.now };

    case 'ABANDON':
      return { ...session, status: 'abandoned', endedAt: action.now };

    default:
      return session;
  }
}
