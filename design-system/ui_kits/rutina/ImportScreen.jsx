const DSImp = window.BasicFitDesignSystem_1cb8a2;
const { Icon: ImpIcon, Button: ImpButton } = DSImp;

/** Mockup — states: empty | loading | error | success (see ux-design.md States Matrix). */
function ImportScreen({ demoState = "empty", onImported }) {
  const [text, setText] = React.useState(demoState === "error" ? '{ "schemaVersion": 1, "days": [ { "label": "Lunes", "exercises": [ { "equipmentId": "g3-xx" } ] } ] }' : "");
  const errors = demoState === "error" ? [
    'program.phaseName: required',
    'phaseInfo: required',
    'days[0].exercises[0].equipmentId "g3-xx" not found in data/equipment.json',
  ] : [];
  const loading = demoState === "loading";

  return (
    <div style={{ background: "var(--bf-white)", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "var(--space-10) var(--page-gutter) 100px" }}>
      <div style={{ font: "800 15px/1 var(--font-display)", color: "var(--bf-orange)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "var(--space-6)" }}>Basic-Fit</div>
      <div style={{ color: "var(--bf-purple)", marginBottom: 12 }}><ImpIcon name="dumbbell" size={40} strokeWidth={1.6} /></div>
      <h1 style={{ font: "var(--text-h2)", textTransform: "uppercase", color: "var(--bf-ink)", textAlign: "center", margin: "0 0 6px" }}>Importa tu rutina para empezar</h1>
      <p style={{ font: "var(--text-body-sm)", color: "var(--text-muted)", textAlign: "center", margin: "0 0 var(--space-6)", maxWidth: 340 }}>
        Pega el JSON generado por un LLM, o elige un archivo .json.
      </p>

      <div style={{ width: "100%", maxWidth: 420 }}>
        <label htmlFor="rutina-json" style={{ display: "block", font: "var(--text-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>rutina.json</label>
        <textarea id="rutina-json" value={text} onChange={(e) => setText(e.target.value)} rows={8} placeholder="Pegar JSON aquí..." style={{
          width: "100%", boxSizing: "border-box", font: "14px/1.5 monospace", color: "var(--bf-ink)",
          border: `1px solid ${errors.length ? "var(--bf-danger)" : "var(--border-control)"}`, borderRadius: "var(--radius-control)",
          padding: 12, resize: "vertical",
        }} />

        {errors.length > 0 && (
          <div role="alert" style={{ marginTop: 10, background: "var(--bf-danger-tint)", border: "1px solid var(--bf-danger)", borderRadius: "var(--radius-md)", padding: "10px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, font: "700 13px/1.3 var(--font-sans)", color: "var(--bf-danger)", marginBottom: 6 }}>
              <ImpIcon name="alert-triangle" size={16} /> {errors.length} error(es) de validación
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 4 }}>
              {errors.map((e, i) => (
                <li key={i} style={{ font: "13px/1.4 monospace", color: "var(--bf-ink-2)" }}>{e}</li>
              ))}
            </ul>
            <p style={{ font: "var(--text-caption)", color: "var(--text-muted)", margin: "8px 0 0" }}>
              Copia estos errores y pégalos de vuelta en tu chat con el LLM para corregirlos.
            </p>
          </div>
        )}

        <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
          <ImpButton variant="outline" style={{ width: "100%" }}>
            <ImpIcon name="download" size={16} style={{ transform: "rotate(180deg)" }} /> Elegir archivo .json
          </ImpButton>
          <ImpButton variant="primary" disabled={!text || loading} style={{ width: "100%" }} onClick={() => onImported && onImported()}>
            {loading ? "Validando..." : "Importar"}
          </ImpButton>
        </div>

        <p style={{ textAlign: "center", font: "var(--text-body-sm)", color: "var(--text-muted)", marginTop: "var(--space-6)" }}>
          ¿No tienes un rutina.json?<br />
          <a href="#" style={{ color: "var(--text-link)" }}>Ver la guía de creación con LLM →</a>
        </p>
      </div>
    </div>
  );
}
window.ImportScreen = ImportScreen;
