import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImportScreen } from './ImportScreen.jsx';

vi.mock('../lib/db.js', () => ({
  saveActiveRutina: vi.fn(),
  getActiveRutina: vi.fn().mockResolvedValue(null),
  getActiveSession: vi.fn().mockResolvedValue(null),
  listSessions: vi.fn().mockResolvedValue([]),
}));

vi.mock('../lib/guideLocale.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    detectGuideLocale: () => 'en',
  };
});

describe('ImportScreen — LLM guide link (AC1, AC2)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not show the guide overlay on mount', () => {
    render(<ImportScreen />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens the guide overlay when the link is clicked', async () => {
    const user = userEvent.setup();
    render(<ImportScreen />);

    await user.click(screen.getByRole('link', { name: /view the llm creation guide/i }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('LLM creation guide')).toBeInTheDocument();
  });

  it('dismisses the guide overlay when the close button is clicked', async () => {
    const user = userEvent.setup();
    render(<ImportScreen />);

    await user.click(screen.getByRole('link', { name: /view the llm creation guide/i }));
    await user.click(screen.getByRole('button', { name: /close/i }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
