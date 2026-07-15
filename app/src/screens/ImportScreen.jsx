import React, { useRef, useState } from 'react';
import { Icon } from '../../../design-system/components/primitives/Icon.jsx';
import { Button } from '../../../design-system/components/primitives/Button.jsx';
import { ConfirmSheet } from '../components/ConfirmSheet.jsx';
import { GuideOverlay } from '../components/GuideOverlay.jsx';
import { detectGuideLocale, GUIDE_LINK_TEXT } from '../lib/guideLocale.js';
import { validateImportedRutina } from '../lib/validateImport.js';
import { saveActiveRutina, getActiveRutina, getActiveSession, listSessions } from '../lib/db.js';
import exampleRutina from '../../../data/examples/phase1-monday.json';

/**
 * First-run empty state, and reachable later (from Home, not wired as a
 * bottom tab — ux-design.md) to replace the active program. States: empty |
 * loading | error | success (ux-design.md's States Matrix).
 */
export function ImportScreen({ onImported }) {
  const [text, setText] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [pendingRutina, setPendingRutina] = useState(null); // parsed+valid, awaiting discard-warning confirmation
  const fileInputRef = useRef(null);
  const guideLinkRef = useRef(null);
  const locale = detectGuideLocale(navigator.language);

  function handleFilePick(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setText(String(reader.result || ''));
      setErrors([]);
    };
    reader.readAsText(file);
    e.target.value = ''; // allow re-picking the same filename later
  }

  function loadExample() {
    setText(JSON.stringify(exampleRutina, null, 2));
    setErrors([]);
  }

  async function commitImport(rutina) {
    await saveActiveRutina(rutina);
    setPendingRutina(null);
    onImported && onImported();
  }

  function handleImport() {
    setLoading(true);
    // Deferred one tick so the "Validando..." state actually paints before
    // this (synchronous, fast) validation resolves — ux-design.md asks for
    // a brief spinner specifically to avoid a perceived double-tap, even
    // though the check itself has no real latency.
    setTimeout(async () => {
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (err) {
        setErrors([`JSON inválido: ${err.message}`]);
        setLoading(false);
        return;
      }

      const result = validateImportedRutina(parsed);
      if (!result.valid) {
        setErrors(result.errors);
        setLoading(false);
        return;
      }
      setErrors([]);

      // Re-import discard warning (spec.md Render AC): only relevant if
      // there's already an active rutina with a stake in it — an
      // in-progress session, or any session history at all.
      const [existing, activeSession, sessions] = await Promise.all([
        getActiveRutina(),
        getActiveSession(),
        listSessions(),
      ]);
      const hasStake = Boolean(activeSession) || sessions.length > 0;
      setLoading(false);

      if (existing && hasStake) {
        setPendingRutina(parsed);
      } else {
        await commitImport(parsed);
      }
    }, 0);
  }

  return (
    <div style={{ background: 'var(--bf-white)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'var(--space-10) var(--page-gutter) 100px' }}>
      <div style={{ font: '800 15px/1 var(--font-display)', color: 'var(--bf-orange)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 'var(--space-6)' }}>Basic-Fit</div>
      <div style={{ color: 'var(--bf-purple)', marginBottom: 12 }}>
        <Icon name="dumbbell" size={40} strokeWidth={1.6} />
      </div>
      <h1 style={{ font: 'var(--text-h2)', textTransform: 'uppercase', color: 'var(--bf-ink)', textAlign: 'center', margin: '0 0 6px' }}>Importa tu rutina para empezar</h1>
      <p style={{ font: 'var(--text-body-sm)', color: 'var(--text-muted)', textAlign: 'center', margin: '0 0 var(--space-6)', maxWidth: 340 }}>
        Pega el JSON generado por un LLM, o elige un archivo .json.
      </p>

      <div style={{ width: '100%', maxWidth: 420 }}>
        <label htmlFor="rutina-json" style={{ display: 'block', font: 'var(--text-label)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>
          rutina.json
        </label>
        <textarea
          id="rutina-json"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder="Pegar JSON aquí..."
          style={{
            width: '100%',
            boxSizing: 'border-box',
            font: '14px/1.5 monospace',
            color: 'var(--bf-ink)',
            border: `1px solid ${errors.length ? 'var(--bf-danger)' : 'var(--border-control)'}`,
            borderRadius: 'var(--radius-control)',
            padding: 12,
            resize: 'vertical',
          }}
        />

        {errors.length > 0 && (
          <div role="alert" style={{ marginTop: 10, background: 'var(--bf-danger-tint)', border: '1px solid var(--bf-danger)', borderRadius: 'var(--radius-md)', padding: '10px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, font: '700 13px/1.3 var(--font-sans)', color: 'var(--bf-danger)', marginBottom: 6 }}>
              <Icon name="alert-triangle" size={16} /> {errors.length} error{errors.length === 1 ? '' : 'es'} de validación
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 4 }}>
              {errors.map((e, i) => (
                <li key={i} style={{ font: '13px/1.4 monospace', color: 'var(--bf-ink-2)' }}>
                  {e}
                </li>
              ))}
            </ul>
            <p style={{ font: 'var(--text-caption)', color: 'var(--text-muted)', margin: '8px 0 0' }}>
              Copia estos errores y pégalos de vuelta en tu chat con el LLM para corregirlos.
            </p>
          </div>
        )}

        <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
          <input ref={fileInputRef} type="file" accept=".json,application/json" onChange={handleFilePick} style={{ display: 'none' }} />
          <Button variant="outline" style={{ width: '100%' }} onClick={() => fileInputRef.current && fileInputRef.current.click()}>
            <Icon name="download" size={16} style={{ transform: 'rotate(180deg)' }} /> Elegir archivo .json
          </Button>
          <Button variant="primary" disabled={!text || loading} style={{ width: '100%' }} onClick={handleImport}>
            {loading ? 'Validando...' : 'Importar'}
          </Button>
          {!text && (
            <Button variant="ghost" style={{ width: '100%' }} onClick={loadExample}>
              Cargar ejemplo
            </Button>
          )}
        </div>

        <p style={{ textAlign: 'center', font: 'var(--text-body-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-6)' }}>
          ¿No tienes un rutina.json?
          <br />
          <a
            ref={guideLinkRef}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowGuide(true);
            }}
            style={{ color: 'var(--text-link)', fontWeight: 600 }}
          >
            {GUIDE_LINK_TEXT[locale]}
          </a>
        </p>
      </div>

      {showGuide && (
        <GuideOverlay
          locale={locale}
          onClose={() => {
            setShowGuide(false);
            guideLinkRef.current?.focus();
          }}
        />
      )}

      {pendingRutina && (
        <ConfirmSheet
          title="Reemplazar rutina activa"
          description="Ya tienes un programa activo con sesiones guardadas. Importar este rutina.json lo reemplazará como programa activo — tu historial de sesiones se conserva, pero una sesión en curso podría quedar desactualizada."
          primaryLabel="Reemplazar"
          onPrimary={() => commitImport(pendingRutina)}
          cancelLabel="Cancelar"
          onCancel={() => setPendingRutina(null)}
        />
      )}
    </div>
  );
}
