import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../../design-system/components/primitives/Icon.jsx';
import { Button } from '../../../design-system/components/primitives/Button.jsx';
import { Badge } from '../../../design-system/components/primitives/Badge.jsx';
import { resolveTodayDay } from '../lib/today.js';
import { createSession } from '../lib/sessionMachine.js';
import { getActiveSession, listSessions, saveSession } from '../lib/db.js';
import { formatRelativeDays } from '../lib/relativeTime.js';

/** States: success | error (storage corruption fallback) — ux-design.md. "empty" is the Import screen itself. */
export function HomeScreen({ rutina, loadError, onGoImport }) {
  const navigate = useNavigate();
  const [activeSession, setActiveSession] = useState(null);
  const [lastSession, setLastSession] = useState(null);
  const [pastSessions, setPastSessions] = useState([]);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (loadError) return;
    let cancelled = false;
    Promise.all([getActiveSession(), listSessions()]).then(([session, sessions]) => {
      if (cancelled) return;
      setActiveSession(session);
      setLastSession(sessions.find((s) => s.status !== 'active') || null);
      setPastSessions(sessions.map((s) => ({ dayIndex: s.dayIndex, status: s.status })));
    });
    return () => {
      cancelled = true;
    };
  }, [loadError, rutina]);

  if (loadError) {
    return (
      <div style={{ background: 'var(--bf-grey-1)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--page-gutter)', textAlign: 'center' }}>
        <div style={{ color: 'var(--bf-danger)', marginBottom: 12 }}>
          <Icon name="alert-triangle" size={36} />
        </div>
        <h2 style={{ font: 'var(--text-h3)', color: 'var(--bf-ink)', margin: '0 0 8px' }}>No se pudo leer tu rutina guardada</h2>
        <p style={{ font: 'var(--text-body-sm)', color: 'var(--text-muted)', maxWidth: 320, margin: '0 0 20px' }}>
          Los datos locales parecen dañados o incompletos. Vuelve a importar tu rutina.json.
        </p>
        <Button variant="primary" onClick={onGoImport}>
          Importar rutina
        </Button>
      </div>
    );
  }

  const today = resolveTodayDay(rutina.days, new Date(), pastSessions);
  const exerciseCount = today.day.exercises.length;
  const hasActiveSession = Boolean(activeSession);

  async function handleStart() {
    if (hasActiveSession) {
      navigate('/session');
      return;
    }
    setStarting(true);
    const session = createSession(today.day.label, today.index, today.day.exercises, new Date().toISOString());
    await saveSession(session);
    setStarting(false);
    navigate('/session');
  }

  return (
    <div style={{ background: 'var(--bf-grey-1)', minHeight: '100vh', paddingBottom: 90 }}>
      <div style={{ background: 'var(--bf-white)', borderBottom: '1px solid var(--border-default)', padding: 'var(--space-6) var(--page-gutter) var(--space-5)' }}>
        <div style={{ font: '800 13px/1 var(--font-display)', color: 'var(--bf-orange)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>Basic-Fit</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <h1 style={{ font: 'var(--text-h2)', textTransform: 'uppercase', color: 'var(--bf-ink)', margin: 0 }}>{rutina.program.name}</h1>
          <Badge tone="brand">Fase {rutina.program.phaseNumber}</Badge>
        </div>
      </div>

      <div style={{ padding: 'var(--space-6) var(--page-gutter)', display: 'grid', gap: 'var(--space-5)' }}>
        <div style={{ background: 'var(--bf-white)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ font: 'var(--text-label)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>
            {today.mode === 'today' ? 'Hoy' : 'Próximo'}
          </div>
          <h2 style={{ font: 'var(--text-h3)', color: 'var(--bf-ink)', margin: '0 0 4px' }}>{today.day.label}</h2>
          <p style={{ font: 'var(--text-body-sm)', color: 'var(--text-muted)', margin: '0 0 var(--space-5)' }}>
            {today.day.intro ? `${today.day.intro} · ` : ''}
            {exerciseCount} ejercicio{exerciseCount === 1 ? '' : 's'}
          </p>
          <Button variant="primary" size="lg" style={{ width: '100%' }} disabled={starting} onClick={handleStart}>
            <Icon name="play" size={18} /> {hasActiveSession ? 'Reanudar entrenamiento' : 'Empezar entrenamiento'}
          </Button>
        </div>

        {lastSession && (
          <div style={{ background: 'var(--bf-white)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)' }}>
            <div style={{ font: 'var(--text-label)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>Última sesión</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: lastSession.status === 'abandoned' ? 'var(--text-muted)' : 'var(--bf-success)' }}>
                <Icon name={lastSession.status === 'abandoned' ? 'x' : 'check'} size={20} />
              </span>
              <div>
                <div style={{ font: '700 14px/1.3 var(--font-sans)', color: 'var(--bf-ink)' }}>
                  {lastSession.dayLabel} · {formatRelativeDays(lastSession.startedAt)}
                </div>
                <div style={{ font: 'var(--text-body-sm)', color: 'var(--text-muted)' }}>
                  {lastSession.exercises.filter((e) => e.completedAt).length}/{lastSession.exercises.length} completados
                  {lastSession.status === 'abandoned' ? ' · sesión sin terminar' : ''}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
