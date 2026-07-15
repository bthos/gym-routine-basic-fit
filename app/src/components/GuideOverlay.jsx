import React, { useEffect, useRef } from 'react';
import { Icon } from '../../../design-system/components/primitives/Icon.jsx';
import { GUIDE_HTML } from '../data/guideContent.js';
import { GUIDE_CLOSE, GUIDE_TITLE } from '../lib/guideLocale.js';

/* Scoped styles for guide article content (pre-rendered HTML from Markdown). */
const ARTICLE_CSS = `
  .guide-article h1 { font: var(--text-h2); color: var(--bf-ink); margin: 0 0 16px; }
  .guide-article h2 { font: var(--text-h3); color: var(--bf-ink); margin: 24px 0 12px; }
  .guide-article h3 { font: var(--text-h4); color: var(--bf-ink); margin: 20px 0 8px; }
  .guide-article p  { margin: 8px 0; }
  .guide-article ul, .guide-article ol { padding-left: 20px; display: grid; gap: 6px; margin: 8px 0; }
  .guide-article li { margin: 0; }
  .guide-article strong { font-weight: 700; }
  .guide-article a { color: var(--text-link); }
  .guide-article blockquote {
    margin: 12px 0;
    padding: 10px 14px;
    border-left: 3px solid var(--bf-purple);
    background: var(--bf-grey-1);
    color: var(--bf-ink-2);
  }
  .guide-article table {
    width: 100%;
    border-collapse: collapse;
    font: 13px/1.4 var(--font-sans);
    margin: 12px 0;
    display: block;
    overflow-x: auto;
  }
  .guide-article th, .guide-article td {
    border: 1px solid var(--border-control);
    padding: 6px 10px;
    text-align: left;
    vertical-align: top;
  }
  .guide-article th { background: var(--bf-grey-1); font-weight: 700; }
  .guide-article code {
    font: 13px/1.4 monospace;
    background: var(--bf-grey-1);
    padding: 1px 5px;
    border-radius: 3px;
  }
  .guide-article pre {
    background: var(--bf-grey-1);
    border-radius: var(--radius-control);
    padding: 12px 14px;
    font: 13px/1.5 monospace;
    overflow-x: auto;
    white-space: pre-wrap;
    margin: 8px 0;
  }
  .guide-article pre code {
    background: none;
    padding: 0;
  }
`;

const FALLBACK_HTML = {
  es: '<p>No se pudo cargar la guía.</p>',
  en: '<p>Could not load the guide.</p>',
  be: '<p>Не ўдалося загрузіць кіраўніцтва.</p>',
};

/**
 * Full-screen in-app guide overlay (spec AC2).
 * Props:
 *   locale:  'es' | 'en' | 'be'
 *   onClose: () => void
 */
export function GuideOverlay({ locale = 'es', onClose }) {
  const closeRef = useRef(null);
  const title = GUIDE_TITLE[locale] || GUIDE_TITLE.en;
  const closeLabel = GUIDE_CLOSE[locale] || GUIDE_CLOSE.en;
  const html = GUIDE_HTML[locale] || GUIDE_HTML.en || FALLBACK_HTML[locale] || FALLBACK_HTML.en;

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape' && onClose) onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <>
      <style>{ARTICLE_CSS}</style>

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-overlay-title"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 400,
          background: 'var(--bf-white)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div style={{
          flexShrink: 0,
          background: 'var(--bf-white)',
          borderBottom: '1px solid var(--bf-grey-2)',
          padding: 'var(--space-4) var(--page-gutter)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span
            id="guide-overlay-title"
            style={{ font: 'var(--text-h4)', color: 'var(--bf-ink)' }}
          >
            {title}
          </span>

          <button
            ref={closeRef}
            type="button"
            aria-label={closeLabel}
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              background: 'none',
              border: 'none',
              borderRadius: 'var(--radius-control)',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: 'var(--space-6) var(--page-gutter) var(--space-10)',
        }}>
          <article
            className="guide-article"
            style={{
              font: 'var(--text-body-sm)',
              color: 'var(--bf-ink)',
              lineHeight: 1.6,
              maxWidth: 600,
              margin: '0 auto',
            }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </>
  );
}
