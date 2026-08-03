import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ActiveSessionScreen } from './ActiveSessionScreen.jsx';
import * as db from '../lib/db.js';
import { getEquipmentById, equipmentDisplayName } from '../data/equipment.js';

vi.mock('../lib/db.js');

const RICH_ID = 'g3-s70';
const SPARSE_ID = 'g3-s45'; // catalog entry exists but has no images[]
const UNRESOLVED_ID = 'mancuerna-libre-15kg';

const RICH_EQ = getEquipmentById(RICH_ID);
const RICH_NAME = `${RICH_EQ.series ? `Matrix ${RICH_EQ.series} ` : ''}${RICH_EQ.modelCode} — ${equipmentDisplayName(RICH_EQ)}`;

const SPARSE_EQ = getEquipmentById(SPARSE_ID);
const SPARSE_NAME = `${SPARSE_EQ.series ? `Matrix ${SPARSE_EQ.series} ` : ''}${SPARSE_EQ.modelCode} — ${equipmentDisplayName(SPARSE_EQ)}`;

const RUTINA = {
  schemaVersion: 1,
  program: { name: 'Test', phaseName: 'Fase 1', phaseNumber: 1, durationWeeks: 4 },
  days: [
    {
      label: 'Lunes',
      exercises: [
        {
          equipmentId: RICH_ID,
          name: 'Prensa',
          sets: 3,
          reps: 10,
          restSeconds: 75,
          intensity: 'RIR 2-3',
          technique: ['Ajusta el asiento', 'Empuja controladamente'],
          videoQuery: 'leg press machine form',
        },
        {
          equipmentId: SPARSE_ID,
          name: 'Sparse machine',
          sets: 3,
          reps: 12,
          restSeconds: 60,
          // no technique, no videoQuery — and catalog has no images
        },
        {
          equipmentId: UNRESOLVED_ID,
          name: 'Curl Bíceps Mancuerna',
          sets: 3,
          reps: 12,
          restSeconds: 60,
        },
      ],
    },
  ],
};

function makeSession(overrides = {}) {
  return {
    id: 'sess-1',
    dayLabel: 'Lunes',
    dayIndex: 0,
    status: 'active',
    startedAt: '2026-08-01T10:00:00.000Z',
    endedAt: null,
    exercises: RUTINA.days[0].exercises.map((ex) => ({
      equipmentId: ex.equipmentId,
      name: ex.name,
      weightUsed: null,
      difficulty: null,
      completedAt: null,
    })),
    ...overrides,
  };
}

function renderSession() {
  return render(
    <MemoryRouter initialEntries={['/session']}>
      <Routes>
        <Route path="/session" element={<ActiveSessionScreen />} />
        <Route path="/" element={<div>Home</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ActiveSessionScreen — equipment reference (AC1–AC5)', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    db.getActiveRutina.mockResolvedValue({ rutina: RUTINA, importedAt: '2026-08-01' });
    db.getActiveSession.mockResolvedValue(makeSession());
    db.getLastWeight.mockResolvedValue(null);
    db.saveSession.mockResolvedValue(undefined);
  });

  it('expanded card shows equipment reference button with catalog name (AC1)', async () => {
    renderSession();

    // First pending exercise auto-expands on load.
    const trigger = await screen.findByRole('button', { name: new RegExp(RICH_EQ.modelCode) });
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger.textContent).toContain(equipmentDisplayName(RICH_EQ));
    // Thumbnail present for catalog items with images (decorative alt="" — not in a11y tree).
    expect(trigger.querySelector('img')).toBeTruthy();
  });

  it('opens EquipmentReferenceSheet with technique and video on row tap (AC2)', async () => {
    const user = userEvent.setup();
    renderSession();

    const trigger = await screen.findByRole('button', { name: new RegExp(RICH_EQ.modelCode) });
    await user.click(trigger);

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(within(dialog).getByText(RICH_NAME)).toBeInTheDocument();
    expect(within(dialog).getByText('Ajusta el asiento')).toBeInTheDocument();
    const yt = within(dialog).getByRole('link', { name: /ver tutorial en youtube/i });
    expect(yt.getAttribute('href')).toContain(encodeURIComponent('leg press machine form'));
  });

  it('preserves weight and difficulty while sheet is open/closed (AC3)', async () => {
    const user = userEvent.setup();
    renderSession();

    const weightInput = await screen.findByLabelText(/peso usado/i);
    await user.clear(weightInput);
    await user.type(weightInput, '42');
    await user.click(screen.getByRole('radio', { name: /normal/i }));

    const trigger = screen.getByRole('button', { name: new RegExp(RICH_EQ.modelCode) });
    await user.click(trigger);
    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /cerrar/i }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

    expect(screen.getByLabelText(/peso usado/i)).toHaveValue(42);
    expect(screen.getByRole('radio', { name: /normal/i })).toBeChecked();
  });

  it('unresolved equipmentId renders as plain text without dialog trigger (AC4)', async () => {
    const user = userEvent.setup();
    // Expand the unresolved exercise: collapse current, expand target.
    renderSession();
    await screen.findByRole('button', { name: new RegExp(RICH_EQ.modelCode) });

    // Toggle: click the unresolved card's header (exercise name).
    await user.click(screen.getByRole('button', { name: /curl bíceps mancuerna/i }));

    expect(await screen.findByText(UNRESOLVED_ID)).toBeInTheDocument();
    // No dialog-opening equipment button for the unresolved id.
    expect(
      screen.queryAllByRole('button').filter((b) => b.getAttribute('aria-haspopup') === 'dialog')
        .every((b) => !b.textContent?.includes(UNRESOLVED_ID))
    ).toBe(true);
  });

  it('falls back to catalog equipment video when rutina omits videoQuery', async () => {
    const user = userEvent.setup();
    renderSession();
    await screen.findByRole('button', { name: new RegExp(RICH_EQ.modelCode) });

    // g3-s45: no images, no technique/videoQuery in fixture — but catalog has videos.
    await user.click(screen.getByRole('button', { name: /sparse machine/i }));
    const trigger = await screen.findByRole('button', { name: new RegExp(SPARSE_EQ.modelCode) });
    await user.click(trigger);

    const dialog = await screen.findByRole('dialog');
    const link = within(dialog).getByRole('link', { name: /ver tutorial en youtube/i });
    const expected = (SPARSE_EQ.videos?.es || SPARSE_EQ.videos?.en || [])[0]?.url;
    expect(link).toHaveAttribute('href', expected);
  });

  it('collapsed card does not show equipment row (AC5)', async () => {
    renderSession();
    // Rich card is expanded; unresolved + sparse stay collapsed.
    await screen.findByRole('button', { name: new RegExp(RICH_EQ.modelCode) });

    // Collapsed unresolved card header exists, but not the plain-text fallback
    // (that only appears when expanded).
    expect(screen.queryByText(UNRESOLVED_ID)).not.toBeInTheDocument();
    expect(screen.queryByText(SPARSE_NAME)).not.toBeInTheDocument();
  });
});

/**
 * session-discard-and-history-delete — spec.md § A (AC1–AC5).
 *
 * A third way to end a workout that records NOTHING. The end-session sheet
 * keeps its two recording outcomes untouched (AC24) and gains an isolated
 * "Descartar sin guardar" escape hatch (DD-001) which opens a second, danger
 * sheet (AC3). Discard is a hard delete via deleteSessions() — deliberately
 * NOT a sessionMachine transition, because it produces no session object
 * (tech-plan.md Decision 2).
 */
function renderSessionWith(props = {}) {
  return render(
    <MemoryRouter initialEntries={['/session']}>
      <Routes>
        <Route path="/session" element={<ActiveSessionScreen onSessionEnded={vi.fn()} {...props} />} />
        <Route path="/" element={<div>Home</div>} />
      </Routes>
    </MemoryRouter>
  );
}

async function openEndSheet(user) {
  await user.click(await screen.findByRole('button', { name: /terminar sesión/i }));
}

describe('ActiveSessionScreen — discard (AC1–AC5)', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    db.getActiveRutina.mockResolvedValue({ rutina: RUTINA, importedAt: '2026-08-01' });
    db.getActiveSession.mockResolvedValue(makeSession());
    db.getLastWeight.mockResolvedValue(null);
    db.saveSession.mockResolvedValue(undefined);
    db.deleteSessions.mockResolvedValue(undefined);
  });

  it('offers discard with zero exercises completed (AC2)', async () => {
    const user = userEvent.setup();
    renderSessionWith();
    await openEndSheet(user);

    // The "started by mistake" case — the whole point of the feature.
    expect(screen.getByRole('button', { name: /descartar sin guardar/i })).toBeInTheDocument();
  });

  it('offers discard with some exercises completed (AC2)', async () => {
    const partial = makeSession();
    partial.exercises[0] = {
      ...partial.exercises[0],
      weightUsed: 40,
      difficulty: 'normal',
      completedAt: '2026-08-01T10:15:00.000Z',
    };
    db.getActiveSession.mockResolvedValue(partial);
    const user = userEvent.setup();
    renderSessionWith();
    await openEndSheet(user);

    expect(screen.getByRole('button', { name: /descartar sin guardar/i })).toBeInTheDocument();
  });

  it('is distinct from the two recording outcomes (AC4)', async () => {
    const user = userEvent.setup();
    renderSessionWith();
    await openEndSheet(user);

    const discard = screen.getByRole('button', { name: /descartar sin guardar/i });
    const finish = screen.getByRole('button', { name: /finalizar sesión/i });
    const abandon = screen.getByRole('button', { name: /sesión terminada sin completar/i });

    // A user must not be able to confuse "no se guarda" with "sesión sin
    // terminar" — the abandoned outcome DOES record.
    expect(discard.getAttribute('style')).toContain('bf-danger');
    expect(finish.getAttribute('style') ?? '').not.toContain('bf-danger');
    expect(abandon.getAttribute('style') ?? '').not.toContain('bf-danger');
    expect(discard.textContent).not.toMatch(/sin completar/i);
  });

  it('confirms through a danger sheet stating it is not saved and cannot be undone (AC3)', async () => {
    const user = userEvent.setup();
    renderSessionWith();
    await openEndSheet(user);
    await user.click(screen.getByRole('button', { name: /descartar sin guardar/i }));

    const dialog = await screen.findByRole('alertdialog');
    expect(within(dialog).getByText(/¿descartar el entrenamiento\?/i)).toBeInTheDocument();
    expect(within(dialog).getByText(/no se guardará nada/i)).toBeInTheDocument();
    expect(within(dialog).getByText(/no se puede deshacer/i)).toBeInTheDocument();
    expect(
      within(dialog).getByRole('button', { name: /sí, descartar/i }).getAttribute('style')
    ).toContain('bf-danger');
  });

  it('cancelling the confirm leaves the session active and unchanged (AC3)', async () => {
    const user = userEvent.setup();
    renderSessionWith();
    await openEndSheet(user);
    await user.click(screen.getByRole('button', { name: /descartar sin guardar/i }));

    const dialog = await screen.findByRole('alertdialog');
    await user.click(within(dialog).getByRole('button', { name: /volver/i }));

    expect(db.deleteSessions).not.toHaveBeenCalled();
    // Returns to the end sheet, so a mis-tap costs one tap, not the decision.
    expect(await screen.findByRole('button', { name: /finalizar sesión/i })).toBeInTheDocument();
  });

  it('deletes the session record on confirm (AC1)', async () => {
    const user = userEvent.setup();
    renderSessionWith();
    await openEndSheet(user);
    await user.click(screen.getByRole('button', { name: /descartar sin guardar/i }));
    const dialog = await screen.findByRole('alertdialog');
    await user.click(within(dialog).getByRole('button', { name: /sí, descartar/i }));

    await waitFor(() => expect(db.deleteSessions).toHaveBeenCalledWith(['sess-1']));
    // Never persisted with a status — no 'discarded' flag exists (DD-003).
    expect(db.saveSession).not.toHaveBeenCalled();
  });

  it('navigates to Inicio after discarding (AC5)', async () => {
    const user = userEvent.setup();
    renderSessionWith();
    await openEndSheet(user);
    await user.click(screen.getByRole('button', { name: /descartar sin guardar/i }));
    const dialog = await screen.findByRole('alertdialog');
    await user.click(within(dialog).getByRole('button', { name: /sí, descartar/i }));

    expect(await screen.findByText('Home')).toBeInTheDocument();
  });

  it('refreshes the shell active-session state after discarding (AC15)', async () => {
    const onSessionEnded = vi.fn();
    const user = userEvent.setup();
    renderSessionWith({ onSessionEnded });
    await openEndSheet(user);
    await user.click(screen.getByRole('button', { name: /descartar sin guardar/i }));
    const dialog = await screen.findByRole('alertdialog');
    await user.click(within(dialog).getByRole('button', { name: /sí, descartar/i }));

    // Inicio and the banner must clear without a manual reload.
    await waitFor(() => expect(onSessionEnded).toHaveBeenCalled());
  });

  it('keeps the sheet open and does not navigate when the delete fails', async () => {
    db.deleteSessions.mockRejectedValue(new Error('IDB unavailable'));
    const user = userEvent.setup();
    renderSessionWith();
    await openEndSheet(user);
    await user.click(screen.getByRole('button', { name: /descartar sin guardar/i }));
    const dialog = await screen.findByRole('alertdialog');
    await user.click(within(dialog).getByRole('button', { name: /sí, descartar/i }));

    // The user must never land on Inicio believing the workout was discarded.
    expect(await within(dialog).findByText(/no se pudo descartar/i)).toBeInTheDocument();
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
  });

  it('still records FINISH and ABANDON as it does today (AC24)', async () => {
    const user = userEvent.setup();
    renderSessionWith();
    await openEndSheet(user);
    await user.click(screen.getByRole('button', { name: /finalizar sesión/i }));

    await waitFor(() => expect(db.saveSession).toHaveBeenCalled());
    expect(db.saveSession.mock.calls.at(-1)[0]).toMatchObject({ status: 'completed' });
    expect(db.deleteSessions).not.toHaveBeenCalled();
  });
});
