import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { HistoryScreen } from './HistoryScreen.jsx';
import * as db from '../lib/db.js';

vi.mock('../lib/db.js');

/**
 * session-discard-and-history-delete — spec.md § D (AC17–AC23) and AC20/AC21.
 *
 * Historial gains two delete affordances that share one storage call
 * (tech-plan.md Decision 1): a per-card trash for the fast single case, and a
 * selection mode ("Seleccionar" → tick → "Borrar (N)") for the bulk case.
 * Both confirm through a danger ConfirmSheet; there is no undo (DD-003).
 */
function logged(equipmentId, name, weightUsed, completedAt) {
  return { equipmentId, name, weightUsed, difficulty: 'normal', completedAt };
}

const SESSION_A = {
  id: 'sess-a',
  dayLabel: 'Día 1',
  dayIndex: 0,
  status: 'completed',
  startedAt: '2026-08-01T09:00:00.000Z',
  endedAt: '2026-08-01T09:48:00.000Z',
  exercises: [logged('g3-s10', 'Prensa de Pecho', 40, '2026-08-01T09:10:00.000Z')],
};

const SESSION_B = {
  id: 'sess-b',
  dayLabel: 'Día 2',
  dayIndex: 1,
  status: 'abandoned',
  startedAt: '2026-07-30T09:00:00.000Z',
  endedAt: '2026-07-30T09:20:00.000Z',
  exercises: [logged('g3-s20', 'Remo', 55, '2026-07-30T09:10:00.000Z')],
};

const ACTIVE = {
  id: 'sess-active',
  dayLabel: 'Día 3',
  dayIndex: 2,
  status: 'active',
  startedAt: '2026-08-03T09:00:00.000Z',
  endedAt: null,
  exercises: [],
};

function renderHistory() {
  return render(
    <MemoryRouter initialEntries={['/history']}>
      <HistoryScreen />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  db.listSessions.mockResolvedValue([SESSION_A, SESSION_B]);
  db.deleteSessions.mockResolvedValue(undefined);
});

describe('HistoryScreen — per-entry delete (AC17, AC19, AC23)', () => {
  it('exposes a delete action on each session card (AC17)', async () => {
    renderHistory();
    await screen.findByText('Día 1');

    expect(screen.getByRole('button', { name: /borrar sesión día 1/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /borrar sesión día 2/i })).toBeInTheDocument();
  });

  it('delete controls name which session they affect (AC23)', async () => {
    renderHistory();
    await screen.findByText('Día 1');

    // Never a bare "Borrar" — the accessible name must identify the session
    // by day label AND date, even when the visible label is truncated.
    const btn = screen.getByRole('button', { name: /borrar sesión día 1/i });
    expect(btn.getAttribute('aria-label')).toMatch(/día 1/i);
    expect(btn.getAttribute('aria-label')).not.toMatch(/^borrar$/i);
  });

  it('meets the 44px touch target bar (AC23)', async () => {
    renderHistory();
    await screen.findByText('Día 1');

    const btn = screen.getByRole('button', { name: /borrar sesión día 1/i });
    const style = btn.getAttribute('style') ?? '';
    expect(style).toMatch(/min-height:\s*44px/);
    expect(style).toMatch(/min-width:\s*44px/);
  });

  it('confirms a single delete with the session identity (AC19)', async () => {
    const user = userEvent.setup();
    renderHistory();
    await screen.findByText('Día 1');

    await user.click(screen.getByRole('button', { name: /borrar sesión día 1/i }));

    const dialog = await screen.findByRole('alertdialog');
    expect(within(dialog).getByText(/¿borrar esta sesión\?/i)).toBeInTheDocument();
    expect(within(dialog).getByText(/día 1/i)).toBeInTheDocument();
    expect(within(dialog).getByText(/no se puede deshacer/i)).toBeInTheDocument();
    // The prefill rollback (AC6/AC7) is invisible in the UI otherwise, so the
    // confirm is the only honest place to disclose it.
    expect(within(dialog).getByText(/pesos sugeridos/i)).toBeInTheDocument();
  });

  it('uses danger styling on the confirm primary (AC19)', async () => {
    const user = userEvent.setup();
    renderHistory();
    await screen.findByText('Día 1');

    await user.click(screen.getByRole('button', { name: /borrar sesión día 1/i }));
    const dialog = await screen.findByRole('alertdialog');

    expect(within(dialog).getByRole('button', { name: /^borrar$/i }).getAttribute('style')).toContain('bf-danger');
  });

  it('cancelling deletes nothing (AC19)', async () => {
    const user = userEvent.setup();
    renderHistory();
    await screen.findByText('Día 1');

    await user.click(screen.getByRole('button', { name: /borrar sesión día 1/i }));
    const dialog = await screen.findByRole('alertdialog');
    await user.click(within(dialog).getByRole('button', { name: /cancelar/i }));

    expect(db.deleteSessions).not.toHaveBeenCalled();
    expect(screen.getByText('Día 1')).toBeInTheDocument();
  });

  it('deletes the confirmed session through one deleteSessions call (AC17, AC9)', async () => {
    const user = userEvent.setup();
    renderHistory();
    await screen.findByText('Día 1');

    await user.click(screen.getByRole('button', { name: /borrar sesión día 1/i }));
    const dialog = await screen.findByRole('alertdialog');
    db.listSessions.mockResolvedValue([SESSION_B]);
    await user.click(within(dialog).getByRole('button', { name: /^borrar$/i }));

    await waitFor(() => expect(db.deleteSessions).toHaveBeenCalledTimes(1));
    expect(db.deleteSessions).toHaveBeenCalledWith(['sess-a']);
  });
});

describe('HistoryScreen — selection mode (AC18, AC19)', () => {
  it('enters selection mode from the header control (AC18)', async () => {
    const user = userEvent.setup();
    renderHistory();
    await screen.findByText('Día 1');

    await user.click(screen.getByRole('button', { name: /^seleccionar$/i }));

    expect(screen.getByRole('button', { name: /borrar \(0\)/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /seleccionar todo/i })).toBeInTheDocument();
  });

  it('replaces the per-card trash with a checkbox in selection mode (AC18)', async () => {
    const user = userEvent.setup();
    renderHistory();
    await screen.findByText('Día 1');

    await user.click(screen.getByRole('button', { name: /^seleccionar$/i }));

    // One delete affordance per row at a time — never both.
    expect(screen.queryByRole('button', { name: /borrar sesión día 1/i })).not.toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /seleccionar sesión día 1/i })).toBeInTheDocument();
  });

  it('ticks several sessions and deletes them in one action (AC18)', async () => {
    const user = userEvent.setup();
    renderHistory();
    await screen.findByText('Día 1');

    await user.click(screen.getByRole('button', { name: /^seleccionar$/i }));
    await user.click(screen.getByRole('checkbox', { name: /seleccionar sesión día 1/i }));
    await user.click(screen.getByRole('checkbox', { name: /seleccionar sesión día 2/i }));

    expect(screen.getByRole('button', { name: /borrar 2 sesiones seleccionadas/i })).toBeEnabled();

    await user.click(screen.getByRole('button', { name: /borrar 2 sesiones seleccionadas/i }));
    const dialog = await screen.findByRole('alertdialog');
    db.listSessions.mockResolvedValue([]);
    await user.click(within(dialog).getByRole('button', { name: /borrar 2/i }));

    // ONE call for both ids — never a per-id loop (AC9).
    await waitFor(() => expect(db.deleteSessions).toHaveBeenCalledTimes(1));
    expect(db.deleteSessions.mock.calls[0][0].sort()).toEqual(['sess-a', 'sess-b']);
  });

  it('confirms a bulk delete with the count (AC19)', async () => {
    const user = userEvent.setup();
    renderHistory();
    await screen.findByText('Día 1');

    await user.click(screen.getByRole('button', { name: /^seleccionar$/i }));
    await user.click(screen.getByRole('checkbox', { name: /seleccionar sesión día 1/i }));
    await user.click(screen.getByRole('checkbox', { name: /seleccionar sesión día 2/i }));
    await user.click(screen.getByRole('button', { name: /borrar 2 sesiones seleccionadas/i }));

    const dialog = await screen.findByRole('alertdialog');
    expect(within(dialog).getByText(/¿borrar 2 sesiones\?/i)).toBeInTheDocument();
    expect(within(dialog).getByText(/no se puede deshacer/i)).toBeInTheDocument();
  });

  it('uses singular copy for a single selected session (AC19)', async () => {
    const user = userEvent.setup();
    renderHistory();
    await screen.findByText('Día 1');

    await user.click(screen.getByRole('button', { name: /^seleccionar$/i }));
    await user.click(screen.getByRole('checkbox', { name: /seleccionar sesión día 1/i }));
    await user.click(screen.getByRole('button', { name: /borrar 1 sesión seleccionada/i }));

    // "¿Borrar 1 sesiones?" is visibly broken Spanish — plural agreement is a
    // correctness requirement here, not polish.
    const dialog = await screen.findByRole('alertdialog');
    expect(within(dialog).getByText(/¿borrar 1 sesión\?/i)).toBeInTheDocument();
  });

  it('selects and clears every session with the select-all toggle (AC18, DD-002)', async () => {
    const user = userEvent.setup();
    renderHistory();
    await screen.findByText('Día 1');

    await user.click(screen.getByRole('button', { name: /^seleccionar$/i }));
    await user.click(screen.getByRole('button', { name: /seleccionar todo/i }));

    expect(screen.getByRole('checkbox', { name: /seleccionar sesión día 1/i })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /seleccionar sesión día 2/i })).toBeChecked();

    await user.click(screen.getByRole('button', { name: /quitar selección/i }));

    expect(screen.getByRole('checkbox', { name: /seleccionar sesión día 1/i })).not.toBeChecked();
    expect(screen.getByRole('button', { name: /borrar \(0\)/i })).toBeDisabled();
  });

  it('leaving selection mode clears the selection and deletes nothing (AC18)', async () => {
    const user = userEvent.setup();
    renderHistory();
    await screen.findByText('Día 1');

    await user.click(screen.getByRole('button', { name: /^seleccionar$/i }));
    await user.click(screen.getByRole('checkbox', { name: /seleccionar sesión día 1/i }));
    await user.click(screen.getByRole('button', { name: /^cancelar$/i }));

    expect(db.deleteSessions).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /^seleccionar$/i })).toBeInTheDocument();

    // Re-entering starts clean.
    await user.click(screen.getByRole('button', { name: /^seleccionar$/i }));
    expect(screen.getByRole('checkbox', { name: /seleccionar sesión día 1/i })).not.toBeChecked();
  });

  it('announces the selection count politely (AC23)', async () => {
    const user = userEvent.setup();
    const { container } = renderHistory();
    await screen.findByText('Día 1');

    await user.click(screen.getByRole('button', { name: /^seleccionar$/i }));
    await user.click(screen.getByRole('checkbox', { name: /seleccionar sesión día 1/i }));

    const live = container.querySelector('[aria-live="polite"]');
    expect(live).toBeTruthy();
    expect(live.textContent).toMatch(/1 seleccionada/i);
  });

  it('hides the trends block and export CTA while selecting (AC18)', async () => {
    const user = userEvent.setup();
    renderHistory();
    await screen.findByText('Día 1');
    expect(screen.getByText('Por ejercicio')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^seleccionar$/i }));

    // "Exportar progreso" is a navigation that would silently discard the
    // selection; "Por ejercicio" is just noise mid-selection.
    expect(screen.queryByText('Por ejercicio')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /exportar progreso/i })).not.toBeInTheDocument();
  });
});

describe('HistoryScreen — after deletion (AC20, AC21, AC22)', () => {
  it('removes the session from the list and the trends block (AC20)', async () => {
    const user = userEvent.setup();
    renderHistory();
    await screen.findByText('Día 1');
    expect(screen.getByText('Prensa de Pecho')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /borrar sesión día 1/i }));
    const dialog = await screen.findByRole('alertdialog');
    db.listSessions.mockResolvedValue([SESSION_B]);
    await user.click(within(dialog).getByRole('button', { name: /^borrar$/i }));

    await waitFor(() => expect(screen.queryByText('Día 1')).not.toBeInTheDocument());
    // The trends block derives from the same list, so it must lose the entry too.
    expect(screen.queryByText('Prensa de Pecho')).not.toBeInTheDocument();
    expect(screen.getByText('Remo')).toBeInTheDocument();
  });

  it('exits selection mode after a successful bulk delete', async () => {
    const user = userEvent.setup();
    renderHistory();
    await screen.findByText('Día 1');

    await user.click(screen.getByRole('button', { name: /^seleccionar$/i }));
    await user.click(screen.getByRole('checkbox', { name: /seleccionar sesión día 1/i }));
    await user.click(screen.getByRole('button', { name: /borrar 1 sesión seleccionada/i }));
    const dialog = await screen.findByRole('alertdialog');
    db.listSessions.mockResolvedValue([SESSION_B]);
    await user.click(within(dialog).getByRole('button', { name: /borrar 1/i }));

    // The selection's referents are gone; staying in the mode with a stale
    // count would be incoherent.
    await waitFor(() => expect(screen.getByRole('button', { name: /^seleccionar$/i })).toBeInTheDocument());
  });

  it('returns to the empty state after deleting the last entry (AC21)', async () => {
    db.listSessions.mockResolvedValue([SESSION_A]);
    const user = userEvent.setup();
    renderHistory();
    await screen.findByText('Día 1');

    await user.click(screen.getByRole('button', { name: /borrar sesión día 1/i }));
    const dialog = await screen.findByRole('alertdialog');
    db.listSessions.mockResolvedValue([]);
    await user.click(within(dialog).getByRole('button', { name: /^borrar$/i }));

    expect(await screen.findByText(/aún no hay sesiones registradas/i)).toBeInTheDocument();
  });

  it('hides the selection control when there is nothing to select (AC21)', async () => {
    db.listSessions.mockResolvedValue([]);
    renderHistory();

    expect(await screen.findByText(/aún no hay sesiones registradas/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^seleccionar$/i })).not.toBeInTheDocument();
  });

  it('never lists or offers to delete the active session (AC22)', async () => {
    db.listSessions.mockResolvedValue([ACTIVE, SESSION_A]);
    const user = userEvent.setup();
    renderHistory();
    await screen.findByText('Día 1');

    // Discard (AC1) is the only path for an active session.
    expect(screen.queryByText('Día 3')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /borrar sesión día 3/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^seleccionar$/i }));
    expect(screen.queryByRole('checkbox', { name: /seleccionar sesión día 3/i })).not.toBeInTheDocument();
  });

  it('keeps the sheet open and the selection intact when a bulk delete fails', async () => {
    db.deleteSessions.mockRejectedValue(new Error('IDB unavailable'));
    const user = userEvent.setup();
    renderHistory();
    await screen.findByText('Día 1');

    await user.click(screen.getByRole('button', { name: /^seleccionar$/i }));
    await user.click(screen.getByRole('checkbox', { name: /seleccionar sesión día 1/i }));
    await user.click(screen.getByRole('button', { name: /borrar 1 sesión seleccionada/i }));
    const dialog = await screen.findByRole('alertdialog');
    await user.click(within(dialog).getByRole('button', { name: /borrar 1/i }));

    // One transaction means partial deletion is impossible, so the count
    // stays truthful and the user need not re-tick anything.
    expect(await within(dialog).findByText(/no se pudieron borrar/i)).toBeInTheDocument();
    expect(screen.getByText('Día 1')).toBeInTheDocument();
  });
});
