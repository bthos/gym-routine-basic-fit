/**
 * Per-exercise trend list for the History screen ("Por ejercicio": last N
 * logged weights/difficulties, newest first). Deliberately separate from
 * exportFormat.js's buildExportPayload: that function's json.exercises[id]
 * shape is a tested contract (exact {date,weightUsed,difficulty} tuples,
 * chronological ascending, no `name` field) — bolting a display-only `name`
 * field or a "last N" truncation onto it would risk breaking that contract
 * for no shared benefit, since the two consumers (LLM-paste export vs.
 * in-app trend list) have different shapes and ordering needs.
 */

/**
 * @param {Array} sessions - full session history (any status)
 * @param {{limit?: number}} options
 * @returns {Array<{equipmentId: string, name: string, entries: Array<{date, weightUsed, difficulty}>}>}
 *   newest-first, each capped at `limit` entries (default 3)
 */
export function buildExerciseTrends(sessions = [], { limit = 3 } = {}) {
  const order = []; // preserves first-seen equipmentId order
  const byEquipment = new Map();

  for (const session of sessions) {
    for (const ex of session.exercises || []) {
      if (ex.completedAt == null) continue;
      if (!byEquipment.has(ex.equipmentId)) {
        byEquipment.set(ex.equipmentId, { name: ex.name, entries: [] });
        order.push(ex.equipmentId);
      }
      byEquipment.get(ex.equipmentId).entries.push({
        date: ex.completedAt.slice(0, 10),
        weightUsed: ex.weightUsed,
        difficulty: ex.difficulty,
        completedAt: ex.completedAt,
      });
    }
  }

  return order.map((equipmentId) => {
    const group = byEquipment.get(equipmentId);
    const newestFirst = [...group.entries].sort((a, b) => (a.completedAt < b.completedAt ? 1 : -1));
    return {
      equipmentId,
      name: group.name,
      entries: newestFirst.slice(0, limit).map(({ date, weightUsed, difficulty }) => ({ date, weightUsed, difficulty })),
    };
  });
}
