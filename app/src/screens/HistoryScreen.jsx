import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../../design-system/components/primitives/Icon.jsx';
import { Button } from '../../../design-system/components/primitives/Button.jsx';
import { listSessions } from '../lib/db.js';
import { buildExerciseTrends } from '../lib/trends.js';
import { difficultyLabel } from '../lib/difficulty.js';
import { formatRelativeDays } from '../lib/relativeTime.js';

function durationMinutes(session) {
  if (!session.endedAt) return null;
  return Math.max(0, Math.round((new Date(session.endedAt) - new Date(session.startedAt)) / 60000));
}

/** States: empty ("Aún no hay sesiones registradas") | success — ux-design.md. */
export function HistoryScreen() {
  const navigate = useNavigate();
  const [allSessions, setAllSessions] = useState(null); // null = loading

  useEffect(() => {
    let cancelled = false;
    listSessions().then((sessions) => {
      if (!cancelled) setAllSessions(sessions);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (allSessions === null) return null;

  const pastSessions = allSessions.filter((s) => s.status !== 'active');
  const trends = buildExerciseTrends(allSessions);

  if (pastSessions.length === 0) {
    return (
      <div style={{ background: 'var(--bf-grey-1)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--page-gutter)', textAlign: 'center' }}>
        <div style={{ color: 'var(--text-muted)', marginBottom: 12 }}>
          <Icon name="bar-chart-2" size={36} />
        </div>
        <h2 style={{ font: 'var(--text-h3)', color: 'var(--bf-ink)', margin: '0 0 6px' }}>Aún no hay sesiones registradas</h2>
        <p style={{ font: 'var(--text-body-sm)', color: 'var(--text-muted)', maxWidth: 280 }}>Empieza un entrenamiento desde Inicio para ver tu historial aquí.</p>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bf-grey-1)', minHeight: '100vh', paddingBottom: 100 }}>
      <div style={{ background: 'var(--bf-white)', borderBottom: '1px solid var(--border-default)', padding: 'var(--space-6) var(--page-gutter) var(--space-5)' }}>
        <h1 style={{ font: 'var(--text-h2)', textTransform: 'uppercase', color: 'var(--bf-ink)', margin: 0 }}>Historial</h1>
      </div>

      <div style={{ padding: 'var(--space-5) var(--page-gutter)', display: 'grid', gap: 10 }}>
        {pastSessions.map((s) => {
          const done = s.exercises.filter((e) => e.completedAt).length;
          const total = s.exercises.length;
          const minutes = durationMinutes(s);
          const incomplete = s.status === 'abandoned';
          return (
            <div key={s.id} style={{ background: 'var(--bf-white)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ font: '700 15px/1.3 var(--font-sans)', color: 'var(--bf-ink)' }}>{s.dayLabel}</span>
                <span style={{ font: 'var(--text-body-sm)', color: 'var(--text-muted)' }}>{formatRelativeDays(s.startedAt)}</span>
              </div>
              <div style={{ font: 'var(--text-body-sm)', color: incomplete ? 'var(--bf-danger)' : 'var(--text-muted)', marginTop: 4 }}>
                {done}/{total} completados{minutes != null ? ` · ${minutes} min` : ''}
                {incomplete ? ' · sesión sin terminar' : ''}
              </div>
            </div>
          );
        })}

        {trends.length > 0 && (
          <>
            <h2 style={{ font: 'var(--text-h3)', color: 'var(--bf-ink)', margin: 'var(--space-4) 0 0' }}>Por ejercicio</h2>
            {trends.map((t) => (
              <div key={t.equipmentId} style={{ background: 'var(--bf-white)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)' }}>
                <div style={{ font: '700 14px/1.3 var(--font-sans)', color: 'var(--bf-ink)', marginBottom: 6 }}>{t.name}</div>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', font: 'var(--text-body-sm)', color: 'var(--text-muted)' }}>
                  {t.entries.map((e, i) => (
                    <span key={i}>
                      {e.weightUsed != null ? `${e.weightUsed}kg · ` : ''}
                      {difficultyLabel(e.difficulty)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        <Button variant="primary" size="lg" style={{ width: '100%', marginTop: 8 }} onClick={() => navigate('/export')}>
          <Icon name="download" size={16} /> Exportar progreso
        </Button>
      </div>
    </div>
  );
}
