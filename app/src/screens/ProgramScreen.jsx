import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '../../../design-system/components/sections/PageHeader.jsx';
import { SectionBanner } from '../../../design-system/components/composite/SectionBanner.jsx';
import { ExerciseCard } from '../../../design-system/components/composite/ExerciseCard.jsx';
import { SummaryTable } from '../../../design-system/components/composite/SummaryTable.jsx';
import { RuleItem } from '../../../design-system/components/primitives/RuleItem.jsx';
import { NoteItem } from '../../../design-system/components/primitives/NoteItem.jsx';
import { Icon } from '../../../design-system/components/primitives/Icon.jsx';
import { getEquipmentById, mainImageUrl, equipmentDisplayName } from '../data/equipment.js';
import { dayFocusLabels, muscleGroupLabels } from '../lib/muscleGroups.js';

const wrap = { maxWidth: 760, margin: '0 auto', padding: '0 var(--page-gutter)', display: 'grid', gap: 'var(--space-8)' };

function SectionTitle({ children }) {
  return <h2 style={{ font: 'var(--text-h2)', textTransform: 'uppercase', color: 'var(--bf-ink)', margin: '0 0 4px' }}>{children}</h2>;
}

/**
 * Data-driven rewrite of the mockup's RoutineScreen.jsx (tech-plan.md's
 * Porting Plan). ONE component, branching on whether :dayIndex is present
 * in the route — ProgramScreen({ rutina, dayIndex }) per tech-plan.md's
 * literal file layout (a single ProgramScreen.jsx, not two files): "/program"
 * is the day-list overview (phase info, warmup/cooldown, derived summary
 * table, rules, notes); "/program/:dayIndex" drills into one day's full
 * exercise render. Mirrors ux-design.md's "Program → Day list → Day detail"
 * flow, replacing the original single-page anchor-nav document.
 */
export function ProgramScreen({ rutina }) {
  const { dayIndex } = useParams();
  if (dayIndex === undefined) {
    return <ProgramOverview rutina={rutina} />;
  }
  return <ProgramDayDetail rutina={rutina} dayIndex={Number(dayIndex)} />;
}

function ProgramOverview({ rutina }) {
  const { program, phaseInfo, warmup, cooldown, days, rules, notes } = rutina;

  const phaseStats = [
    ['Intensidad', phaseInfo.intensityPercent],
    ['Descanso', `${phaseInfo.restSeconds} segundos`],
    ['Frecuencia', `${phaseInfo.frequencyPerWeek} días/semana`],
  ];

  // Generated from `days` at render time — never a separately authored
  // field (rutina.schema.json deliberately has no summaryTable property;
  // spec.md's Render AC requires this be derived, not authored).
  const summaryRows = days.map((day) => [
    day.label + (day.intro ? ` — ${day.intro}` : ''),
    dayFocusLabels(day.exercises).join(', ') || '—',
    String(day.exercises.length),
  ]);

  return (
    <div style={{ background: 'var(--bf-grey-1)', minHeight: '100vh', paddingBottom: 90 }}>
      <PageHeader title={program.name} subtitle={`${program.phaseName} · ${program.durationWeeks} semanas`} badge={`Fase ${program.phaseNumber}`} />
      <div style={{ ...wrap, paddingTop: 'var(--space-6)', paddingBottom: 'var(--space-10)' }}>
        <SectionBanner tone="neutral" title="Objetivos de esta fase" subtitle={phaseInfo.objective}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10, marginTop: 16 }}>
            {phaseStats.map(([k, v]) => (
              <div key={k} style={{ background: 'var(--bf-white)', borderRadius: 8, padding: 12, boxShadow: 'var(--shadow-card)' }}>
                <div style={{ font: '600 12px/1.3 var(--font-sans)', textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-muted)' }}>{k}</div>
                <div style={{ font: '700 15px/1.3 var(--font-sans)', marginTop: 2, color: 'var(--bf-ink)' }}>{v}</div>
              </div>
            ))}
          </div>
        </SectionBanner>

        <SectionBanner tone="brand" title="Calentamiento" subtitle={`Obligatorio · ${warmup.durationMinutes} minutos`} items={warmup.steps} />

        <section style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <SectionTitle>Días de entrenamiento</SectionTitle>
          <div style={{ display: 'grid', gap: 10 }}>
            {days.map((day, i) => (
              <Link
                key={i}
                to={`/program/${i}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  background: 'var(--bf-white)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-4)',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ font: '700 15px/1.3 var(--font-sans)', color: 'var(--bf-ink)' }}>
                    {day.label}
                    {day.intro ? ` — ${day.intro}` : ''}
                  </div>
                  <div style={{ font: 'var(--text-body-sm)', color: 'var(--text-muted)', marginTop: 2 }}>{dayFocusLabels(day.exercises).join(', ')}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', flexShrink: 0 }}>
                  <span style={{ font: 'var(--text-body-sm)' }}>
                    {day.exercises.length} ej.
                  </span>
                  <Icon name="chevron-right" size={18} />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <SectionBanner tone="ink" title="Enfriamiento" subtitle={`${cooldown.durationMinutes} minutos al final de cada sesión`} items={cooldown.steps} />

        <section style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <SectionTitle>Resumen semanal</SectionTitle>
          <div style={{ overflowX: 'auto' }}>
            <SummaryTable columns={['Día', 'Enfoque', 'Ejercicios']} rows={summaryRows} />
          </div>
        </section>

        {rules.length > 0 && (
          <section style={{ display: 'grid', gap: 'var(--space-4)' }}>
            <SectionTitle>Reglas generales</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
              {rules.map((rule, i) => (
                <RuleItem key={i} icon="info">
                  {rule}
                </RuleItem>
              ))}
            </div>
          </section>
        )}

        {notes.length > 0 && (
          <section style={{ display: 'grid', gap: 'var(--space-4)' }}>
            <SectionTitle>Notas</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
              {notes.map((note, i) => (
                <NoteItem key={i} title={note.title}>
                  {note.body}
                </NoteItem>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function ProgramDayDetail({ rutina, dayIndex }) {
  const navigate = useNavigate();
  const day = rutina.days[dayIndex];

  if (!day) {
    return (
      <div style={{ padding: 'var(--space-6) var(--page-gutter)' }}>
        <p>Día no encontrado.</p>
        <Link to="/program" style={{ color: 'var(--text-link)' }}>
          Volver al programa
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bf-grey-1)', minHeight: '100vh', paddingBottom: 90 }}>
      <div style={{ background: 'var(--bf-white)', borderBottom: '1px solid var(--border-default)', padding: 'var(--space-5) var(--page-gutter)' }}>
        <button
          onClick={() => navigate('/program')}
          style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', font: 'var(--text-body-sm)', marginBottom: 10 }}
        >
          <Icon name="chevron-left" size={16} /> Programa
        </button>
        <h1 style={{ font: 'var(--text-h2)', textTransform: 'uppercase', color: 'var(--bf-ink)', margin: 0 }}>{day.label}</h1>
        {day.intro && <p style={{ font: 'var(--text-body-sm)', color: 'var(--text-muted)', margin: '4px 0 0' }}>{day.intro}</p>}
      </div>

      <div style={{ ...wrap, paddingTop: 'var(--space-6)' }}>
        <section style={{ display: 'grid', gap: 'var(--space-4)' }}>
          {day.exercises.map((exercise, i) => {
            const equipment = getEquipmentById(exercise.equipmentId);
            const details = [
              { label: 'Series × Repeticiones', value: `${exercise.sets} × ${exercise.reps}` },
              { label: 'Descanso', value: `${exercise.restSeconds} segundos` },
            ];
            if (exercise.intensity) details.push({ label: 'Intensidad', value: exercise.intensity });

            return (
              <ExerciseCard
                key={i}
                number={i + 1}
                name={exercise.name}
                muscles={muscleGroupLabels(exercise.muscleGroups)}
                details={details}
                equipment={equipment ? `${equipment.series ? `Matrix ${equipment.series} ` : ''}${equipment.modelCode} — ${equipmentDisplayName(equipment)}` : exercise.equipmentId}
                imageUrl={equipment ? mainImageUrl(equipment) : undefined}
                steps={exercise.technique || []}
                videoHref={exercise.videoQuery ? `https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.videoQuery)}` : undefined}
              />
            );
          })}
        </section>
      </div>
    </div>
  );
}
