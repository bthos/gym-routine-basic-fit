import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { SessionInProgressBanner } from './SessionInProgressBanner.jsx';

/**
 * session-discard-and-history-delete — spec.md AC14, AC15, AC16.
 *
 * The global in-progress indicator. A BottomTabBar dot was rejected at design
 * time because it CANNOT satisfy AC14: one NavLink cannot navigate to both "/"
 * and "/session". This is an in-flow banner in the shell's flex column, which
 * also keeps AC16 (tests/viewport-check.js tab-item offsetTop) structurally
 * safe — it never participates in the tab bar's flex row.
 */
const SESSION = {
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

function renderAt(path, props = {}) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <SessionInProgressBanner status="ready" session={SESSION} {...props} />
      <Routes>
        <Route path="/session" element={<div>SESSION SCREEN</div>} />
        <Route path="*" element={<div>OTHER SCREEN</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('SessionInProgressBanner — visibility (AC14)', () => {
  it.each(['/program', '/program/1', '/catalog', '/history', '/progress', '/export'])(
    'is visible on %s',
    (path) => {
      renderAt(path);
      expect(screen.getByRole('button', { name: /entrenamiento en curso/i })).toBeInTheDocument();
    }
  );

  it('is hidden on /session — it would point at the current screen', () => {
    renderAt('/session');
    expect(screen.queryByRole('button', { name: /entrenamiento en curso/i })).not.toBeInTheDocument();
  });

  it('is hidden on /import', () => {
    renderAt('/import');
    expect(screen.queryByRole('button', { name: /entrenamiento en curso/i })).not.toBeInTheDocument();
  });

  it('is hidden on Inicio — the Inicio card is already the resume affordance', () => {
    renderAt('/');
    expect(screen.queryByRole('button', { name: /entrenamiento en curso/i })).not.toBeInTheDocument();
  });

  it('is hidden when no session is active', () => {
    renderAt('/history', { session: null });
    expect(screen.queryByRole('button', { name: /entrenamiento en curso/i })).not.toBeInTheDocument();
  });

  it('is hidden while the active-session lookup is still loading', () => {
    renderAt('/history', { status: 'loading', session: null });
    // Never a flash of a stale or guessed banner.
    expect(screen.queryByRole('button', { name: /entrenamiento en curso/i })).not.toBeInTheDocument();
  });

  it('is hidden when the active-session read failed (fail-closed)', () => {
    renderAt('/history', { status: 'error', session: null });
    // Never claim a session that could not be read — Inicio reports the error
    // instead, because that is where the user acts on it (AC13).
    expect(screen.queryByRole('button', { name: /entrenamiento en curso/i })).not.toBeInTheDocument();
  });
});

describe('SessionInProgressBanner — content and behaviour (AC14, AC23)', () => {
  it('names the session and its progress in the accessible name (AC23)', () => {
    renderAt('/history');
    const banner = screen.getByRole('button', { name: /entrenamiento en curso/i });
    const name = banner.getAttribute('aria-label');
    expect(name).toMatch(/día 1/i);
    expect(name).toMatch(/1 de 3/i);
  });

  it('shows the day label and completed count', () => {
    renderAt('/history');
    const banner = screen.getByRole('button', { name: /entrenamiento en curso/i });
    expect(banner.textContent).toMatch(/día 1/i);
    expect(banner.textContent).toMatch(/1\s*\/\s*3/);
  });

  it('navigates to /session when activated (AC14)', async () => {
    const user = userEvent.setup();
    renderAt('/history');

    await user.click(screen.getByRole('button', { name: /entrenamiento en curso/i }));

    expect(await screen.findByText('SESSION SCREEN')).toBeInTheDocument();
  });

  it('meets the 44px touch target bar', () => {
    renderAt('/history');
    const banner = screen.getByRole('button', { name: /entrenamiento en curso/i });
    expect(banner.getAttribute('style')).toMatch(/min-height:\s*44px/);
  });

  it('truncates a long day label without dropping the progress counter', () => {
    const longLabel = { ...SESSION, dayLabel: 'Día 1 · Pecho, hombros, tríceps y core completo' };
    renderAt('/history', { session: longLabel });
    const banner = screen.getByRole('button', { name: /entrenamiento en curso/i });
    expect(banner.textContent).toMatch(/1\s*\/\s*3/);
  });
});
