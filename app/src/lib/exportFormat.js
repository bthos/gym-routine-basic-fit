import { difficultyLabel } from './difficulty.js';

/**
 * Export formatter — turns session history into the two portable artifacts
 * spec.md's Export ACs ask for: a precise re-importable JSON payload, and a
 * Markdown summary written to be pasted into an LLM chat.
 *
 * Both outputs are derived from the SAME per-equipment chronological
 * grouping so they can never drift apart from each other.
 */

/** Groups every *logged* exercise (completedAt set) across sessions by equipmentId, chronological ascending. */
function groupByEquipment(sessions) {
  const groups = new Map(); // equipmentId -> { name, entries: [{date, weightUsed, difficulty}] }

  for (const session of sessions) {
    for (const ex of session.exercises || []) {
      if (ex.completedAt == null) continue; // abandoned/skipped/never-reached — contributes nothing (spec.md Export AC)
      if (!groups.has(ex.equipmentId)) {
        groups.set(ex.equipmentId, { name: ex.name, entries: [] });
      }
      groups.get(ex.equipmentId).entries.push({
        date: ex.completedAt.slice(0, 10),
        weightUsed: ex.weightUsed,
        difficulty: ex.difficulty,
      });
    }
  }

  for (const group of groups.values()) {
    group.entries.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  }

  return groups;
}

function inRange(dateStr, from, to) {
  if (from && dateStr < from) return false;
  if (to && dateStr > to) return false;
  return true;
}

function formatEntryLine(entry) {
  return `${entry.weightUsed}kg / ${difficultyLabel(entry.difficulty).toLowerCase()}`;
}

/**
 * @param {Array} sessions - full session history (any status)
 * @param {{from?: string, to?: string}} range - inclusive YYYY-MM-DD bounds, both optional
 * @returns {{json: {exercises: Record<string, Array<{date:string, weightUsed:number, difficulty:string}>>}, markdown: string}}
 */
export function buildExportPayload(sessions = [], { from, to } = {}) {
  const groups = groupByEquipment(sessions);

  const json = { exercises: {} };
  const lines = [];

  for (const [equipmentId, group] of groups) {
    const entries = group.entries.filter((e) => inRange(e.date, from, to));
    if (entries.length === 0) continue;

    json.exercises[equipmentId] = entries.map(({ date, weightUsed, difficulty }) => ({ date, weightUsed, difficulty }));

    lines.push(`${group.name} (${equipmentId})`);
    entries.forEach((e) => lines.push(`  · ${formatEntryLine(e)}`));
    lines.push('');
  }

  const abandonedSessions = sessions.filter(
    (s) => s.status === 'abandoned' && inRange((s.startedAt || '').slice(0, 10), from, to)
  );
  if (abandonedSessions.length > 0) {
    lines.push('Sesiones sin completar:');
    abandonedSessions.forEach((s) => lines.push(`  · ${s.dayLabel} — ${(s.startedAt || '').slice(0, 10)} (abandonada)`));
    lines.push('');
  }

  const markdown = lines.length > 0 ? lines.join('\n').trimEnd() : 'Sin sesiones registradas todavía.';

  return { json, markdown };
}
