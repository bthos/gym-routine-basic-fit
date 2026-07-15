const DSHome = window.BasicFitDesignSystem_1cb8a2;
const { Icon: HomeIcon, Button: HomeButton, Badge: HomeBadge } = DSHome;

/** Mockup — states: success | error (storage corruption fallback). "empty" is the Import screen itself. */
function HomeScreen({ demoState = "success", hasActiveSession = false, onStart, onGoImport }) {
  if (demoState === "error") {
    return (
      <div style={{ background: "var(--bf-grey-1)", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "var(--page-gutter)", textAlign: "center" }}>
        <div style={{ color: "var(--bf-danger)", marginBottom: 12 }}><HomeIcon name="alert-triangle" size={36} /></div>
        <h2 style={{ font: "var(--text-h3)", color: "var(--bf-ink)", margin: "0 0 8px" }}>No se pudo leer tu rutina guardada</h2>
        <p style={{ font: "var(--text-body-sm)", color: "var(--text-muted)", maxWidth: 320, margin: "0 0 20px" }}>Los datos locales parecen dañados o incompletos. Vuelve a importar tu rutina.json.</p>
        <HomeButton variant="primary" onClick={onGoImport}>Importar rutina</HomeButton>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bf-grey-1)", minHeight: "100vh", paddingBottom: 90 }}>
      <div style={{ background: "var(--bf-white)", borderBottom: "1px solid var(--border-default)", padding: "var(--space-6) var(--page-gutter) var(--space-5)" }}>
        <div style={{ font: "800 13px/1 var(--font-display)", color: "var(--bf-orange)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10 }}>Basic-Fit</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 style={{ font: "var(--text-h2)", textTransform: "uppercase", color: "var(--bf-ink)", margin: 0 }}>Elena Rois — Fase 2</h1>
          <HomeBadge tone="brand">Fase 2</HomeBadge>
        </div>
      </div>

      <div style={{ padding: "var(--space-6) var(--page-gutter)", display: "grid", gap: "var(--space-5)" }}>
        <div style={{ background: "var(--bf-white)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", padding: "var(--space-6)", boxShadow: "var(--shadow-card)" }}>
          <div style={{ font: "var(--text-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>Hoy</div>
          <h2 style={{ font: "var(--text-h3)", color: "var(--bf-ink)", margin: "0 0 4px" }}>Miércoles</h2>
          <p style={{ font: "var(--text-body-sm)", color: "var(--text-muted)", margin: "0 0 var(--space-5)" }}>Full Body B · 6 ejercicios</p>
          <HomeButton variant="primary" size="lg" style={{ width: "100%" }} onClick={onStart}>
            <HomeIcon name="play" size={18} /> {hasActiveSession ? "Reanudar entrenamiento" : "Empezar entrenamiento"}
          </HomeButton>
        </div>

        <div style={{ background: "var(--bf-white)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-lg)", padding: "var(--space-5)" }}>
          <div style={{ font: "var(--text-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>Última sesión</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "var(--bf-success)" }}><HomeIcon name="check" size={20} /></span>
            <div>
              <div style={{ font: "700 14px/1.3 var(--font-sans)", color: "var(--bf-ink)" }}>Lunes · hace 2 días</div>
              <div style={{ font: "var(--text-body-sm)", color: "var(--text-muted)" }}>6/6 completados · 52 min</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
window.HomeScreen = HomeScreen;
