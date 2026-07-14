import { describe, it, expect } from 'vitest';
import { resolveTodayDay } from './today.js';

const WEEKDAY_DAYS = [
  { label: 'Lunes', exercises: [{ equipmentId: 'g3-s10' }] },
  { label: 'Miércoles', exercises: [{ equipmentId: 'g3-s30' }] },
  { label: 'Sábado', exercises: [{ equipmentId: 'g3-s70' }] },
];
const NONWEEKDAY_DAYS = [
  { label: 'Full Body A', exercises: [{ equipmentId: 'g3-s10' }] },
  { label: 'Full Body B', exercises: [{ equipmentId: 'g3-s30' }] },
];

describe('resolveTodayDay', () => {
  it('matches a weekday-named day label against the real current weekday', () => {
    const wednesday = new Date('2026-07-15T09:00:00'); // a Wednesday
    const result = resolveTodayDay(WEEKDAY_DAYS, wednesday, []);
    expect(result).toMatchObject({ mode: 'today', index: 1, day: WEEKDAY_DAYS[1] });
  });

  it('is accent- and case-insensitive when matching weekday labels', () => {
    const wednesday = new Date('2026-07-15T09:00:00');
    const days = [{ label: 'miercoles', exercises: [{ equipmentId: 'x' }] }];
    expect(resolveTodayDay(days, wednesday, [])).toMatchObject({ mode: 'today', index: 0 });
  });

  it('falls back to the next unstarted day when no label matches a weekday', () => {
    const anyDate = new Date('2026-07-15T09:00:00');
    const result = resolveTodayDay(NONWEEKDAY_DAYS, anyDate, []);
    expect(result).toMatchObject({ mode: 'next', index: 0, day: NONWEEKDAY_DAYS[0] });
  });

  it('skips to the next day that has no completed session when falling back', () => {
    const anyDate = new Date('2026-07-15T09:00:00');
    const completedSessions = [{ dayIndex: 0, status: 'completed' }];
    const result = resolveTodayDay(NONWEEKDAY_DAYS, anyDate, completedSessions);
    expect(result).toMatchObject({ mode: 'next', index: 1, day: NONWEEKDAY_DAYS[1] });
  });

  it('never crashes on a single-day rutina (schema minItems:1 floor)', () => {
    const oneDayRutina = [{ label: 'Full Body', exercises: [{ equipmentId: 'x' }] }];
    expect(() => resolveTodayDay(oneDayRutina, new Date(), [])).not.toThrow();
  });
});
