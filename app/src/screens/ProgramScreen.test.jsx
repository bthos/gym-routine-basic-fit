import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProgramScreen } from './ProgramScreen.jsx';
import * as db from '../lib/db.js';

vi.mock('../lib/db.js');

// Minimal rutina fixture satisfying ProgramScreen's destructuring.
// Empty days/rules/notes to avoid exercise-card rendering complexity.
const RUTINA = {
  schemaVersion: 1,
  program: { name: 'Test', phaseName: 'Fase 1', phaseNumber: 1, durationWeeks: 4 },
  phaseInfo: { objective: 'Test objective', intensityPercent: '60%', restSeconds: 60, frequencyPerWeek: 3 },
  warmup: { durationMinutes: 5, steps: ['Warm up step'] },
  cooldown: { durationMinutes: 5, steps: ['Cool down step'] },
  days: [{ label: 'Lunes', exercises: [] }],
  rules: [],
  notes: [],
};

function renderOverview({ onGoImport = vi.fn(), onRutinaCleared = vi.fn() } = {}) {
  return {
    onGoImport,
    onRutinaCleared,
    ...render(
      <MemoryRouter initialEntries={['/program']}>
        <Routes>
          <Route
            path="/program"
            element={
              <ProgramScreen
                rutina={RUTINA}
                onGoImport={onGoImport}
                onRutinaCleared={onRutinaCleared}
              />
            }
          />
          <Route
            path="/program/:dayIndex"
            element={
              <ProgramScreen
                rutina={RUTINA}
                onGoImport={onGoImport}
                onRutinaCleared={onRutinaCleared}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    ),
  };
}

describe('ProgramScreen — program management actions (AC-1 through AC-6)', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    db.getActiveSession.mockResolvedValue(null);
    db.listSessions.mockResolvedValue([]);
    db.clearActiveRutina.mockResolvedValue(undefined);
  });

  // AC-1 -----------------------------------------------------------------------

  it('renders "Reemplazar programa" and "Eliminar programa" buttons', () => {
    renderOverview();
    expect(screen.getByRole('button', { name: /reemplazar programa/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /eliminar programa/i })).toBeInTheDocument();
  });

  // AC-2: Replace flow ---------------------------------------------------------

  it('calls onGoImport immediately when replacing with no active session', async () => {
    const user = userEvent.setup();
    const onGoImport = vi.fn();
    db.getActiveSession.mockResolvedValue(null);
    renderOverview({ onGoImport });

    await user.click(screen.getByRole('button', { name: /reemplazar programa/i }));

    await waitFor(() => expect(onGoImport).toHaveBeenCalledOnce());
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('shows replace-warn ConfirmSheet when active session exists', async () => {
    const user = userEvent.setup();
    db.getActiveSession.mockResolvedValue({ id: 's1', status: 'active' });
    renderOverview();

    await user.click(screen.getByRole('button', { name: /reemplazar programa/i }));

    await screen.findByRole('alertdialog');
    expect(screen.getByText('Sesión en curso')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ir a importar/i })).toBeInTheDocument();
  });

  it('calls onGoImport on confirming replace-warn sheet', async () => {
    const user = userEvent.setup();
    const onGoImport = vi.fn();
    db.getActiveSession.mockResolvedValue({ id: 's1', status: 'active' });
    renderOverview({ onGoImport });

    await user.click(screen.getByRole('button', { name: /reemplazar programa/i }));
    await screen.findByRole('alertdialog');
    await user.click(screen.getByRole('button', { name: /ir a importar/i }));

    expect(onGoImport).toHaveBeenCalledOnce();
  });

  it('dismisses replace-warn sheet on cancel', async () => {
    const user = userEvent.setup();
    db.getActiveSession.mockResolvedValue({ id: 's1', status: 'active' });
    renderOverview();

    await user.click(screen.getByRole('button', { name: /reemplazar programa/i }));
    await screen.findByRole('alertdialog');
    await user.click(screen.getByRole('button', { name: /cancelar/i }));

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  // AC-3: Remove flow — variant selection -------------------------------------

  it('shows variant-B ConfirmSheet (simple copy) when no history and no active session', async () => {
    const user = userEvent.setup();
    db.getActiveSession.mockResolvedValue(null);
    db.listSessions.mockResolvedValue([]);
    renderOverview();

    await user.click(screen.getByRole('button', { name: /eliminar programa/i }));

    const dialog = await screen.findByRole('alertdialog');
    expect(within(dialog).getByText('Eliminar programa')).toBeInTheDocument();
    expect(screen.getByText(/Podrás importar uno nuevo/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^eliminar$/i })).toBeInTheDocument();
  });

  it('shows variant-C ConfirmSheet (history-aware copy) when history exists but no active session', async () => {
    const user = userEvent.setup();
    db.getActiveSession.mockResolvedValue(null);
    db.listSessions.mockResolvedValue([{ id: 's1', status: 'completed' }]);
    renderOverview();

    await user.click(screen.getByRole('button', { name: /eliminar programa/i }));

    await screen.findByRole('alertdialog');
    expect(screen.getByText(/historial de sesiones se conserva/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /eliminar de todas formas/i })).toBeInTheDocument();
  });

  it('shows variant-D ConfirmSheet (session-in-progress) when active session exists', async () => {
    const user = userEvent.setup();
    db.getActiveSession.mockResolvedValue({ id: 's1', status: 'active' });
    renderOverview();

    await user.click(screen.getByRole('button', { name: /eliminar programa/i }));

    await screen.findByRole('alertdialog');
    expect(screen.getByText('Sesión en curso')).toBeInTheDocument();
    expect(screen.getByText(/Si eliminas el programa ahora/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /eliminar de todas formas/i })).toBeInTheDocument();
  });

  // AC-3: Remove confirm / cancel ---------------------------------------------

  it('calls clearActiveRutina and onRutinaCleared when remove is confirmed', async () => {
    const user = userEvent.setup();
    const onRutinaCleared = vi.fn();
    db.getActiveSession.mockResolvedValue(null);
    db.listSessions.mockResolvedValue([]);
    renderOverview({ onRutinaCleared });

    await user.click(screen.getByRole('button', { name: /eliminar programa/i }));
    await screen.findByRole('alertdialog');
    await user.click(screen.getByRole('button', { name: /^eliminar$/i }));

    await waitFor(() => expect(db.clearActiveRutina).toHaveBeenCalledOnce());
    expect(onRutinaCleared).toHaveBeenCalledOnce();
  });

  it('does not call clearActiveRutina when remove is cancelled', async () => {
    const user = userEvent.setup();
    renderOverview();

    await user.click(screen.getByRole('button', { name: /eliminar programa/i }));
    await screen.findByRole('alertdialog');
    await user.click(screen.getByRole('button', { name: /cancelar/i }));

    expect(db.clearActiveRutina).not.toHaveBeenCalled();
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  // AC-5: IDB error state -----------------------------------------------------

  it('shows inline error and stays on ProgramOverview when clearActiveRutina throws', async () => {
    const user = userEvent.setup();
    db.clearActiveRutina.mockRejectedValue(new Error('IDB write failed'));
    renderOverview();

    await user.click(screen.getByRole('button', { name: /eliminar programa/i }));
    await screen.findByRole('alertdialog');
    await user.click(screen.getByRole('button', { name: /^eliminar$/i }));

    const errorEl = await screen.findByRole('alert');
    expect(errorEl).toHaveTextContent(/Error al eliminar/i);
  });

  it('does not call onRutinaCleared when clearActiveRutina fails', async () => {
    const user = userEvent.setup();
    const onRutinaCleared = vi.fn();
    db.clearActiveRutina.mockRejectedValue(new Error('IDB write failed'));
    renderOverview({ onRutinaCleared });

    await user.click(screen.getByRole('button', { name: /eliminar programa/i }));
    await screen.findByRole('alertdialog');
    await user.click(screen.getByRole('button', { name: /^eliminar$/i }));

    await screen.findByRole('alert');
    expect(onRutinaCleared).not.toHaveBeenCalled();
  });
});
