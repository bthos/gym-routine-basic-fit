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
