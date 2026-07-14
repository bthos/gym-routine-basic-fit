import { openDB } from 'idb';

/**
 * IndexedDB wrapper (db name `basicfit-rutina`, version 1). Storage schema
 * per tech-plan.md:
 *   activeRutina  — fixed key "current": { key, rutina, importedAt }
 *   sessions      — keyPath id, indexes by-status / by-startedAt
 *   lastWeights   — keyPath equipmentId: { equipmentId, weight, loggedAt }
 *
 * Each exported function opens its own short-lived connection and closes it
 * before returning, rather than caching one module-level connection. This
 * is deliberate, not an oversight: a cached connection would sit open
 * across calls and block any later `indexedDB.deleteDatabase(...)` (per the
 * IndexedDB spec, deleteDatabase waits — effectively hangs — while a
 * connection stays open), which is exactly what db.test.js's `beforeEach`
 * does between every test. Opening fresh per call keeps this module correct
 * under that test harness AND safe for the app's own actual call volume
 * (a handful of writes per workout session — the extra open/close cost is
 * immaterial).
 */

const DB_NAME = 'basicfit-rutina';
const DB_VERSION = 1;

function upgrade(db) {
  if (!db.objectStoreNames.contains('activeRutina')) {
    db.createObjectStore('activeRutina', { keyPath: 'key' });
  }
  if (!db.objectStoreNames.contains('sessions')) {
    const store = db.createObjectStore('sessions', { keyPath: 'id' });
    store.createIndex('by-status', 'status');
    store.createIndex('by-startedAt', 'startedAt');
  }
  if (!db.objectStoreNames.contains('lastWeights')) {
    db.createObjectStore('lastWeights', { keyPath: 'equipmentId' });
  }
}

async function withDb(fn) {
  const db = await openDB(DB_NAME, DB_VERSION, { upgrade });
  try {
    return await fn(db);
  } finally {
    db.close();
  }
}

export async function saveActiveRutina(rutina) {
  return withDb(async (db) => {
    await db.put('activeRutina', { key: 'current', rutina, importedAt: new Date().toISOString() });
  });
}

export async function getActiveRutina() {
  return withDb(async (db) => {
    const record = await db.get('activeRutina', 'current');
    return record ?? null;
  });
}

export async function clearActiveRutina() {
  return withDb(async (db) => {
    await db.delete('activeRutina', 'current');
  });
}

/**
 * Upserts a session (by id). Also mirrors every logged exercise's weight
 * into `lastWeights`, in the SAME transaction as the sessions write
 * (tech-plan.md's Decision: "single write path so it can't drift out of
 * sync with sessions" — an O(1)-lookup denormalized store instead of
 * scanning all sessions on every render to prefill a weight input).
 * Idempotent: re-saving an already-saved session just re-writes the same
 * lastWeights values.
 */
export async function saveSession(session) {
  return withDb(async (db) => {
    const tx = db.transaction(['sessions', 'lastWeights'], 'readwrite');
    const sessionsStore = tx.objectStore('sessions');
    const weightsStore = tx.objectStore('lastWeights');

    await sessionsStore.put(session);
    for (const ex of session.exercises || []) {
      if (ex.weightUsed != null && ex.completedAt) {
        await weightsStore.put({ equipmentId: ex.equipmentId, weight: ex.weightUsed, loggedAt: ex.completedAt });
      }
    }

    await tx.done;
  });
}

export async function getActiveSession() {
  return withDb(async (db) => {
    const activeSessions = await db.getAllFromIndex('sessions', 'by-status', 'active');
    return activeSessions[0] ?? null;
  });
}

/**
 * @param {{from?: string, to?: string}} range - inclusive ISO startedAt bounds, both optional
 * @returns newest-first
 */
export async function listSessions({ from, to } = {}) {
  return withDb(async (db) => {
    let sessions = await db.getAllFromIndex('sessions', 'by-startedAt');
    if (from) sessions = sessions.filter((s) => s.startedAt >= from);
    if (to) sessions = sessions.filter((s) => s.startedAt <= to);
    return sessions.reverse();
  });
}

export async function getLastWeight(equipmentId) {
  return withDb(async (db) => {
    const record = await db.get('lastWeights', equipmentId);
    return record ?? null;
  });
}

export async function setLastWeight(equipmentId, weight, loggedAt = new Date().toISOString()) {
  return withDb(async (db) => {
    await db.put('lastWeights', { equipmentId, weight, loggedAt });
  });
}
