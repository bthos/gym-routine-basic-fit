import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import {
  saveActiveRutina,
  getActiveRutina,
  clearActiveRutina,
  saveSession,
  getActiveSession,
  listSessions,
  getLastWeight,
  setLastWeight,
  deleteSessions,
} from './db.js';

const RUTINA = { schemaVersion: 1, program: { name: 'Test' }, days: [{ label: 'Lunes', exercises: [] }] };

function resetDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.deleteDatabase('basicfit-rutina');
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
    req.onblocked = () => resolve();
  });
}

beforeEach(async () => {
  await resetDb();
});

describe('db (IndexedDB wrapper)', () => {
  it('round-trips the active rutina', async () => {
    expect(await getActiveRutina()).toBeNull();
    await saveActiveRutina(RUTINA);
    const stored = await getActiveRutina();
    expect(stored.rutina).toEqual(RUTINA);
    await clearActiveRutina();
    expect(await getActiveRutina()).toBeNull();
  });

  it('saveSession + getActiveSession round-trips a status:active session', async () => {
    const session = {
      id: 'sess-1',
      dayLabel: 'Lunes',
      dayIndex: 0,
      status: 'active',
      startedAt: '2026-07-13T09:00:00.000Z',
      endedAt: null,
      exercises: [],
    };
    await saveSession(session);
    expect(await getActiveSession()).toEqual(session);
  });

  it('completing a session clears it from getActiveSession', async () => {
    const session = {
      id: 'sess-1',
      dayLabel: 'Lunes',
      dayIndex: 0,
      status: 'active',
      startedAt: '2026-07-13T09:00:00.000Z',
      endedAt: null,
      exercises: [],
    };
    await saveSession(session);
    await saveSession({ ...session, status: 'completed', endedAt: '2026-07-13T09:50:00.000Z' });
    expect(await getActiveSession()).toBeNull();
  });

  it('listSessions returns sessions newest-first', async () => {
    await saveSession({
      id: 'a',
      dayLabel: 'Lunes',
      dayIndex: 0,
      status: 'completed',
      startedAt: '2026-07-01T09:00:00.000Z',
      endedAt: '2026-07-01T09:50:00.000Z',
      exercises: [],
    });
    await saveSession({
      id: 'b',
      dayLabel: 'Lunes',
      dayIndex: 0,
      status: 'completed',
      startedAt: '2026-07-08T09:00:00.000Z',
      endedAt: '2026-07-08T09:50:00.000Z',
      exercises: [],
    });
    const sessions = await listSessions();
    expect(sessions.map((s) => s.id)).toEqual(['b', 'a']);
  });

  it('getLastWeight is null until set, then returns the latest logged value', async () => {
    expect(await getLastWeight('g3-s10')).toBeNull();
    await setLastWeight('g3-s10', 32, '2026-07-06T09:10:00.000Z');
    await setLastWeight('g3-s10', 35, '2026-07-08T09:10:00.000Z');
    expect(await getLastWeight('g3-s10')).toMatchObject({ weight: 35 });
  });
});

/**
 * session-discard-and-history-delete (spec.md AC1, AC6–AC9, AC24).
 *
 * deleteSessions(ids) is the single batch-capable entry point behind BOTH the
 * active-session discard and Historial's per-entry / multi-select delete —
 * from the store's point of view they are the same operation. It must remove
 * the rows AND roll the lastWeights prefills back in ONE transaction over
 * ['sessions','lastWeights'], mirroring saveSession's single-write-path
 * invariant (db.js:67-75) so the two stores cannot drift.
 */
function logged(equipmentId, weightUsed, completedAt) {
  return { equipmentId, name: equipmentId, weightUsed, difficulty: 'normal', completedAt };
}

function pending(equipmentId) {
  return { equipmentId, name: equipmentId, weightUsed: null, difficulty: null, completedAt: null };
}

function sessionOf(id, startedAt, exercises, overrides = {}) {
  return {
    id,
    dayLabel: 'Lunes',
    dayIndex: 0,
    status: 'completed',
    startedAt,
    endedAt: startedAt,
    exercises,
    ...overrides,
  };
}

describe('db — deleteSessions (discard + history delete)', () => {
  it('removes the session row so getActiveSession returns null (AC1)', async () => {
    const active = sessionOf('sess-active', '2026-08-03T09:00:00.000Z', [pending('g3-s10')], {
      status: 'active',
      endedAt: null,
    });
    await saveSession(active);
    expect(await getActiveSession()).not.toBeNull();

    await deleteSessions([active.id]);

    expect(await getActiveSession()).toBeNull();
    expect(await listSessions()).toEqual([]);
  });

  it('recomputes lastWeights to the most recent surviving entry (AC6)', async () => {
    // Two sessions logged g3-s10. Deleting the newer must roll the prefill
    // back to the older one's weight, not leave the deleted session's value.
    await saveSession(
      sessionOf('older', '2026-07-20T09:00:00.000Z', [logged('g3-s10', 30, '2026-07-20T09:10:00.000Z')])
    );
    await saveSession(
      sessionOf('newer', '2026-07-27T09:00:00.000Z', [logged('g3-s10', 40, '2026-07-27T09:10:00.000Z')])
    );
    expect(await getLastWeight('g3-s10')).toMatchObject({ weight: 40 });

    await deleteSessions(['newer']);

    expect(await getLastWeight('g3-s10')).toMatchObject({ weight: 30 });
  });

  it('removes the lastWeights record when no surviving session logged it (AC7)', async () => {
    await saveSession(
      sessionOf('only', '2026-07-27T09:00:00.000Z', [logged('g3-s10', 40, '2026-07-27T09:10:00.000Z')])
    );
    expect(await getLastWeight('g3-s10')).toMatchObject({ weight: 40 });

    await deleteSessions(['only']);

    // Must be REMOVED, not zeroed — getLastWeight() returning null is what
    // stops ExerciseLogCard prefilling from deleted data (AC7).
    expect(await getLastWeight('g3-s10')).toBeNull();
  });

  it('leaves lastWeights untouched for equipment not in the deleted sessions (AC8)', async () => {
    await saveSession(
      sessionOf('keep', '2026-07-20T09:00:00.000Z', [logged('g3-s20', 55, '2026-07-20T09:10:00.000Z')])
    );
    await saveSession(
      sessionOf('drop', '2026-07-27T09:00:00.000Z', [logged('g3-s10', 40, '2026-07-27T09:10:00.000Z')])
    );

    await deleteSessions(['drop']);

    // Scoped recompute, not a rebuild of the whole store.
    expect(await getLastWeight('g3-s20')).toMatchObject({ weight: 55 });
    expect(await getLastWeight('g3-s10')).toBeNull();
  });

  it('ignores exercises that were never logged when scoping the rollback (AC6/AC8)', async () => {
    // g3-s30 appears in the deleted session but was never completed, so it
    // never seeded a lastWeights value and must not be disturbed.
    await saveSession(
      sessionOf('seed', '2026-07-20T09:00:00.000Z', [logged('g3-s30', 25, '2026-07-20T09:10:00.000Z')])
    );
    await saveSession(sessionOf('drop', '2026-07-27T09:00:00.000Z', [pending('g3-s30')]));

    await deleteSessions(['drop']);

    expect(await getLastWeight('g3-s30')).toMatchObject({ weight: 25 });
  });

  it('deletes N sessions and rolls back weights in a single call (AC9)', async () => {
    await saveSession(
      sessionOf('a', '2026-07-06T09:00:00.000Z', [logged('g3-s10', 20, '2026-07-06T09:10:00.000Z')])
    );
    await saveSession(
      sessionOf('b', '2026-07-13T09:00:00.000Z', [logged('g3-s10', 30, '2026-07-13T09:10:00.000Z')])
    );
    await saveSession(
      sessionOf('c', '2026-07-20T09:00:00.000Z', [logged('g3-s10', 40, '2026-07-20T09:10:00.000Z')])
    );

    // ONE call for all of them — never a per-id loop, which would open one
    // connection + one transaction each and leave partial-failure windows.
    await deleteSessions(['b', 'c']);

    expect((await listSessions()).map((s) => s.id)).toEqual(['a']);
    expect(await getLastWeight('g3-s10')).toMatchObject({ weight: 20 });
  });

  it('recomputes from the most recent completedAt, not session start order (AC6)', async () => {
    // A session that STARTED earlier can hold a LATER completedAt. The
    // rollback winner is decided by completedAt, matching what saveSession
    // actually mirrors into lastWeights (db.js:85).
    await saveSession(
      sessionOf('early-start', '2026-07-20T08:00:00.000Z', [logged('g3-s10', 33, '2026-07-20T11:30:00.000Z')])
    );
    await saveSession(
      sessionOf('late-start', '2026-07-20T09:00:00.000Z', [logged('g3-s10', 31, '2026-07-20T09:30:00.000Z')])
    );
    await saveSession(
      sessionOf('drop', '2026-07-27T09:00:00.000Z', [logged('g3-s10', 45, '2026-07-27T09:10:00.000Z')])
    );

    await deleteSessions(['drop']);

    expect(await getLastWeight('g3-s10')).toMatchObject({ weight: 33 });
  });

  it('is a no-op for ids that do not exist', async () => {
    await saveSession(
      sessionOf('real', '2026-07-20T09:00:00.000Z', [logged('g3-s10', 30, '2026-07-20T09:10:00.000Z')])
    );

    await deleteSessions(['ghost']);

    expect((await listSessions()).map((s) => s.id)).toEqual(['real']);
    expect(await getLastWeight('g3-s10')).toMatchObject({ weight: 30 });
  });

  it('accepts an empty id list without touching anything', async () => {
    await saveSession(
      sessionOf('real', '2026-07-20T09:00:00.000Z', [logged('g3-s10', 30, '2026-07-20T09:10:00.000Z')])
    );

    await deleteSessions([]);

    expect((await listSessions()).map((s) => s.id)).toEqual(['real']);
    expect(await getLastWeight('g3-s10')).toMatchObject({ weight: 30 });
  });

  it('does not alter FINISH/ABANDON semantics for surviving sessions (AC24)', async () => {
    await saveSession(
      sessionOf('completed', '2026-07-20T09:00:00.000Z', [logged('g3-s10', 30, '2026-07-20T09:10:00.000Z')], {
        status: 'completed',
      })
    );
    await saveSession(
      sessionOf('abandoned', '2026-07-21T09:00:00.000Z', [pending('g3-s20')], { status: 'abandoned' })
    );
    await saveSession(sessionOf('drop', '2026-07-22T09:00:00.000Z', [pending('g3-s30')]));

    await deleteSessions(['drop']);

    const survivors = await listSessions();
    expect(survivors.map((s) => s.status).sort()).toEqual(['abandoned', 'completed']);
  });
});
