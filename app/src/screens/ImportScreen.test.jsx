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

vi.mock('../lib/onboardingStorage.js', () => ({
  hasSeenOnboarding: vi.fn().mockReturnValue(true),
  markOnboardingSeen: vi.fn(),
}));

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

// onboarding-screens (AC7): pending Cmok implementation — see tech-plan.md.
// Failures here are expected until Cmok adds the revisit link to
// ImportScreen.jsx.
describe('ImportScreen — onboarding revisit link (AC7)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not show the onboarding overlay on mount', () => {
    render(<ImportScreen />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens the onboarding overlay when the revisit link is clicked', async () => {
    const user = userEvent.setup();
    render(<ImportScreen />);

    await user.click(screen.getByRole('link', { name: /c[oó]mo funciona la app/i }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('dismissing the revisited onboarding overlay (Saltar) leaves ImportScreen interactive underneath (AC6)', async () => {
    const user = userEvent.setup();
    render(<ImportScreen />);

    await user.click(screen.getByRole('link', { name: /c[oó]mo funciona la app/i }));
    await user.click(screen.getByRole('button', { name: /saltar/i }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByLabelText(/rutina\.json/i)).toBeInTheDocument();
  });
});
