/**
 * Shared difficulty enum <-> display-label mapping.
 *
 * IMPORTANT (Bagnik build note #2, non-negotiable): the internal token is
 * `easy | normal | hard` and must never be renamed — sessionMachine.test.js
 * and exportFormat.test.js assert on the literal token `'normal'`. Only the
 * DISPLAY label changes per language (e.g. an English UI would render
 * "just right" for the `normal` token); this app's UI is Spanish-primary
 * throughout (design-system/readme.md), so the Spanish label is what ships.
 */
export const DIFFICULTY_LEVELS = [
  { id: 'easy', label: 'Fácil' },
  { id: 'normal', label: 'Normal' },
  { id: 'hard', label: 'Difícil' },
];

export function difficultyLabel(id) {
  return DIFFICULTY_LEVELS.find((d) => d.id === id)?.label ?? '';
}
