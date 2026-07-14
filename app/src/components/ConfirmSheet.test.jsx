import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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
