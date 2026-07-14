import { describe, it, expect } from 'vitest';
import { buildExportPayload } from './exportFormat.js';

const SESSIONS = [
  {
    id: 's1',
    dayLabel: 'Lunes',
    status: 'completed',
    startedAt: '2026-07-06T09:00:00.000Z',
    endedAt: '2026-07-06T09:50:00.000Z',
    exercises: [
      {
        equipmentId: 'g3-s10',
        name: 'Prensa de Pecho',
        weightUsed: 32,
        difficulty: 'hard',
        completedAt: '2026-07-06T09:10:00.000Z',
      },
    ],
  },
  {
    id: 's2',
    dayLabel: 'Lunes',
    status: 'completed',
    startedAt: '2026-07-08T09:00:00.000Z',
    endedAt: '2026-07-08T09:45:00.000Z',
    exercises: [
      {
        equipmentId: 'g3-s10',
        name: 'Prensa de Pecho',
        weightUsed: 32,
        difficulty: 'normal',
        completedAt: '2026-07-08T09:10:00.000Z',
      },
    ],
  },
  {
    id: 's3',
    dayLabel: 'Lunes',
    status: 'abandoned',
    startedAt: '2026-07-01T09:00:00.000Z',
    endedAt: '2026-07-01T09:20:00.000Z',
    exercises: [
      {
        equipmentId: 'g3-s10',
        name: 'Prensa de Pecho',
        weightUsed: null,
        difficulty: null,
        completedAt: null,
      },
    ],
  },
];

describe('buildExportPayload', () => {
  it('groups the json export by equipmentId in chronological order', () => {
    const { json } = buildExportPayload(SESSIONS);
    expect(json.exercises['g3-s10']).toEqual([
      { date: '2026-07-06', weightUsed: 32, difficulty: 'hard' },
      { date: '2026-07-08', weightUsed: 32, difficulty: 'normal' },
    ]);
  });

  it('excludes abandoned/unlogged entries from the per-exercise json rollup', () => {
    const { json } = buildExportPayload(SESSIONS);
    // 2, not 3 — the abandoned session logged nothing for this exercise
    expect(json.exercises['g3-s10']).toHaveLength(2);
  });

  it('markdown groups by exercise name+id and calls out skipped/abandoned sessions separately', () => {
    const { markdown } = buildExportPayload(SESSIONS);
    expect(markdown).toContain('Prensa de Pecho (g3-s10)');
    expect(markdown).toContain('32kg');
    expect(markdown).toMatch(/abandon/i);
  });

  it('filters by date range when from/to are given', () => {
    const { json } = buildExportPayload(SESSIONS, { from: '2026-07-07', to: '2026-07-31' });
    expect(json.exercises['g3-s10']).toEqual([
      { date: '2026-07-08', weightUsed: 32, difficulty: 'normal' },
    ]);
  });

  it('handles an empty session history without throwing', () => {
    const { json, markdown } = buildExportPayload([]);
    expect(json.exercises).toEqual({});
    expect(typeof markdown).toBe('string');
  });
});
