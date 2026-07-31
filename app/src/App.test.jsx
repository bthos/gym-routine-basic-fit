import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';

// onboarding-screens (AC1, AC2): pending Cmok implementation — see
// tech-plan.md. Failures here are expected until Cmok wires
// hasSeenOnboarding()/OnboardingOverlay into Shell. HomeScreen is stubbed so
// this file stays scoped to Shell's gating logic, not HomeScreen's own
// rendering/fixture needs (out of scope for this feature).

vi.mock('./lib/db.js', () => ({
  getActiveRutina: vi.fn(),
  saveActiveRutina: vi.fn(),
  getActiveSession: vi.fn().mockResolvedValue(null),
  listSessions: vi.fn().mockResolvedValue([]),
}));

vi.mock('./lib/onboardingStorage.js', () => ({
  hasSeenOnboarding: vi.fn(),
  markOnboardingSeen: vi.fn(),
}));

vi.mock('./screens/HomeScreen.jsx', () => ({
  HomeScreen: () => <div>Home stub</div>,
}));

import { getActiveRutina } from './lib/db.js';
import { hasSeenOnboarding } from './lib/onboardingStorage.js';

describe('App / Shell — onboarding gating', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.location.hash = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows the onboarding overlay when there is no active rutina and onboarding has not been seen (AC1)', async () => {
    getActiveRutina.mockResolvedValue(null);
    hasSeenOnboarding.mockReturnValue(false);

    render(<App />);

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });

  it('does not show onboarding — goes straight to ImportScreen — when onboarding has already been seen (AC2)', async () => {
    getActiveRutina.mockResolvedValue(null);
    hasSeenOnboarding.mockReturnValue(true);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByLabelText(/rutina\.json/i)).toBeInTheDocument();
    });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('does not show onboarding when a rutina already exists, even if onboarding has not been seen', async () => {
    getActiveRutina.mockResolvedValue({ rutina: { days: [] } });
    hasSeenOnboarding.mockReturnValue(false);

    render(<App />);

    await screen.findByText(/home stub/i);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('dismissing onboarding (Saltar) closes it and reveals ImportScreen underneath', async () => {
    getActiveRutina.mockResolvedValue(null);
    hasSeenOnboarding.mockReturnValue(false);
    const user = userEvent.setup();

    render(<App />);

    await screen.findByRole('dialog');
    await user.click(screen.getByRole('button', { name: /saltar/i }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(screen.getByLabelText(/rutina\.json/i)).toBeInTheDocument();
  });
});
