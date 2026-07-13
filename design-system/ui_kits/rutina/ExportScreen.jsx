const DSExp = window.BasicFitDesignSystem_1cb8a2;
const { Icon: ExpIcon, Button: ExpButton } = DSExp;

const PREVIEW = `Prensa de Pecho (g3-s10)
  · 32kg / difícil
  · 32kg / normal
  · 35kg / fácil

Jalón al Pecho (g3-s30)
  · 45kg / normal
  · 45kg / difícil`;

/** Mockup — states: success | error (clipboard write failure). */
function ExportScreen({ demoState = "success" }) {
  const clipboardError = demoState === "error";
  const canShare = typeof navigator !== "undefined" && !!navigator.share;

  return (
    <div style={{ background: "var(--bf-grey-1)", minHeight: "100vh", paddingBottom: 100 }}>
      <div style={{ background: "var(--bf-white)", borderBottom: "1px solid var(--border-default)", padding: "var(--space-6) var(--page-gutter) var(--space-5)" }}>
        <h1 style={{ font: "var(--text-h2)", textTransform: "uppercase", color: "var(--bf-ink)", margin: 0 }}>Exportar progreso</h1>
        <p style={{ font: "var(--text-body-sm)", color: "var(--text-muted)", margin: "6px 0 0" }}>Copia o descarga tu historial para pegarlo en tu próxima conversación con un LLM.</p>
      </div>

      <div style={{ padding: "var(--space-5) var(--page-gutter)", display: "grid", gap: "var(--space-5)" }}>
        <div>
          <label style={{ display: "block", font: "var(--text-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>Rango</label>
          <select style={{ width: "100%", boxSizing: "border-box", font: "600 14px/1.4 var(--font-sans)", color: "var(--bf-ink)", border: "1px solid var(--border-control)", borderRadius: "var(--radius-control)", padding: "10px 12px" }} defaultValue="all">
            <option value="all">Todo el historial</option>
            <option value="30d">Últimos 30 días</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", font: "var(--text-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>Vista previa (Markdown)</label>
          <pre style={{
            margin: 0, background: "var(--bf-white)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)",
            padding: "var(--space-4)", font: "13px/1.5 monospace", color: "var(--bf-ink-2)", overflowX: "auto", whiteSpace: "pre",
          }}>{PREVIEW}</pre>
        </div>

        {clipboardError && (
          <div role="alert" style={{ background: "var(--bf-danger-tint)", border: "1px solid var(--bf-danger)", borderRadius: "var(--radius-md)", padding: "10px 14px", font: "var(--text-body-sm)", color: "var(--bf-ink-2)" }}>
            No se pudo copiar al portapapeles. Prueba a descargar el archivo.
          </div>
        )}

        <div style={{ display: "grid", gap: 10 }}>
          <ExpButton variant="primary" style={{ width: "100%" }}>Copiar al portapapeles</ExpButton>
          <ExpButton variant="outline" style={{ width: "100%" }}><ExpIcon name="download" size={16} /> Descargar .json</ExpButton>
          {canShare && <ExpButton variant="ghost" style={{ width: "100%" }}><ExpIcon name="external-link" size={16} /> Compartir</ExpButton>}
        </div>
      </div>
    </div>
  );
}
window.ExportScreen = ExportScreen;
