const DSHist = window.BasicFitDesignSystem_1cb8a2;
const { Icon: HistIcon, Button: HistButton } = DSHist;

const SESSIONS = [
  { day: "Miércoles", when: "hace 2 días", done: 6, total: 6, minutes: 52 },
  { day: "Lunes", when: "hace 4 días", done: 5, total: 6, minutes: 41, incomplete: true },
  { day: "Sábado", when: "hace 6 días", done: 6, total: 6, minutes: 55 },
];

const TRENDS = [
  { name: "Prensa de Pecho", entries: ["39kg · Fácil", "35kg · Normal", "32kg · Difícil"] },
  { name: "Jalón al Pecho", entries: ["45kg · Normal", "45kg · Difícil", "42kg · Normal"] },
];

const VISITS = [
  { dateLabel: "Lun 14 jul", club: "Club Pasteur", scans: 1 },
  { dateLabel: "Sáb 12 jul", club: "Club Pasteur", scans: 2 },
  { dateLabel: "Vie 11 jul", club: "Club Pasteur", scans: 1 },
];

const HOME_CLUB = "Basic-Fit Málaga Bulevar Louis Pasteur";

function SectionLabel({ id, children }) {
  return (
    <h2 id={id} style={{
      font: "var(--text-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase",
      color: "var(--text-muted)", margin: "0 0 var(--space-3)",
    }}>
      {children}
    </h2>
  );
}

function HomeClubChip({ name }) {
  return (
    <div
      title={name}
      aria-label={`Tu club: ${name}`}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6, maxWidth: "100%",
        font: "var(--text-body-sm)", color: "var(--bf-ink-2)",
        background: "var(--bf-purple-tint)", borderRadius: "var(--radius-control)",
        padding: "6px 10px", marginTop: 8,
      }}
    >
      <HistIcon name="map-pin" size={14} />
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        Tu club: {name}
      </span>
    </div>
  );
}

function WeightSparkline() {
  /* Static low-fi sparkline — non-interactive (v1). Points with weight only. */
  return (
    <svg width="100%" height="40" viewBox="0 0 280 40" preserveAspectRatio="none" aria-hidden="true" style={{ display: "block", marginBottom: 6 }}>
      <polyline
        fill="none"
        stroke="var(--bf-purple)"
        strokeWidth="2"
        points="0,28 40,24 80,26 120,18 160,20 200,14 240,16 280,10"
      />
    </svg>
  );
}

function CompositionSparklines() {
  return (
    <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
      <div>
        <div style={{ font: "var(--text-caption)", color: "var(--text-muted)", marginBottom: 4 }}>Grasa %</div>
        <svg width="100%" height="28" viewBox="0 0 280 28" preserveAspectRatio="none" aria-hidden="true">
          <polyline fill="none" stroke="var(--bf-ink-3)" strokeWidth="1.5" points="0,12 70,14 140,10 210,11 280,9" />
        </svg>
      </div>
      <div>
        <div style={{ font: "var(--text-caption)", color: "var(--text-muted)", marginBottom: 4 }}>Músculo %</div>
        <svg width="100%" height="28" viewBox="0 0 280 28" preserveAspectRatio="none" aria-hidden="true">
          <polyline fill="none" stroke="var(--bf-ink-3)" strokeWidth="1.5" points="0,18 70,16 140,14 210,12 280,10" />
        </svg>
      </div>
    </div>
  );
}

function BfVisitsEmpty({ onImportBf, combined }) {
  return (
    <div style={{ background: "var(--bf-white)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "var(--space-4)" }}>
      <p style={{ font: "var(--text-body-sm)", color: "var(--text-muted)", margin: "0 0 8px" }}>
        Importa tus visitas desde My Basic-Fit.
      </p>
      {combined && (
        <p style={{ font: "var(--text-body-sm)", color: "var(--text-muted)", margin: "0 0 12px" }}>
          Aún no hay mediciones en el export fitness.
        </p>
      )}
      <HistButton variant="outline" style={{ width: "100%" }} onClick={onImportBf}>
        Importar visitas Basic-Fit
      </HistButton>
    </div>
  );
}

function BfVisitsSuccess({ onUpdateBf }) {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      <div style={{ background: "var(--bf-white)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "var(--space-4)" }}>
        <div style={{ font: "var(--text-body-sm)", color: "var(--bf-ink)" }}>7 días: 3 · 30 días: 11</div>
        <div style={{ font: "var(--text-body-sm)", color: "var(--bf-ink)", marginTop: 4 }}>Racha: 2 días</div>
      </div>
      {VISITS.map((v, i) => (
        <div key={i} style={{
          background: "var(--bf-white)", border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-md)", padding: "var(--space-4)",
          display: "flex", alignItems: "flex-start", gap: 10,
        }}>
          <span style={{ color: "var(--text-muted)", marginTop: 2 }} aria-hidden="true">
            <HistIcon name="map-pin" size={16} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
              <span style={{ font: "700 15px/1.3 var(--font-sans)", color: "var(--bf-ink)" }}>{v.dateLabel}</span>
              <span style={{ font: "var(--text-body-sm)", color: "var(--text-muted)" }}>{v.scans}×</span>
            </div>
            <div style={{ font: "var(--text-body-sm)", color: "var(--text-muted)", marginTop: 2 }}>{v.club}</div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={onUpdateBf}
        style={{
          all: "unset", cursor: "pointer", color: "var(--text-link)", fontWeight: 600,
          font: "var(--text-body-sm)", padding: "8px 0", minHeight: "var(--touch-target)",
          display: "inline-flex", alignItems: "center",
        }}
      >
        Actualizar datos Basic-Fit →
      </button>
    </div>
  );
}

function BfMeasurementsEmpty() {
  return (
    <p style={{ font: "var(--text-body-sm)", color: "var(--text-muted)", margin: 0 }}>
      Aún no hay mediciones en el export fitness.
    </p>
  );
}

function BfMeasurementsSuccess({ showComposition = true }) {
  return (
    <div style={{ background: "var(--bf-white)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "var(--space-4)" }}>
      <div style={{ font: "700 14px/1.3 var(--font-sans)", color: "var(--bf-ink)", marginBottom: 6 }}>Peso</div>
      <WeightSparkline />
      <div style={{ font: "var(--text-body-sm)", color: "var(--text-muted)" }}>57,4 kg · 10 may</div>
      {showComposition && (
        <>
          <div style={{ font: "700 14px/1.3 var(--font-sans)", color: "var(--bf-ink)", margin: "14px 0 4px" }}>Composición</div>
          <CompositionSparklines />
        </>
      )}
    </div>
  );
}

function SessionsBlock({ empty, onExport }) {
  if (empty) {
    return (
      <div style={{ textAlign: "center", padding: "var(--space-6) 0" }}>
        <div style={{ color: "var(--text-muted)", marginBottom: 12 }}><HistIcon name="bar-chart-2" size={36} /></div>
        <div style={{ font: "var(--text-h3)", color: "var(--bf-ink)", margin: "0 0 6px" }}>Aún no hay sesiones registradas</div>
        <p style={{ font: "var(--text-body-sm)", color: "var(--text-muted)", maxWidth: 280, margin: "0 auto" }}>
          Empieza un entrenamiento desde Inicio para ver tu historial aquí.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {SESSIONS.map((s, i) => (
        <div key={i} style={{ background: "var(--bf-white)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "var(--space-4)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ font: "700 15px/1.3 var(--font-sans)", color: "var(--bf-ink)" }}>{s.day}</span>
            <span style={{ font: "var(--text-body-sm)", color: "var(--text-muted)" }}>{s.when}</span>
          </div>
          <div style={{ font: "var(--text-body-sm)", color: s.incomplete ? "var(--bf-danger)" : "var(--text-muted)", marginTop: 4 }}>
            {s.done}/{s.total} completados · {s.minutes} min{s.incomplete ? " · sesión sin terminar" : ""}
          </div>
        </div>
      ))}

      <div style={{ font: "var(--text-h3)", color: "var(--bf-ink)", margin: "var(--space-4) 0 0" }}>Por ejercicio</div>
      {TRENDS.map((t) => (
        <div key={t.name} style={{ background: "var(--bf-white)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)", padding: "var(--space-4)" }}>
          <div style={{ font: "700 14px/1.3 var(--font-sans)", color: "var(--bf-ink)", marginBottom: 6 }}>{t.name}</div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", font: "var(--text-body-sm)", color: "var(--text-muted)" }}>
            {t.entries.map((e, i) => <span key={i}>{e}</span>)}
          </div>
        </div>
      ))}

      <HistButton variant="primary" size="lg" style={{ width: "100%", marginTop: 8 }} onClick={onExport}>
        <HistIcon name="download" size={16} /> Exportar progreso
      </HistButton>
    </div>
  );
}

/**
 * Mockup — History with parallel BF tracks.
 * demoState (legacy): empty | success — sessions-only (no BF chrome)
 * demoBfState:
 *   none     — no BF sections (legacy)
 *   empty    — combined empty + CTA
 *   partial-visits  — visits success, mediciones empty
 *   partial-fitness — visits empty CTA, mediciones success
 *   success  — visits + mediciones + club chip
 * demoSessions: success | empty — coexistence with BF
 */
function HistoryScreen({
  demoState = "success",
  demoBfState = "none",
  demoSessions,
  onExport,
  onImportBf,
}) {
  const sessionsEmpty = demoSessions === "empty" || (demoBfState === "none" && demoState === "empty");
  const showBf = demoBfState !== "none";

  /* Legacy empty: full-page empty (no BF). */
  if (!showBf && demoState === "empty") {
    return (
      <div style={{ background: "var(--bf-grey-1)", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "var(--page-gutter)", textAlign: "center" }}>
        <div style={{ color: "var(--text-muted)", marginBottom: 12 }}><HistIcon name="bar-chart-2" size={36} /></div>
        <h2 style={{ font: "var(--text-h3)", color: "var(--bf-ink)", margin: "0 0 6px" }}>Aún no hay sesiones registradas</h2>
        <p style={{ font: "var(--text-body-sm)", color: "var(--text-muted)", maxWidth: 280 }}>Empieza un entrenamiento desde Inicio para ver tu historial aquí.</p>
      </div>
    );
  }

  const showClub = demoBfState === "success" || demoBfState === "partial-visits";
  const visitsMode =
    demoBfState === "empty" ? "empty-combined"
      : demoBfState === "partial-fitness" ? "empty-cta"
        : demoBfState === "partial-visits" || demoBfState === "success" ? "success"
          : null;
  const measurementsMode =
    demoBfState === "empty" ? "hidden"
      : demoBfState === "partial-visits" ? "empty"
        : demoBfState === "partial-fitness" || demoBfState === "success" ? "success"
          : null;

  return (
    <div style={{ background: "var(--bf-grey-1)", minHeight: "100vh", paddingBottom: 100 }}>
      <div style={{ background: "var(--bf-white)", borderBottom: "1px solid var(--border-default)", padding: "var(--space-6) var(--page-gutter) var(--space-5)" }}>
        <h1 style={{ font: "var(--text-h2)", textTransform: "uppercase", color: "var(--bf-ink)", margin: 0 }}>Historial</h1>
        {showClub && <HomeClubChip name={HOME_CLUB} />}
      </div>

      <div style={{ padding: "var(--space-5) var(--page-gutter)", display: "grid", gap: "var(--space-6)", maxWidth: 560, margin: "0 auto" }}>
        {showBf && (
          <section aria-labelledby="bf-visits-heading">
            <SectionLabel id="bf-visits-heading">Visitas Basic-Fit</SectionLabel>
            {visitsMode === "empty-combined" && <BfVisitsEmpty combined onImportBf={onImportBf} />}
            {visitsMode === "empty-cta" && <BfVisitsEmpty onImportBf={onImportBf} />}
            {visitsMode === "success" && <BfVisitsSuccess onUpdateBf={onImportBf} />}
          </section>
        )}

        {showBf && measurementsMode !== "hidden" && (
          <section aria-labelledby="bf-meas-heading">
            <SectionLabel id="bf-meas-heading">Mediciones</SectionLabel>
            {measurementsMode === "empty" && <BfMeasurementsEmpty />}
            {measurementsMode === "success" && <BfMeasurementsSuccess />}
          </section>
        )}

        <section aria-labelledby="sessions-heading">
          <SectionLabel id="sessions-heading">Sesiones rutina</SectionLabel>
          <SessionsBlock empty={sessionsEmpty} onExport={onExport} />
        </section>
      </div>
    </div>
  );
}
window.HistoryScreen = HistoryScreen;
