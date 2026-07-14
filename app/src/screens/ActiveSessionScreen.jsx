import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../../design-system/components/primitives/Icon.jsx';
import { Button } from '../../../design-system/components/primitives/Button.jsx';
import { DetailItem } from '../../../design-system/components/primitives/DetailItem.jsx';
import { ConfirmSheet } from '../components/ConfirmSheet.jsx';
import { sessionReducer } from '../lib/sessionMachine.js';
import { getActiveRutina, getActiveSession, saveSession, getLastWeight } from '../lib/db.js';
import { DIFFICULTY_LEVELS, difficultyLabel } from '../lib/difficulty.js';

/** Joins this day's prescription (rutina) with the session's tracking record, by equipmentId. */
function mergeExercises(rutinaExercises, sessionExercises) {
  return rutinaExercises.map((rx) => {
    const tracking = sessionExercises.find((se) => se.equipmentId === rx.equipmentId) || {};
    return {
      ...rx,
      weightUsed: tracking.weightUsed ?? null,
      difficulty: tracking.difficulty ?? null,
      completedAt: tracking.completedAt ?? null,
    };
  });
}

/** Text-only difficulty picker — no emoji/icon (project's no-emoji-as-icons policy; a11y: difficulty is never color/icon-only). */
function DifficultyPicker({ value, onChange }) {
  return (
    <div role="radiogroup" aria-label="¿Cómo fue el ejercicio?" style={{ display: 'flex', gap: 8 }}>
      {DIFFICULTY_LEVELS.map((d) => {
        const selected = value === d.id;
        return (
          <button
            key={d.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(d.id)}
            style={{
              flex: 1,
              minHeight: 44,
              padding: '10px 4px',
              font: '700 13px/1.2 var(--font-sans)',
              letterSpacing: '.02em',
              borderRadius: 'var(--radius-control)',
              border: selected ? '2px solid var(--bf-purple)' : '1px solid var(--border-control)',
              background: selected ? 'var(--bf-purple-tint)' : 'var(--bf-white)',
              color: selected ? 'var(--bf-purple-dark)' : 'var(--bf-ink)',
              cursor: 'pointer',
            }}
          >
            {d.label}
          </button>
        );
      })}
    </div>
  );
}

function ExerciseLogCard({ ex, isExpanded, isNextPending, onToggle, onComplete, onUndo }) {
  const isDone = Boolean(ex.completedAt);
  const [weight, setWeight] = useState(ex.weightUsed ?? '');
  const [difficulty, setDifficulty] = useState(ex.difficulty ?? null);
  const weightInputRef = useRef(null);

  // Prefill: an already-done exercise being reopened shows ITS OWN logged
  // values (correction); a not-yet-done exercise becoming current prefills
  // from the last logged weight for that equipment id (ux-design.md's
  // single biggest one-handed-gym-use friction reducer).
  useEffect(() => {
    if (isDone) {
      setWeight(ex.weightUsed ?? '');
      setDifficulty(ex.difficulty ?? null);
      return undefined;
    }
    if (!isExpanded) return undefined;
    let cancelled = false;
    getLastWeight(ex.equipmentId).then((record) => {
      if (!cancelled && record) setWeight(record.weight);
    });
    return () => {
      cancelled = true;
    };
  }, [isExpanded, isDone, ex.equipmentId, ex.weightUsed, ex.difficulty]);

  // a11y checklist: current exercise's weight input receives focus automatically.
  useEffect(() => {
    if (isExpanded && weightInputRef.current) {
      weightInputRef.current.focus();
      weightInputRef.current.select();
    }
  }, [isExpanded]);

  const isCurrent = isExpanded || (isNextPending && !isDone);

  return (
    <div
      style={{
        background: 'var(--bf-white)',
        border: '1px solid var(--border-default)',
        borderLeft: isCurrent ? '3px solid var(--bf-purple)' : '3px solid transparent',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-4)',
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        style={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, width: '100%', boxSizing: 'border-box' }}
      >
        <span
          style={{
            width: 24,
            height: 24,
            flexShrink: 0,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isDone ? 'var(--bf-success)' : 'var(--bf-grey-2)',
            color: isDone ? 'var(--bf-white)' : 'var(--text-muted)',
          }}
        >
          {isDone ? <Icon name="check" size={14} strokeWidth={3} /> : null}
        </span>
        <span style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
          <div style={{ font: '700 15px/1.3 var(--font-sans)', color: 'var(--bf-ink)' }}>{ex.name}</div>
          {isDone && !isExpanded && (
            <div style={{ font: 'var(--text-body-sm)', color: 'var(--text-muted)' }}>
              {ex.weightUsed != null ? `${ex.weightUsed} kg · ` : ''}
              {difficultyLabel(ex.difficulty)}
            </div>
          )}
          {!isDone && !isExpanded && (
            <div style={{ font: 'var(--text-body-sm)', color: 'var(--text-muted)' }}>
              {ex.sets} × {ex.reps}
            </div>
          )}
        </span>
        {isNextPending && !isDone && !isExpanded && (
          <span style={{ font: '700 11px/1 var(--font-sans)', color: 'var(--bf-purple)', textTransform: 'uppercase', letterSpacing: '.04em' }}>Actual</span>
        )}
      </button>

      {isExpanded && (
        <div style={{ marginTop: 'var(--space-4)', display: 'grid', gap: 'var(--space-4)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px,1fr))', gap: 8 }}>
            <DetailItem label="Series × Reps" value={`${ex.sets} × ${ex.reps}`} />
            <DetailItem label="Descanso" value={`${ex.restSeconds} seg`} />
            {ex.intensity && <DetailItem label="Intensidad" value={ex.intensity} />}
          </div>

          <div>
            <label
              htmlFor={`weight-${ex.equipmentId}`}
              style={{ display: 'block', font: 'var(--text-label)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}
            >
              Peso usado (kg)
            </label>
            <input
              ref={weightInputRef}
              id={`weight-${ex.equipmentId}`}
              type="number"
              inputMode="decimal"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              onFocus={(e) => e.target.select()}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                font: '700 20px/1.2 var(--font-sans)',
                color: 'var(--bf-ink)',
                border: '1px solid var(--border-control)',
                borderRadius: 'var(--radius-control)',
                padding: '12px 14px',
              }}
            />
            <div style={{ font: 'var(--text-caption)', color: 'var(--text-muted)', marginTop: 4 }}>Prellenado con el último peso registrado para este equipo.</div>
          </div>

          <div>
            <div style={{ font: 'var(--text-label)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>¿Cómo fue?</div>
            <DifficultyPicker value={difficulty} onChange={setDifficulty} />
          </div>

          <Button variant="primary" disabled={!difficulty} onClick={() => onComplete(ex.equipmentId, weight === '' ? null : Number(weight), difficulty)}>
            <Icon name="check" size={16} /> Marcar completado
          </Button>
          {isDone && (
            <Button variant="ghost" onClick={() => onUndo(ex.equipmentId)}>
              Deshacer
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export function ActiveSessionScreen() {
  const navigate = useNavigate();
  const [rutina, setRutina] = useState(undefined);
  const [session, setSession] = useState(undefined); // undefined = loading, null = none found
  const [expandedId, setExpandedId] = useState(null);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    let cancelled = false;
    Promise.all([getActiveRutina(), getActiveSession()]).then(([activeRutina, activeSession]) => {
      if (cancelled) return;
      setRutina(activeRutina ? activeRutina.rutina : null);
      setSession(activeSession);
      if (activeSession && activeRutina) {
        const day = activeRutina.rutina.days[activeSession.dayIndex] || { exercises: [] };
        const merged = mergeExercises(day.exercises, activeSession.exercises);
        const firstPending = merged.find((e) => !e.completedAt);
        setExpandedId(firstPending ? firstPending.equipmentId : null);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const day = rutina && session ? rutina.days[session.dayIndex] : null;
  const merged = useMemo(() => (day && session ? mergeExercises(day.exercises, session.exercises) : []), [day, session]);
  const doneCount = merged.filter((e) => e.completedAt).length;
  const total = merged.length;
  const firstPendingId = merged.find((e) => !e.completedAt)?.equipmentId ?? null;

  // Defensive guard: /session is only reachable via Start/Resume (ux-design.md
  // States Matrix) — if there's genuinely no active session, don't render a
  // broken screen, send the user back to Home.
  useEffect(() => {
    if (session === null) navigate('/', { replace: true });
  }, [session, navigate]);

  if (!rutina || !session || !day) {
    return null;
  }

  function persist(next) {
    setSession(next);
    saveSession(next);
  }

  function handleComplete(equipmentId, weightUsed, difficulty) {
    const now = new Date().toISOString();
    const next = sessionReducer(session, { type: 'COMPLETE_EXERCISE', equipmentId, weightUsed, difficulty, now });
    persist(next);

    const completedEx = next.exercises.find((e) => e.equipmentId === equipmentId);
    setAnnouncement(`${completedEx.name} completado${weightUsed != null ? `, ${weightUsed} kilos` : ''}, ${difficultyLabel(difficulty).toLowerCase()}`);

    const nextMerged = mergeExercises(day.exercises, next.exercises);
    const nextPending = nextMerged.find((e) => !e.completedAt);
    setExpandedId(nextPending ? nextPending.equipmentId : null);
  }

  function handleUndo(equipmentId) {
    const next = sessionReducer(session, { type: 'UNDO_EXERCISE', equipmentId });
    persist(next);
    setExpandedId(equipmentId);
  }

  function handleFinish() {
    const next = sessionReducer(session, { type: 'FINISH', now: new Date().toISOString() });
    persist(next);
    setShowEndDialog(false);
    navigate('/');
  }

  function handleAbandon() {
    const next = sessionReducer(session, { type: 'ABANDON', now: new Date().toISOString() });
    persist(next);
    setShowEndDialog(false);
    navigate('/');
  }

  return (
    <div style={{ background: 'var(--bf-grey-1)', minHeight: '100vh', paddingBottom: 40 }}>
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>

      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'var(--bf-white)', borderBottom: '1px solid var(--border-default)', padding: 'var(--space-4) var(--page-gutter)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <button aria-label="Terminar sesión" onClick={() => setShowEndDialog(true)} style={{ all: 'unset', cursor: 'pointer', color: 'var(--bf-ink)', padding: 8 }}>
            <Icon name="x" size={20} />
          </button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ font: '700 15px/1.2 var(--font-sans)', color: 'var(--bf-ink)' }}>{session.dayLabel}</div>
            <div style={{ font: 'var(--text-body-sm)', color: 'var(--text-muted)' }}>
              {doneCount} / {total} completados
            </div>
          </div>
          <span style={{ width: 36 }} />
        </div>
        <div style={{ height: 4, background: 'var(--bf-grey-2)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${total ? (doneCount / total) * 100 : 0}%`, background: 'var(--bf-purple)', transition: 'width var(--motion-base)' }} />
        </div>
      </div>

      <div style={{ padding: 'var(--space-4) var(--page-gutter)', display: 'grid', gap: 10 }}>
        {merged.map((ex) => (
          <ExerciseLogCard
            key={ex.equipmentId}
            ex={ex}
            isExpanded={expandedId === ex.equipmentId}
            isNextPending={firstPendingId === ex.equipmentId}
            onToggle={() => setExpandedId(expandedId === ex.equipmentId ? null : ex.equipmentId)}
            onComplete={handleComplete}
            onUndo={handleUndo}
          />
        ))}
      </div>

      {showEndDialog && (
        <ConfirmSheet
          title="Terminar sesión"
          description={`${doneCount} de ${total} ejercicios completados.`}
          primaryLabel="Finalizar sesión"
          onPrimary={handleFinish}
          secondaryLabel="Sesión terminada sin completar"
          onSecondary={handleAbandon}
          cancelLabel="Cancelar"
          onCancel={() => setShowEndDialog(false)}
        />
      )}
    </div>
  );
}
