/**
 * "Today" resolution — resolves ux-design.md's flagged spec gap (spec.md
 * doesn't define how a day's free-text `label` maps to a real weekday).
 *
 * Heuristic (confirmed at architecture phase, tech-plan.md): best-effort
 * case/accent-insensitive match of days[].label against the Spanish weekday
 * name for `now`; falls back to the first day in days[] with no completed
 * session in pastSessions, else day 0 (schema's minItems:1 floor).
 */

const WEEKDAY_NAMES = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

// Explicit map rather than Unicode NFD-decomposition regex stripping — the
// day-label alphabet this heuristic ever needs to fold is Spanish weekday
// names, a small known set, so an explicit table is both simpler and
// unambiguous to review/maintain than a combining-diacritic regex.
const ACCENT_FOLD = {
  á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ü: 'u', ñ: 'n',
  Á: 'a', É: 'e', Í: 'i', Ó: 'o', Ú: 'u', Ü: 'u', Ñ: 'n',
};

function normalize(str) {
  return String(str)
    .trim()
    .toLowerCase()
    .split('')
    .map((ch) => ACCENT_FOLD[ch] || ch)
    .join('');
}

/**
 * @param {Array<{label: string}>} days - rutina.days
 * @param {Date} now
 * @param {Array<{dayIndex: number, status: string}>} pastSessions
 * @returns {{mode: 'today'|'next', index: number, day: object}}
 */
export function resolveTodayDay(days, now, pastSessions = []) {
  const weekday = normalize(WEEKDAY_NAMES[now.getDay()]);
  const todayIndex = days.findIndex((d) => normalize(d.label) === weekday);
  if (todayIndex !== -1) {
    return { mode: 'today', index: todayIndex, day: days[todayIndex] };
  }

  const completedIndexes = new Set(
    (pastSessions || []).filter((s) => s.status === 'completed').map((s) => s.dayIndex)
  );
  const nextIndex = days.findIndex((_, i) => !completedIndexes.has(i));
  const index = nextIndex === -1 ? 0 : nextIndex;
  return { mode: 'next', index, day: days[index] };
}
