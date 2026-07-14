import { describe, it, expect } from 'vitest';
import { createSession, sessionReducer } from './sessionMachine.js';

const DAY_EXERCISES = [
  { equipmentId: 'g3-s10', name: 'Prensa de Pecho' },
  { equipmentId: 'g3-s70', name: 'Prensa de Piernas' },
  { equipmentId: 'g3-s30', name: 'Jalón al Pecho' },
];
const NOW = '2026-07-13T10:00:00.000Z';

describe('createSession', () => {
  it('starts a new active session with every exercise pending', () => {
    const session = createSession('Lunes', 0, DAY_EXERCISES, NOW);
    expect(session.status).toBe('active');
    expect(session.dayLabel).toBe('Lunes');
    expect(session.dayIndex).toBe(0);
    expect(session.startedAt).toBe(NOW);
    expect(session.endedAt).toBeNull();
    expect(session.exercises).toHaveLength(3);
    expect(
      session.exercises.every(
        (e) => e.difficulty === null && e.weightUsed === null && e.completedAt === null
      )
    ).toBe(true);
    expect(session.id).toEqual(expect.any(String));
  });
});

describe('sessionReducer', () => {
  it('COMPLETE_EXERCISE logs weight/difficulty/timestamp for exactly one exercise', () => {
    const session = createSession('Lunes', 0, DAY_EXERCISES, NOW);
    const next = sessionReducer(session, {
      type: 'COMPLETE_EXERCISE',
      equipmentId: 'g3-s30',
      weightUsed: 45,
      difficulty: 'normal',
      now: '2026-07-13T10:05:00.000Z',
    });
    const logged = next.exercises.find((e) => e.equipmentId === 'g3-s30');
    expect(logged).toMatchObject({
      weightUsed: 45,
      difficulty: 'normal',
      completedAt: '2026-07-13T10:05:00.000Z',
    });
    // other exercises must be untouched
    expect(next.exercises.find((e) => e.equipmentId === 'g3-s10').completedAt).toBeNull();
    // completing one exercise never auto-finishes the session
    expect(next.status).toBe('active');
  });

  it('UNDO_EXERCISE clears a logged exercise back to pending for correction', () => {
    let session = createSession('Lunes', 0, DAY_EXERCISES, NOW);
    session = sessionReducer(session, {
      type: 'COMPLETE_EXERCISE',
      equipmentId: 'g3-s10',
      weightUsed: 32,
      difficulty: 'hard',
      now: NOW,
    });
    session = sessionReducer(session, { type: 'UNDO_EXERCISE', equipmentId: 'g3-s10' });
    const ex = session.exercises.find((e) => e.equipmentId === 'g3-s10');
    expect(ex).toMatchObject({ weightUsed: null, difficulty: null, completedAt: null });
  });

  it('FINISH marks the session completed even with exercises still pending (user ends early)', () => {
    const session = createSession('Lunes', 0, DAY_EXERCISES, NOW);
    const next = sessionReducer(session, { type: 'FINISH', now: '2026-07-13T10:20:00.000Z' });
    expect(next.status).toBe('completed');
    expect(next.endedAt).toBe('2026-07-13T10:20:00.000Z');
  });

  it('ABANDON marks the session abandoned, distinct from completed', () => {
    const session = createSession('Lunes', 0, DAY_EXERCISES, NOW);
    const next = sessionReducer(session, { type: 'ABANDON', now: '2026-07-13T10:07:00.000Z' });
    expect(next.status).toBe('abandoned');
    expect(next.endedAt).toBe('2026-07-13T10:07:00.000Z');
  });

  it('never mutates the session object passed in (pure function)', () => {
    const session = createSession('Lunes', 0, DAY_EXERCISES, NOW);
    const snapshot = JSON.parse(JSON.stringify(session));
    sessionReducer(session, {
      type: 'COMPLETE_EXERCISE',
      equipmentId: 'g3-s10',
      weightUsed: 32,
      difficulty: 'easy',
      now: NOW,
    });
    expect(session).toEqual(snapshot);
  });

  it('RESUME round-trips a persisted session unchanged', () => {
    const session = createSession('Lunes', 0, DAY_EXERCISES, NOW);
    const resumed = sessionReducer(null, { type: 'RESUME', session });
    expect(resumed).toEqual(session);
  });
});
