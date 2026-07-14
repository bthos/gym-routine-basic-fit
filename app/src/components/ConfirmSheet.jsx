import React from 'react';
import { Button } from '../../../design-system/components/primitives/Button.jsx';

/**
 * Shared bottom-sheet confirm dialog — same visual pattern as the mockup's
 * ActiveSessionScreen "end session" dialog, factored out so it can also
 * back the Import screen's re-import discard warning (spec.md Render AC)
 * without duplicating the fixed-overlay/sheet markup twice.
 */
export function ConfirmSheet({ title, description, primaryLabel, onPrimary, secondaryLabel, onSecondary, cancelLabel = 'Cancelar', onCancel, danger = false }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(45,45,45,.5)', zIndex: 300, display: 'flex', alignItems: 'flex-end' }}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-sheet-title"
        style={{
          background: 'var(--bf-white)',
          width: '100%',
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
          padding: 'var(--space-6) var(--page-gutter) calc(var(--space-6) + env(safe-area-inset-bottom, 0px))',
        }}
      >
        <h3 id="confirm-sheet-title" style={{ font: 'var(--text-h3)', color: 'var(--bf-ink)', margin: '0 0 4px' }}>
          {title}
        </h3>
        {description && <p style={{ font: 'var(--text-body-sm)', color: 'var(--text-muted)', margin: '0 0 var(--space-5)' }}>{description}</p>}
        <div style={{ display: 'grid', gap: 10 }}>
          {onPrimary && (
            <Button
              variant="primary"
              style={{ width: '100%', ...(danger ? { background: 'var(--bf-danger)', borderColor: 'var(--bf-danger)' } : {}) }}
              onClick={onPrimary}
            >
              {primaryLabel}
            </Button>
          )}
          {onSecondary && (
            <Button variant="outline" style={{ width: '100%' }} onClick={onSecondary}>
              {secondaryLabel}
            </Button>
          )}
          {onCancel && (
            <Button variant="ghost" style={{ width: '100%' }} onClick={onCancel}>
              {cancelLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
