import { describe, it, expect } from 'vitest';
import {
  listLoggedExercises,
  buildWeightSeries,
  buildSessionVolumes,
  buildFrequencyGrid,
  buildFrequencyStats,
  localDateKey,
} from './progress.js';

const RUTINA = {
  days: [
    {
      label: 'Lunes',
      exercises: [
        { equipmentId: 'g3-s10', name: 'Prensa', sets: 3, reps: 10 },
        { equipmentId: 'g3-s20', name: 'Jalón', sets: 4, reps: 8 },
      ],
    },
  ],
};

function session(partial) {
  return {
    id: 's',
    dayLabel: 'Lunes',
    dayIndex: 0,
    status: 'completed',
    startedAt: '2026-07-06T09:00:00.000Z',
    endedAt: '2026-07-06T09:50:00.000Z',
    exercises: [],
    ...partial,
  };
}

describe('localDateKey', () => {
  it('formats a Date as YYYY-MM-DD in local time', () => {
    const d = new Date(2026, 6, 15, 22, 30); // Jul 15 local
    expect(localDateKey(d)).toBe('2026-07-15');
  });
});

describe('listLoggedExercises', () => {
  it('returns first-seen equipment with ≥1 completed entry', () => {
    const sessions = [
      session({
        id: 'a',
        exercises: [
          {
            equipmentId: 'g3-s10',
            name: 'Prensa',
            weightUsed: 30,
            difficulty: 'normal',
            completedAt: '2026-07-06T09:10:00.000Z',
          },
          {
            equipmentId: 'g3-s20',
            name: 'Jalón',
            weightUsed: null,
            difficulty: null,
            completedAt: null,
          },
        ],
      }),
      session({
        id: 'b',
        startedAt: '2026-07-08T09:00:00.000Z',
        endedAt: '2026-07-08T09:40:00.000Z',
        exercises: [
          {
            equipmentId: 'g3-s20',
            name: 'Jalón',
            weightUsed: 40,
            difficulty: 'hard',
            completedAt: '2026-07-08T09:15:00.000Z',
          },
          {
            equipmentId: 'g3-s10',
            name: 'Prensa',
            weightUsed: 32,
            difficulty: 'normal',
            completedAt: '2026-07-08T09:20:00.000Z',
          },
        ],
      }),
    ];
    expect(listLoggedExercises(sessions)).toEqual([
      { equipmentId: 'g3-s10', name: 'Prensa' },
      { equipmentId: 'g3-s20', name: 'Jalón' },
    ]);
  });

  it('returns [] when nothing is logged', () => {
    expect(listLoggedExercises([])).toEqual([]);
    expect(
      listLoggedExercises([
        session({
          exercises: [
            {
              equipmentId: 'g3-s10',
              name: 'Prensa',
              weightUsed: null,
              difficulty: null,
              completedAt: null,
            },
          ],
        }),
      ])
    ).toEqual([]);
  });
});

describe('buildWeightSeries', () => {
  it('returns chronological ascending uncapped points for one equipment', () => {
    const sessions = [
      session({
        id: 'newer',
        startedAt: '2026-07-20T09:00:00.000Z',
        endedAt: '2026-07-20T09:40:00.000Z',
        exercises: [
          {
            equipmentId: 'g3-s10',
            name: 'Prensa',
            weightUsed: 40,
            difficulty: 'hard',
            completedAt: '2026-07-20T09:10:00.000Z',
          },
        ],
      }),
      session({
        id: 'older',
        startedAt: '2026-07-06T09:00:00.000Z',
        endedAt: '2026-07-06T09:40:00.000Z',
        exercises: [
          {
            equipmentId: 'g3-s10',
            name: 'Prensa',
            weightUsed: 30,
            difficulty: 'normal',
            completedAt: '2026-07-06T09:10:00.000Z',
          },
        ],
      }),
      session({
        id: 'other',
        startedAt: '2026-07-10T09:00:00.000Z',
        endedAt: '2026-07-10T09:40:00.000Z',
        exercises: [
          {
            equipmentId: 'g3-s20',
            name: 'Jalón',
            weightUsed: 50,
            difficulty: 'normal',
            completedAt: '2026-07-10T09:10:00.000Z',
          },
        ],
      }),
    ];
    expect(buildWeightSeries(sessions, 'g3-s10')).toEqual([
      {
        date: '2026-07-06',
        weightUsed: 30,
        difficulty: 'normal',
        completedAt: '2026-07-06T09:10:00.000Z',
      },
      {
        date: '2026-07-20',
        weightUsed: 40,
        difficulty: 'hard',
        completedAt: '2026-07-20T09:10:00.000Z',
      },
    ]);
  });
});

describe('buildSessionVolumes', () => {
  it('computes sets×reps×weightUsed via current rutina join, chronological asc', () => {
    const sessions = [
      session({
        id: 's2',
        status: 'completed',
        startedAt: '2026-07-10T09:00:00.000Z',
        endedAt: '2026-07-10T09:50:00.000Z',
        exercises: [
          {
            equipmentId: 'g3-s10',
            name: 'Prensa',
            weightUsed: 40,
            difficulty: 'normal',
            completedAt: '2026-07-10T09:10:00.000Z',
          },
        ],
      }),
      session({
        id: 's1',
        status: 'completed',
        startedAt: '2026-07-06T09:00:00.000Z',
        endedAt: '2026-07-06T09:50:00.000Z',
        exercises: [
          {
            equipmentId: 'g3-s10',
            name: 'Prensa',
            weightUsed: 30,
            difficulty: 'normal',
            completedAt: '2026-07-06T09:10:00.000Z',
          },
          {
            equipmentId: 'g3-s20',
            name: 'Jalón',
            weightUsed: 50,
            difficulty: 'hard',
            completedAt: '2026-07-06T09:20:00.000Z',
          },
        ],
      }),
      session({
        id: 'active',
        status: 'active',
        startedAt: '2026-07-12T09:00:00.000Z',
        endedAt: null,
        exercises: [
          {
            equipmentId: 'g3-s10',
            name: 'Prensa',
            weightUsed: 99,
            difficulty: 'normal',
            completedAt: '2026-07-12T09:10:00.000Z',
          },
        ],
      }),
    ];
    // s1: 3*10*30 + 4*8*50 = 900 + 1600 = 2500
    // s2: 3*10*40 = 1200
    expect(buildSessionVolumes(sessions, RUTINA)).toEqual([
      { sessionId: 's1', date: '2026-07-06', volume: 2500 },
      { sessionId: 's2', date: '2026-07-10', volume: 1200 },
    ]);
  });

  it('excludes exercises missing from the current rutina and keeps 0-volume past sessions', () => {
    const sessions = [
      session({
        id: 'gone',
        startedAt: '2026-07-01T09:00:00.000Z',
        endedAt: '2026-07-01T09:20:00.000Z',
        exercises: [
          {
            equipmentId: 'retired-machine',
            name: 'Old',
            weightUsed: 100,
            difficulty: 'hard',
            completedAt: '2026-07-01T09:10:00.000Z',
          },
        ],
      }),
      session({
        id: 'abandoned-empty',
        status: 'abandoned',
        startedAt: '2026-07-02T09:00:00.000Z',
        endedAt: '2026-07-02T09:05:00.000Z',
        exercises: [
          {
            equipmentId: 'g3-s10',
            name: 'Prensa',
            weightUsed: null,
            difficulty: null,
            completedAt: null,
          },
        ],
      }),
    ];
    expect(buildSessionVolumes(sessions, RUTINA)).toEqual([
      { sessionId: 'gone', date: '2026-07-01', volume: 0 },
      { sessionId: 'abandoned-empty', date: '2026-07-02', volume: 0 },
    ]);
  });
});

describe('buildFrequencyGrid', () => {
  it('builds a 12×7 Mon-start grid with filled days that have completed work', () => {
    const todayKey = '2026-07-29'; // Wednesday
    const sessions = [
      session({
        id: 'a',
        startedAt: '2026-07-27T09:00:00.000Z', // Monday
        endedAt: '2026-07-27T10:00:00.000Z',
        exercises: [
          {
            equipmentId: 'g3-s10',
            name: 'Prensa',
            weightUsed: 30,
            difficulty: 'normal',
            completedAt: '2026-07-27T09:10:00.000Z',
          },
        ],
      }),
      session({
        id: 'skip',
        status: 'abandoned',
        startedAt: '2026-07-28T09:00:00.000Z',
        endedAt: '2026-07-28T09:05:00.000Z',
        exercises: [
          {
            equipmentId: 'g3-s10',
            name: 'Prensa',
            weightUsed: null,
            difficulty: null,
            completedAt: null,
          },
        ],
      }),
    ];
    const { cells, weeks } = buildFrequencyGrid(sessions, { weeks: 12, todayKey });
    expect(weeks).toBe(12);
    expect(cells).toHaveLength(84);
    const mon = cells.find((c) => c.date === '2026-07-27');
    const tue = cells.find((c) => c.date === '2026-07-28');
    expect(mon).toMatchObject({ filled: true });
    expect(tue).toMatchObject({ filled: false });
    expect(mon.ariaLabel).toMatch(/sesión/i);
    expect(tue.ariaLabel).toMatch(/sin sesión/i);
  });
});

describe('buildFrequencyStats', () => {
  it('counts last 7 / 30 days and streak from today or most recent session day', () => {
    const todayKey = '2026-07-29';
    const sessions = [
      session({
        id: 'd1',
        startedAt: '2026-07-28T09:00:00.000Z',
        endedAt: '2026-07-28T10:00:00.000Z',
        exercises: [
          {
            equipmentId: 'g3-s10',
            name: 'Prensa',
            weightUsed: 30,
            difficulty: 'normal',
            completedAt: '2026-07-28T09:10:00.000Z',
          },
        ],
      }),
      session({
        id: 'd2',
        startedAt: '2026-07-27T09:00:00.000Z',
        endedAt: '2026-07-27T10:00:00.000Z',
        exercises: [
          {
            equipmentId: 'g3-s10',
            name: 'Prensa',
            weightUsed: 30,
            difficulty: 'normal',
            completedAt: '2026-07-27T09:10:00.000Z',
          },
        ],
      }),
      session({
        id: 'old',
        startedAt: '2026-06-01T09:00:00.000Z',
        endedAt: '2026-06-01T10:00:00.000Z',
        exercises: [
          {
            equipmentId: 'g3-s10',
            name: 'Prensa',
            weightUsed: 30,
            difficulty: 'normal',
            completedAt: '2026-06-01T09:10:00.000Z',
          },
        ],
      }),
    ];
    // today empty → streak starts at 2026-07-28, then 27 → streak 2
    expect(buildFrequencyStats(sessions, { todayKey })).toEqual({
      last7: 2,
      last30: 2,
      streak: 2,
    });
  });

  it('returns zeros when there is no qualifying data', () => {
    expect(buildFrequencyStats([], { todayKey: '2026-07-29' })).toEqual({
      last7: 0,
      last30: 0,
      streak: 0,
    });
  });
});
