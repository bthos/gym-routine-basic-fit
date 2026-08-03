import React from 'react';
import { Badge } from '../../../design-system/components/primitives/Badge.jsx';

/**
 * Shared chrome for main tab screens (Inicio / Programa / Catálogo / Historial /
 * Progreso). Keeps Basic-Fit wordmark, title scale, and gutters identical so
 * switching tabs does not resize or drop the brand.
 */
const BRAND_STYLE = {
  font: '800 15px/1 var(--font-display)',
  color: 'var(--bf-orange)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: 'var(--space-4)',
};

const TITLE_STYLE = {
  font: 'var(--text-h2)',
  textTransform: 'uppercase',
  color: 'var(--bf-ink)',
  letterSpacing: 'var(--tracking-heading)',
  margin: 0,
  minWidth: 0,
  flex: '1 1 12rem',
  overflowWrap: 'anywhere',
};

export function ScreenHeader({ title, subtitle, badge, badgeTone = 'brand', leading, trailing, children, style }) {
  return (
    <header
      style={{
        background: 'var(--bf-white)',
        borderBottom: '1px solid var(--border-default)',
        paddingBlock: 'var(--space-6) var(--space-5)',
        paddingInline: 'var(--page-pad-x)',
        ...style,
      }}
    >
      <div style={BRAND_STYLE} aria-hidden="true">Basic-Fit</div>
      {leading}
      {(title != null || trailing) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          {title != null && <h1 style={TITLE_STYLE}>{title}</h1>}
          {trailing}
        </div>
      )}
      {subtitle && (
        <p style={{ font: 'var(--text-body-sm)', color: 'var(--text-muted)', margin: '8px 0 0', maxWidth: 640 }}>
          {subtitle}
        </p>
      )}
      {badge != null && badge !== false && (
        <div style={{ marginTop: 'var(--space-4)' }}>
          {typeof badge === 'string' || typeof badge === 'number' ? (
            <Badge tone={badgeTone}>{badge}</Badge>
          ) : (
            badge
          )}
        </div>
      )}
      {children}
    </header>
  );
}
