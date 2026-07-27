const DSConfirm = window.BasicFitDesignSystem_1cb8a2;
const { Button: ConfirmButton } = DSConfirm;

/** Mockup — bottom-sheet alertdialog (mirrors app ConfirmSheet). z-index 300. */
function ConfirmSheet({
  title,
  description,
  primaryLabel = "Confirmar",
  onPrimary,
  cancelLabel = "Cancelar",
  onCancel,
  danger = false,
}) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(45,45,45,.5)", zIndex: 300, display: "flex", alignItems: "flex-end" }}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-sheet-title"
        style={{
          background: "var(--bf-white)",
          width: "100%",
          borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
          padding: "var(--space-6) var(--page-gutter) calc(var(--space-6) + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <h3 id="confirm-sheet-title" style={{ font: "var(--text-h3)", color: "var(--bf-ink)", margin: "0 0 4px" }}>
          {title}
        </h3>
        {description && (
          <p style={{ font: "var(--text-body-sm)", color: "var(--text-muted)", margin: "0 0 var(--space-5)" }}>
            {description}
          </p>
        )}
        <div style={{ display: "grid", gap: 10 }}>
          {onPrimary && (
            <ConfirmButton
              variant="primary"
              style={{ width: "100%", ...(danger ? { background: "var(--bf-danger)", borderColor: "var(--bf-danger)" } : {}) }}
              onClick={onPrimary}
            >
              {primaryLabel}
            </ConfirmButton>
          )}
          {onCancel && (
            <ConfirmButton variant="ghost" style={{ width: "100%" }} onClick={onCancel} autoFocus>
              {cancelLabel}
            </ConfirmButton>
          )}
        </div>
      </div>
    </div>
  );
}

window.ConfirmSheet = ConfirmSheet;
