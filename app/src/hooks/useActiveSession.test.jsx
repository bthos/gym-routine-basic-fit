import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useActiveSession } from './useActiveSession.js';
import * as db from '../lib/db.js';

vi.mock('../lib/db.js');

/**
 * session-discard-and-history-delete — spec.md AC15 (and the mechanism behind
 * AC10 and AC13).
 *
 * Inicio, the in-progress banner, ActiveSessionScreen, ProgramScreen and
 * ImportScreen each called getActiveSession() independently before this
 * feature. AC15 requires the banner and Inicio to AGREE at all times and to
 * clear without a manual reload — which independent per-screen reads cannot
 * guarantee. This hook is mounted once in Shell and both consumers read it
 * (tech-plan.md Decision 3).
 *
 * The 'loading' first state is also what makes AC10 structural: HomeScreen
 * cannot paint a start CTA before the answer is known.
 */
const SESSION = {
  id: 'sess-active',
  dayLabel: 'Día 1',
  dayIndex: 0,
  status: 'active',
  startedAt: '2026-08-03T09:00:00.000Z',
  endedAt: null,
  exercises: [],
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useActiveSession (AC15)', () => {
  it('starts in loading with no session', () => {
    let resolve;
    db.getActiveSession.mockReturnValue(new Promise((r) => { resolve = r; }));

    const { result } = renderHook(() => useActiveSession());

    expect(result.current.status).toBe('loading');
    expect(result.current.session).toBeNull();
    resolve(null);
  });

  it('resolves to ready with the active session', async () => {
    db.getActiveSession.mockResolvedValue(SESSION);

    const { result } = renderHook(() => useActiveSession());

    await waitFor(() => expect(result.current.status).toBe('ready'));
    expect(result.current.session).toEqual(SESSION);
  });

  it('resolves to ready with null when no session is active', async () => {
    db.getActiveSession.mockResolvedValue(null);

    const { result } = renderHook(() => useActiveSession());

    await waitFor(() => expect(result.current.status).toBe('ready'));
    expect(result.current.session).toBeNull();
  });

  it('reports error when the read rejects, without falling back to null-ready (AC13)', async () => {
    db.getActiveSession.mockRejectedValue(new Error('IDB unavailable'));

    const { result } = renderHook(() => useActiveSession());

    await waitFor(() => expect(result.current.status).toBe('error'));
    // 'error' must be distinguishable from 'ready + no session': the first
    // means "unknown" and the second means "definitely none".
    expect(result.current.session).toBeNull();
  });

  it('refresh() re-reads and clears the session after it ends (AC15)', async () => {
    db.getActiveSession.mockResolvedValue(SESSION);
    const { result } = renderHook(() => useActiveSession());
    await waitFor(() => expect(result.current.session).toEqual(SESSION));

    // The session is finished / abandoned / discarded elsewhere.
    db.getActiveSession.mockResolvedValue(null);
    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.session).toBeNull();
    expect(result.current.status).toBe('ready');
  });

  it('refresh() recovers from an earlier error (AC13)', async () => {
    db.getActiveSession.mockRejectedValue(new Error('IDB unavailable'));
    const { result } = renderHook(() => useActiveSession());
    await waitFor(() => expect(result.current.status).toBe('error'));

    db.getActiveSession.mockResolvedValue(SESSION);
    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.status).toBe('ready');
    expect(result.current.session).toEqual(SESSION);
  });

  it('reads once on mount, not once per consumer', async () => {
    db.getActiveSession.mockResolvedValue(SESSION);

    const { result } = renderHook(() => useActiveSession());
    await waitFor(() => expect(result.current.status).toBe('ready'));

    expect(db.getActiveSession).toHaveBeenCalledTimes(1);
  });
});
