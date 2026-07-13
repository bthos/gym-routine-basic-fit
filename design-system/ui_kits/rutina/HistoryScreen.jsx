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

/** Mockup — states: empty ("Aún no hay sesiones registradas") | success. */
function HistoryScreen({ demoState = "success", onExport }) {
  if (demoState === "empty") {
    return (
      <div style={{ background: "var(--bf-grey-1)", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "var(--page-gutter)", textAlign: "center" }}>
        <div style={{ color: "var(--text-muted)", marginBottom: 12 }}><HistIcon name="bar-chart-2" size={36} /></div>
        <h2 style={{ font: "var(--text-h3)", color: "var(--bf-ink)", margin: "0 0 6px" }}>Aún no hay sesiones registradas</h2>
        <p style={{ font: "var(--text-body-sm)", color: "var(--text-muted)", maxWidth: 280 }}>Empieza un entrenamiento desde Inicio para ver tu historial aquí.</p>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bf-grey-1)", minHeight: "100vh", paddingBottom: 100 }}>
      <div style={{ background: "var(--bf-white)", borderBottom: "1px solid var(--border-default)", padding: "var(--space-6) var(--page-gutter) var(--space-5)" }}>
        <h1 style={{ font: "var(--text-h2)", textTransform: "uppercase", color: "var(--bf-ink)", margin: 0 }}>Historial</h1>
      </div>

      <div style={{ padding: "var(--space-5) var(--page-gutter)", display: "grid", gap: 10 }}>
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

        <h2 style={{ font: "var(--text-h3)", color: "var(--bf-ink)", margin: "var(--space-4) 0 0" }}>Por ejercicio</h2>
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
    </div>
  );
}
window.HistoryScreen = HistoryScreen;
