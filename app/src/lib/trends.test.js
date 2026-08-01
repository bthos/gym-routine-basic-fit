import { describe, it, expect } from 'vitest';
import { buildExerciseTrends } from './trends.js';

const SESSIONS = [
  {
    id: 's1',
    status: 'completed',
    exercises: [
      {
        equipmentId: 'g3-s10',
        name: 'Prensa',
        weightUsed: 30,
        difficulty: 'normal',
        completedAt: '2026-07-01T09:10:00.000Z',
      },
      {
        equipmentId: 'g3-s10',
        name: 'Prensa',
        weightUsed: 32,
        difficulty: 'normal',
        completedAt: '2026-07-08T09:10:00.000Z',
      },
      {
        equipmentId: 'g3-s10',
        name: 'Prensa',
        weightUsed: 35,
        difficulty: 'hard',
        completedAt: '2026-07-15T09:10:00.000Z',
      },
      {
        equipmentId: 'g3-s10',
        name: 'Prensa',
        weightUsed: 40,
        difficulty: 'hard',
        completedAt: '2026-07-22T09:10:00.000Z',
      },
    ],
  },
];

describe('buildExerciseTrends — History contract', () => {
  it('defaults to newest-first capped at 3', () => {
    const [trend] = buildExerciseTrends(SESSIONS);
    expect(trend.equipmentId).toBe('g3-s10');
    expect(trend.entries).toEqual([
      { date: '2026-07-22', weightUsed: 40, difficulty: 'hard' },
      { date: '2026-07-15', weightUsed: 35, difficulty: 'hard' },
      { date: '2026-07-08', weightUsed: 32, difficulty: 'normal' },
    ]);
  });

  it('limit: Infinity returns the full newest-first series', () => {
    const [trend] = buildExerciseTrends(SESSIONS, { limit: Infinity });
    expect(trend.entries).toHaveLength(4);
    expect(trend.entries[0].weightUsed).toBe(40);
    expect(trend.entries[3].weightUsed).toBe(30);
  });
});
