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

// llm-guide-file-downloads: User UAT (2026-07-25) approved an always-expanded
// "Download data files" card, sibling to the gym-hint card, no collapse/expand.
// Pending Cmok implementation — see ux-design.md + tech-plan.md for the exact
// component structure. Failures here are expected until that card is built.
describe('GuideOverlay — data file downloads', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const EXPECTED_FILES = [
    { filename: 'rutina.schema.json', path: 'data/schema/rutina.schema.json' },
    { filename: 'equipment.json', path: 'data/equipment.json' },
    { filename: 'gyms.json', path: 'data/gyms.json' },
    { filename: 'phase1-monday.json', path: 'data/examples/phase1-monday.json' },
  ];
  const BASE_URL = 'https://bthos.github.io/gym-routine-basic-fit/';

  it('renders a heading introducing the download card (AC1)', () => {
    render(<GuideOverlay locale="en" onClose={() => {}} />);
    expect(screen.getByText(/llm without web access/i)).toBeInTheDocument();
  });

  it('renders all four download rows immediately, with no expand step (AC1 — always-expanded per UAT)', () => {
    render(<GuideOverlay locale="en" onClose={() => {}} />);
    for (const { filename } of EXPECTED_FILES) {
      expect(screen.getByText(filename)).toBeInTheDocument();
    }
  });

  it('each row has a same-origin GitHub Pages href with the download attribute, not raw.githubusercontent.com (AC2)', () => {
    render(<GuideOverlay locale="en" onClose={() => {}} />);
    for (const { filename, path } of EXPECTED_FILES) {
      const link = screen.getByText(filename).closest('a');
      expect(link).not.toBeNull();
      expect(link).toHaveAttribute('download');
      expect(link.getAttribute('href')).toBe(`${BASE_URL}${path}`);
    }
  });

  it('shows the canonical filename verbatim per row, matching what the prompt tells users to attach (AC3)', () => {
    render(<GuideOverlay locale="en" onClose={() => {}} />);
    expect(screen.getByText('rutina.schema.json')).toBeInTheDocument();
    expect(screen.getByText('equipment.json')).toBeInTheDocument();
    expect(screen.getByText('gyms.json')).toBeInTheDocument();
    expect(screen.getByText('phase1-monday.json')).toBeInTheDocument();
  });

  it('each row is a single link reachable by an accessible name including its filename (a11y — one <a>, no nested controls)', () => {
    render(<GuideOverlay locale="en" onClose={() => {}} />);
    expect(screen.getByRole('link', { name: /rutina\.schema\.json/i })).toBeInTheDocument();
  });

  it('renders the download card for es and be locales too', () => {
    const { unmount } = render(<GuideOverlay locale="es" onClose={() => {}} />);
    expect(screen.getByText('rutina.schema.json')).toBeInTheDocument();
    unmount();

    render(<GuideOverlay locale="be" onClose={() => {}} />);
    expect(screen.getByText('rutina.schema.json')).toBeInTheDocument();
  });
});
