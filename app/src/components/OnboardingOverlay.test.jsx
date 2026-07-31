import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OnboardingOverlay } from './OnboardingOverlay.jsx';

// onboarding-screens (AC1, AC2, AC3, AC4): pending Cmok implementation — see
// tech-plan.md and ux-design.md/mockups.md for the exact 4-step content and
// component structure. Failures here are expected until Cmok implements
// OnboardingOverlay.jsx.

vi.mock('../lib/onboardingStorage.js', () => ({
  hasSeenOnboarding: vi.fn().mockReturnValue(false),
  markOnboardingSeen: vi.fn(),
}));

import { markOnboardingSeen } from '../lib/onboardingStorage.js';

describe('OnboardingOverlay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders step 1 on mount, with no Atrás (Back) control', () => {
    render(<OnboardingOverlay onClose={() => {}} />);
    expect(screen.getByText(/tu entrenador/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /atrás/i })).not.toBeInTheDocument();
  });

  it('advances through all 4 steps via Siguiente, showing Atrás from step 2 onward', async () => {
    const user = userEvent.setup();
    render(<OnboardingOverlay onClose={() => {}} />);

    await user.click(screen.getByRole('button', { name: /siguiente/i }));
    expect(screen.getByText(/tú creas el plan con un llm/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /atrás/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /siguiente/i }));
    expect(screen.getByText(/así funciona/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /siguiente/i }));
    expect(screen.getByText(/ya puedes empezar/i)).toBeInTheDocument();
  });

  it('renders the relocated "How it works" 4-line flow on step 3 (AC4)', async () => {
    const user = userEvent.setup();
    render(<OnboardingOverlay onClose={() => {}} />);
    await user.click(screen.getByRole('button', { name: /siguiente/i }));
    await user.click(screen.getByRole('button', { name: /siguiente/i }));

    expect(screen.getByText(/rellena el prompt/i)).toBeInTheDocument();
    expect(screen.getByText(/c[oó]pialo en un chat llm/i)).toBeInTheDocument();
    expect(screen.getByText(/copia la respuesta json/i)).toBeInTheDocument();
    expect(screen.getByText(/imp[oó]rtala en la app/i)).toBeInTheDocument();
    expect(screen.getByText(/pasa/i)).toBeInTheDocument();
    expect(screen.getByText(/falla/i)).toBeInTheDocument();
  });

  it('step 4\'s primary button reads Empezar, not Siguiente', async () => {
    const user = userEvent.setup();
    render(<OnboardingOverlay onClose={() => {}} />);
    await user.click(screen.getByRole('button', { name: /siguiente/i }));
    await user.click(screen.getByRole('button', { name: /siguiente/i }));
    await user.click(screen.getByRole('button', { name: /siguiente/i }));

    expect(screen.getByRole('button', { name: /empezar/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^siguiente$/i })).not.toBeInTheDocument();
  });

  it('Atrás moves back a step', async () => {
    const user = userEvent.setup();
    render(<OnboardingOverlay onClose={() => {}} />);
    await user.click(screen.getByRole('button', { name: /siguiente/i }));
    expect(screen.getByText(/tú creas el plan con un llm/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /atrás/i }));
    expect(screen.getByText(/tu entrenador/i)).toBeInTheDocument();
  });

  it('Saltar (Skip) calls onClose and marks onboarding seen, from step 1', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<OnboardingOverlay onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: /saltar/i }));

    expect(markOnboardingSeen).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('Saltar (Skip) works identically from a later step (step 3)', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<OnboardingOverlay onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: /siguiente/i }));
    await user.click(screen.getByRole('button', { name: /siguiente/i }));

    await user.click(screen.getByRole('button', { name: /saltar/i }));

    expect(markOnboardingSeen).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('Empezar on step 4 calls onClose and marks onboarding seen', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<OnboardingOverlay onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: /siguiente/i }));
    await user.click(screen.getByRole('button', { name: /siguiente/i }));
    await user.click(screen.getByRole('button', { name: /siguiente/i }));

    await user.click(screen.getByRole('button', { name: /empezar/i }));

    expect(markOnboardingSeen).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('Escape key triggers the same close+mark-seen behavior as Saltar', () => {
    const onClose = vi.fn();
    render(<OnboardingOverlay onClose={onClose} />);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(markOnboardingSeen).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('announces progress via a visually-hidden aria-live region, updated per step', async () => {
    const user = userEvent.setup();
    render(<OnboardingOverlay onClose={() => {}} />);
    expect(screen.getByText(/paso 1 de 4/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /siguiente/i }));
    expect(screen.getByText(/paso 2 de 4/i)).toBeInTheDocument();
  });

  it('the dot indicator is decorative (aria-hidden), not the progress announcement', () => {
    const { container } = render(<OnboardingOverlay onClose={() => {}} />);
    const hiddenDots = container.querySelectorAll('[aria-hidden="true"]');
    expect(hiddenDots.length).toBeGreaterThan(0);
  });

  it('is a labelled dialog (role="dialog", aria-modal)', () => {
    render(<OnboardingOverlay onClose={() => {}} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });
});
