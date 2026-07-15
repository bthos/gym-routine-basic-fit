import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GuideOverlay } from './GuideOverlay.jsx';

vi.mock('../data/guideContent.js', () => ({
  GUIDE_PROMPT: '### REQUEST\n1. Test field:\n\n### OUTPUT\nJSON only.',
  GUIDE_HTML: {
    en: '<p>Guide body</p>',
    es: '<p>Cuerpo de la guía</p>',
    be: '<p>Тэкст кіраўніцтва</p>',
  },
}));

describe('GuideOverlay — prompt copy', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows an editable prompt and a copy button', () => {
    render(<GuideOverlay locale="en" onClose={() => {}} />);
    const editor = screen.getByRole('textbox', { name: /llm prompt/i });
    expect(editor.value).toContain('### REQUEST');
    expect(screen.getByRole('button', { name: /^copy$/i })).toBeInTheDocument();
  });

  it('shows Copied feedback when Copy is clicked', async () => {
    const user = userEvent.setup();
    render(<GuideOverlay locale="en" onClose={() => {}} />);

    await user.click(screen.getByRole('button', { name: /^copy$/i }));

    expect(await screen.findByRole('button', { name: /^copied$/i })).toBeInTheDocument();
  });

  it('allows editing the prompt before copy', async () => {
    const user = userEvent.setup();
    render(<GuideOverlay locale="en" onClose={() => {}} />);

    const editor = screen.getByRole('textbox', { name: /llm prompt/i });
    await user.clear(editor);
    await user.type(editor, 'My filled prompt');

    expect(editor.value).toBe('My filled prompt');
  });
});
