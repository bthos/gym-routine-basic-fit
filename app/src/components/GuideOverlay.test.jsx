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

// llm-guide-zip-download: User UAT (2026-07-29) approved replacing the shipped
// 4-row "Download data files" card (llm-guide-file-downloads, 2026-07-25) with
// a single zip-archive row. Pending Cmok implementation — see ux-design.md +
// tech-plan.md for the exact component structure. Failures here are expected
// until that row is built.
describe('GuideOverlay — data archive download', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const ARCHIVE_FILENAME = 'rutina-data-files.zip';
  const ARCHIVE_PATH = 'data/rutina-data-files.zip';
  const BASE_URL = 'https://bthos.github.io/gym-routine-basic-fit/';
  const OLD_PER_FILE_NAMES = [
    'rutina.schema.json',
    'equipment.json',
    'gyms.json',
    'phase1-monday.json',
  ];

  it('renders a heading introducing the download card (AC1)', () => {
    render(<GuideOverlay locale="en" onClose={() => {}} />);
    expect(screen.getByText(/llm without web access/i)).toBeInTheDocument();
  });

  it('renders exactly one download row — the zip, not the four old per-file rows (AC1)', () => {
    render(<GuideOverlay locale="en" onClose={() => {}} />);
    expect(screen.getByText(ARCHIVE_FILENAME)).toBeInTheDocument();
    for (const oldName of OLD_PER_FILE_NAMES) {
      expect(screen.queryByText(oldName)).not.toBeInTheDocument();
    }
  });

  it('the row has a same-origin GitHub Pages href with the download attribute, not raw.githubusercontent.com (AC2)', () => {
    render(<GuideOverlay locale="en" onClose={() => {}} />);
    const link = screen.getByText(ARCHIVE_FILENAME).closest('a');
    expect(link).not.toBeNull();
    expect(link).toHaveAttribute('download');
    expect(link.getAttribute('href')).toBe(`${BASE_URL}${ARCHIVE_PATH}`);
  });

  it('the row is a single link reachable by an accessible name including the zip filename (a11y — one <a>, no nested controls)', () => {
    render(<GuideOverlay locale="en" onClose={() => {}} />);
    expect(screen.getByRole('link', { name: /rutina-data-files\.zip/i })).toBeInTheDocument();
  });

  it('renders the download row for es and be locales too', () => {
    const { unmount } = render(<GuideOverlay locale="es" onClose={() => {}} />);
    expect(screen.getByText(ARCHIVE_FILENAME)).toBeInTheDocument();
    unmount();

    render(<GuideOverlay locale="be" onClose={() => {}} />);
    expect(screen.getByText(ARCHIVE_FILENAME)).toBeInTheDocument();
  });
});
