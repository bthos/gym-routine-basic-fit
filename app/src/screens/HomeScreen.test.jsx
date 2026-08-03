import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { HomeScreen } from './HomeScreen.jsx';
import * as db from '../lib/db.js';

vi.mock('../lib/db.js');

/**
 * session-discard-and-history-delete — spec.md § C (AC10–AC13) and AC25.
 *
 * The reported bug: Inicio's first paint always offered "Empezar
 * entrenamiento" because `activeSession` started as null and was only filled
 * by an async IndexedDB read (HomeScreen.jsx:14,22). Tapping during that
 * window created a SECOND active session (HomeScreen.jsx:54-64).
 *
 * The fix moves active-session ownership up to the shell (tech-plan.md
 * Decision 3), so HomeScreen now receives it as props and can no longer paint
 * a start CTA before the answer is known:
 *
 *   activeSessionStatus  'loading' | 'ready' | 'error'
 *   activeSession        Session | null
 *   onRetryActiveSession () => void
 */

// Labels deliberately do NOT match Spanish weekday names, so resolveTodayDay()
// falls through to its completedIndexes branch — which is what AC25 exercises.
const RUTINA = {
  schemaVersion: 1,
  program: { name: 'Fuerza', phaseName: 'Fase 1', phaseNumber: 1, durationWeeks: 4 },
  days: [
    { label: 'Día 1', intro: 'Pecho y tríceps', exercises: [{ equipmentId: 'g3-s10', name: 'Prensa' }] },
    { label: 'Día 2', intro: 'Espalda', exercises: [{ equipmentId: 'g3-s20', name: 'Remo' }] },
    { label: 'Día 3', intro: 'Pierna', exercises: [{ equipmentId: 'g3-s30', name: 'Sentadilla' }] },
  ],
};

const ACTIVE_SESSION = {
  id: 'sess-active',
  dayLabel: 'Día 1',
  dayIndex: 0,
  status: 'active',
  startedAt: '2026-08-03T09:00:00.000Z',
  endedAt: null,
  exercises: [
    { equipmentId: 'g3-s10', name: 'Prensa', weightUsed: 40, difficulty: 'normal', completedAt: '2026-08-03T09:10:00.000Z' },
    { equipmentId: 'g3-s20', name: 'Remo', weightUsed: null, difficulty: null, completedAt: null },
    { equipmentId: 'g3-s30', name: 'Sentadilla', weightUsed: null, difficulty: null, completedAt: null },
  ],
};

function renderHome(props = {}) {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route
          path="/"
          element={
            <HomeScreen
              rutina={RUTINA}
              loadError={false}
              onGoImport={vi.fn()}
              activeSessionStatus="ready"
              activeSession={null}
              onRetryActiveSession={vi.fn()}
              {...props}
            />
          }
        />
        <Route path="/session" element={<div>SESSION SCREEN</div>} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  db.listSessions.mockResolvedValue([]);
  db.getActiveSession.mockResolvedValue(null);
  db.saveSession.mockResolvedValue(undefined);
});

describe('HomeScreen — active session accuracy (AC10–AC13)', () => {
  it('renders no start CTA while the active-session lookup is in flight (AC10)', () => {
    renderHome({ activeSessionStatus: 'loading', activeSession: null });

    // No paint, at any point in the load, may offer "start".
    expect(screen.queryByText(/empezar entrenamiento/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/reanudar entrenamiento/i)).not.toBeInTheDocument();
  });

  it('marks the loading card as busy without fake text (AC10)', () => {
    const { container } = renderHome({ activeSessionStatus: 'loading', activeSession: null });
    expect(container.querySelector('[aria-busy="true"]')).toBeTruthy();
  });

  it('describes the active session, not resolveTodayDay (AC12)', async () => {
    // resolveTodayDay() would propose "Día 1" here too, so the fixture makes
    // the active session a DIFFERENT day to prove where the label comes from.
    const onDay2 = { ...ACTIVE_SESSION, dayLabel: 'Día 2', dayIndex: 1 };
    renderHome({ activeSession: onDay2 });

    expect(await screen.findByText('Día 2')).toBeInTheDocument();
    expect(screen.getByText(/reanudar entrenamiento/i)).toBeInTheDocument();
    expect(screen.queryByText(/empezar entrenamiento/i)).not.toBeInTheDocument();
  });

  it('shows the active session progress as X / Y completados (AC12)', async () => {
    renderHome({ activeSession: ACTIVE_SESSION });
    expect(await screen.findByText(/1\s*\/\s*3 completados/i)).toBeInTheDocument();
  });

  it('resuming navigates to /session (AC12)', async () => {
    const user = userEvent.setup();
    renderHome({ activeSession: ACTIVE_SESSION });

    await user.click(await screen.findByRole('button', { name: /reanudar entrenamiento/i }));

    expect(await screen.findByText('SESSION SCREEN')).toBeInTheDocument();
    expect(db.saveSession).not.toHaveBeenCalled();
  });

  it('re-checks for an active session before creating one (AC11)', async () => {
    // The render-level guard is racy on its own: props can still say "no
    // active session" at the moment of the tap. This is the data-integrity
    // backstop — the start path must re-read and resume instead of creating.
    db.getActiveSession.mockResolvedValue(ACTIVE_SESSION);
    const user = userEvent.setup();
    renderHome({ activeSessionStatus: 'ready', activeSession: null });

    await user.click(await screen.findByRole('button', { name: /empezar entrenamiento/i }));

    await waitFor(() => expect(screen.getByText('SESSION SCREEN')).toBeInTheDocument());
    expect(db.saveSession).not.toHaveBeenCalled();
  });

  it('creates exactly one session when none is active (AC11)', async () => {
    const user = userEvent.setup();
    renderHome({ activeSessionStatus: 'ready', activeSession: null });

    await user.click(await screen.findByRole('button', { name: /empezar entrenamiento/i }));

    await waitFor(() => expect(db.saveSession).toHaveBeenCalledTimes(1));
    expect(db.saveSession.mock.calls[0][0]).toMatchObject({ status: 'active' });
  });

  it('surfaces a failed active-session read instead of showing start (AC13)', () => {
    renderHome({ activeSessionStatus: 'error', activeSession: null });

    expect(screen.getByText(/no se pudo comprobar si tienes un entrenamiento en curso/i)).toBeInTheDocument();
    expect(screen.queryByText(/empezar entrenamiento/i)).not.toBeInTheDocument();
  });

  it('offers a retry that re-runs the active-session read (AC13)', async () => {
    const onRetryActiveSession = vi.fn();
    const user = userEvent.setup();
    renderHome({ activeSessionStatus: 'error', activeSession: null, onRetryActiveSession });

    await user.click(screen.getByRole('button', { name: /reintentar/i }));

    expect(onRetryActiveSession).toHaveBeenCalledTimes(1);
  });

  it('keeps the corrupt-rutina full-screen error as it is today (AC24)', () => {
    renderHome({ loadError: true });
    expect(screen.getByText(/no se pudo leer tu rutina guardada/i)).toBeInTheDocument();
  });
});

describe('HomeScreen — day proposal after deletion (AC25)', () => {
  it('recomputes the proposed day from the surviving sessions (AC25)', async () => {
    // Day 1 completed → Inicio proposes Día 2.
    db.listSessions.mockResolvedValue([
      {
        id: 'a',
        dayLabel: 'Día 1',
        dayIndex: 0,
        status: 'completed',
        startedAt: '2026-08-01T09:00:00.000Z',
        endedAt: '2026-08-01T10:00:00.000Z',
        exercises: [],
      },
    ]);
    renderHome();

    expect(await screen.findByText('Día 2')).toBeInTheDocument();
  });

  it('falls back to the earliest uncompleted day once its session is deleted (AC25)', async () => {
    // Same screen, but the Día 1 session no longer exists — the proposal must
    // move back to Día 1. This is intended behaviour, not a defect, but it
    // must be a CORRECT recomputation rather than a stale one.
    db.listSessions.mockResolvedValue([]);
    renderHome();

    expect(await screen.findByText('Día 1')).toBeInTheDocument();
  });
});
