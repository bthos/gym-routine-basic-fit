import React from 'react';
import { Icon } from '../../../design-system/components/primitives/Icon.jsx';
import { Button } from '../../../design-system/components/primitives/Button.jsx';
import { useInstallPrompt } from '../hooks/useInstallPrompt.js';

/**
 * Shown when Chromium fires `beforeinstallprompt` and the app is not yet
 * installed. Gives users an explicit "Add to Home Screen" path (spec.md
 * Render AC) instead of hiding behind the browser menu.
 */
export function InstallBanner() {
  const { canInstall, promptInstall, dismiss } = useInstallPrompt();

  if (!canInstall) return null;

  return (
    <div
      role="region"
      aria-label="Instalar aplicación"
      style={{
        background: 'var(--bf-purple-tint)',
        borderBottom: '1px solid var(--border-default)',
        padding: '10px var(--page-gutter)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexWrap: 'wrap',
      }}
    >
      <Icon name="smartphone" size={20} style={{ color: 'var(--bf-purple)', flexShrink: 0 }} />
      <p style={{ flex: 1, margin: 0, font: 'var(--text-body-sm)', color: 'var(--bf-ink-2)', minWidth: 200 }}>
        Instala la app para usarla sin conexión desde tu pantalla de inicio.
      </p>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <Button variant="primary" onClick={promptInstall} style={{ minHeight: 44 }}>
          Instalar
        </Button>
        <Button variant="ghost" onClick={dismiss} style={{ minHeight: 44 }}>
          Ahora no
        </Button>
      </div>
    </div>
  );
}
