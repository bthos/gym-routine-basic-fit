import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmSheet } from './ConfirmSheet.jsx';

function renderSheet(props = {}) {
  return render(
    <ConfirmSheet
      title="Test title"
      description="Test body"
      primaryLabel="Confirm"
      onPrimary={vi.fn()}
      cancelLabel="Cancel"
      onCancel={vi.fn()}
      {...props}
    />
  );
}

describe('ConfirmSheet', () => {
  it('renders title, description, and action buttons', () => {
    renderSheet();
    expect(screen.getByText('Test title')).toBeInTheDocument();
    expect(screen.getByText('Test body')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('primary button uses purple background by default (danger=false)', () => {
    renderSheet({ danger: false });
    const btn = screen.getByRole('button', { name: /confirm/i });
    // Default variant="primary" → no bf-danger in inline style
    expect(btn.getAttribute('style') ?? '').not.toContain('bf-danger');
  });

  it('primary button uses danger (red) background when danger=true', () => {
    renderSheet({ danger: true });
    const btn = screen.getByRole('button', { name: /confirm/i });
    expect(btn.getAttribute('style')).toContain('bf-danger');
  });

  it('has role=alertdialog and aria-modal for accessibility', () => {
    renderSheet();
    const dialog = screen.getByRole('alertdialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });
});

/**
 * session-discard-and-history-delete.
 *
 * Two additions, both implemented ONCE here so all five call sites inherit
 * them (AC28): the end-session sheet, the discard confirm, both Historial
 * delete confirms, and the Import screen's re-import warning.
 *
 *   destructiveAction — DD-001's isolated escape hatch, rendered BETWEEN the
 *                       secondary button and Cancelar, fenced by hairlines.
 *   focus trap        — AC26/AC27, added at UAT because this feature is the
 *                       first to put a non-undoable destructive action behind
 *                       a sheet.
 */
describe('ConfirmSheet — destructiveAction slot (DD-001, AC4, AC28)', () => {
  it('renders the destructive action when provided', () => {
    renderSheet({
      secondaryLabel: 'Secondary',
      onSecondary: vi.fn(),
      destructiveAction: { label: 'Descartar sin guardar', onClick: vi.fn() },
    });
    expect(screen.getByRole('button', { name: 'Descartar sin guardar' })).toBeInTheDocument();
  });

  it('calls the destructive action handler on click', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    renderSheet({ destructiveAction: { label: 'Descartar sin guardar', onClick } });
    await user.click(screen.getByRole('button', { name: 'Descartar sin guardar' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('places the destructive action between the secondary button and cancel (DD-001)', () => {
    renderSheet({
      primaryLabel: 'Finalizar sesión',
      secondaryLabel: 'Sesión terminada sin completar',
      onSecondary: vi.fn(),
      cancelLabel: 'Cancelar',
      destructiveAction: { label: 'Descartar sin guardar', onClick: vi.fn() },
    });
    const labels = screen.getAllByRole('button').map((b) => b.textContent.trim());
    // Cancelar stays bottom-most: on a bottom-anchored sheet the bottom edge
    // is the thumb-drop zone, so the destructive action must not sit there.
    expect(labels).toEqual([
      'Finalizar sesión',
      'Sesión terminada sin completar',
      'Descartar sin guardar',
      'Cancelar',
    ]);
  });

  it('styles the destructive action distinctly from the recording outcomes (AC4)', () => {
    renderSheet({
      secondaryLabel: 'Sesión terminada sin completar',
      onSecondary: vi.fn(),
      destructiveAction: { label: 'Descartar sin guardar', onClick: vi.fn() },
    });
    const discard = screen.getByRole('button', { name: 'Descartar sin guardar' });
    const secondary = screen.getByRole('button', { name: 'Sesión terminada sin completar' });
    expect(discard.getAttribute('style')).toContain('bf-danger');
    expect(secondary.getAttribute('style') ?? '').not.toContain('bf-danger');
  });

  it('meets the 44px touch target bar (AC23 standard)', () => {
    renderSheet({ destructiveAction: { label: 'Descartar sin guardar', onClick: vi.fn() } });
    const discard = screen.getByRole('button', { name: 'Descartar sin guardar' });
    expect(discard.getAttribute('style')).toMatch(/min-height:\s*44px/);
  });

  it('renders identically when destructiveAction is absent (AC28 back-compat)', () => {
    const { container } = renderSheet({ secondaryLabel: 'Secondary', onSecondary: vi.fn() });
    expect(screen.queryByRole('button', { name: /descartar/i })).not.toBeInTheDocument();
    const labels = screen.getAllByRole('button').map((b) => b.textContent.trim());
    expect(labels).toEqual(['Confirm', 'Secondary', 'Cancel']);
    expect(container.querySelectorAll('button')).toHaveLength(3);
  });
});

describe('ConfirmSheet — focus containment (AC26, AC27)', () => {
  it('moves focus into the sheet on open (AC26)', async () => {
    renderSheet({ destructiveAction: { label: 'Descartar', onClick: vi.fn() } });
    const dialog = screen.getByRole('alertdialog');
    await waitFor(() => {
      expect(dialog.contains(document.activeElement)).toBe(true);
    });
  });

  it('wraps Tab from the last action back to the first (AC26)', async () => {
    const user = userEvent.setup();
    renderSheet({ secondaryLabel: 'Secondary', onSecondary: vi.fn() });
    const [first, , last] = screen.getAllByRole('button');

    last.focus();
    await user.tab();

    expect(document.activeElement).toBe(first);
  });

  it('wraps Shift+Tab from the first action back to the last (AC26)', async () => {
    const user = userEvent.setup();
    renderSheet({ secondaryLabel: 'Secondary', onSecondary: vi.fn() });
    const buttons = screen.getAllByRole('button');
    const first = buttons[0];
    const last = buttons[buttons.length - 1];

    first.focus();
    await user.tab({ shift: true });

    expect(document.activeElement).toBe(last);
  });

  it('returns focus to the opening element on close (AC26)', async () => {
    function Harness() {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>Terminar sesión</button>
          {open && (
            <ConfirmSheet
              title="Confirm"
              primaryLabel="Sí"
              onPrimary={() => setOpen(false)}
              cancelLabel="Cancelar"
              onCancel={() => setOpen(false)}
            />
          )}
        </>
      );
    }
    const user = userEvent.setup();
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'Terminar sesión' });

    trigger.focus();
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));

    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it('Escape closes the sheet via its cancel action (AC27)', async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();
    renderSheet({ onCancel });

    await user.keyboard('{Escape}');

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('ignores Escape while a destructive action is in flight (AC27)', async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();
    renderSheet({ onCancel, busy: true });

    await user.keyboard('{Escape}');

    // A transaction must never be orphaned mid-write by an Escape keypress.
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('disables every action while busy (AC27)', () => {
    renderSheet({
      secondaryLabel: 'Secondary',
      onSecondary: vi.fn(),
      destructiveAction: { label: 'Descartar', onClick: vi.fn() },
      busy: true,
    });
    for (const btn of screen.getAllByRole('button')) {
      expect(btn).toBeDisabled();
    }
  });
});
