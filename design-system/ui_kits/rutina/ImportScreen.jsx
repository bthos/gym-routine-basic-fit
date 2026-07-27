const DSImp = window.BasicFitDesignSystem_1cb8a2;
const { Icon: ImpIcon, Button: ImpButton } = DSImp;

function detectGuideLocale(navLang) {
  const code = ((navLang !== undefined ? navLang : navigator.language) || "").toLowerCase().slice(0, 2);
  if (code === "es") return "es";
  if (code === "be") return "be";
  return "en";
}

const GUIDE_LINK_TEXT = {
  es: "Ver la guía de creación con LLM →",
  en: "View the LLM creation guide →",
  be: "Паглядзіце кіраўніцтва па стварэнні з LLM →",
};

const WRONG_FILE_MSG =
  "Este archivo parece una rutina, no un export de Basic-Fit. Usa «Exportar mis datos» o «Exportar datos fitness» en my.basic-fit.com.";

function ModeSegmentedControl({ mode, onChange }) {
  const tabStyle = (selected) => ({
    flex: 1,
    minHeight: "var(--touch-target)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    font: "700 14px/1 var(--font-sans)",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    cursor: "pointer",
    border: "2px solid var(--bf-purple)",
    background: selected ? "var(--bf-purple-tint)" : "var(--bf-white)",
    color: "var(--bf-purple)",
    boxShadow: selected ? "inset 0 -3px 0 var(--bf-purple-deep)" : "none",
  });

  return (
    <div role="tablist" aria-label="Tipo de importación" style={{ display: "flex", width: "100%", marginBottom: "var(--space-6)" }}>
      <button
        type="button"
        role="tab"
        id="tab-rutina"
        aria-selected={mode === "rutina"}
        aria-controls="panel-rutina"
        tabIndex={mode === "rutina" ? 0 : -1}
        onClick={() => onChange("rutina")}
        style={{ ...tabStyle(mode === "rutina"), borderRadius: "var(--radius-btn) 0 0 var(--radius-btn)", borderRightWidth: 1 }}
      >
        Rutina
      </button>
      <button
        type="button"
        role="tab"
        id="tab-bf"
        aria-selected={mode === "bf"}
        aria-controls="panel-bf"
        tabIndex={mode === "bf" ? 0 : -1}
        onClick={() => onChange("bf")}
        style={{ ...tabStyle(mode === "bf"), borderRadius: "0 var(--radius-btn) var(--radius-btn) 0", borderLeftWidth: 1 }}
      >
        Basic-Fit
      </button>
    </div>
  );
}

function FileSlot({ label, filename, chip, error, onClear }) {
  return (
    <div style={{ marginBottom: "var(--space-4)" }}>
      <div style={{ font: "var(--text-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>
        {label}
      </div>
      {filename ? (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
          border: `1px solid ${error ? "var(--bf-danger)" : "var(--border-control)"}`,
          borderRadius: "var(--radius-control)", padding: "10px 12px", minHeight: "var(--touch-target)",
        }}>
          <span style={{ font: "var(--text-body-sm)", color: "var(--bf-ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            ✓ {filename}
          </span>
          <button type="button" aria-label={`Quitar ${label}`} onClick={onClear} style={{
            all: "unset", cursor: "pointer", color: "var(--text-muted)", padding: 8, display: "flex",
          }}>
            <ImpIcon name="x" size={16} />
          </button>
        </div>
      ) : (
        <ImpButton variant="outline" style={{ width: "100%" }}>
          <ImpIcon name="download" size={16} style={{ transform: "rotate(180deg)" }} /> Elegir archivo .json
        </ImpButton>
      )}
      {chip && !error && (
        <div aria-live="polite" style={{ font: "var(--text-caption)", color: "var(--bf-success)", marginTop: 6 }}>
          {chip}
        </div>
      )}
      {error && (
        <div role="alert" style={{
          marginTop: 8, background: "var(--bf-danger-tint)", border: "1px solid var(--bf-danger)",
          borderRadius: "var(--radius-md)", padding: "10px 14px",
          display: "flex", gap: 8, alignItems: "flex-start",
        }}>
          <span style={{ color: "var(--bf-danger)", flexShrink: 0 }}><ImpIcon name="alert-triangle" size={16} /></span>
          <span style={{ font: "var(--text-body-sm)", color: "var(--bf-ink-2)" }}>{error}</span>
        </div>
      )}
    </div>
  );
}

function BfImportPanel({
  demoState,
  locale,
  showGuide,
  setShowGuide,
  showConfirm,
  confirmKind,
  onConfirm,
  onCancelConfirm,
  guideTriggerRef,
}) {
  const loading = demoState === "loading";
  const isError = demoState === "error";
  const hasValid = demoState === "confirm-first" || demoState === "confirm-replace" || demoState === "loading";
  const personalFile = isError ? "rutina.json" : hasValid ? "get-data-json.json" : null;
  const fitnessFile = hasValid ? "get-fitness-data-json.json" : null;

  const confirmTitle = confirmKind === "replace" ? "Reemplazar datos Basic-Fit" : "Confirmar importación";
  const confirmDesc =
    confirmKind === "replace"
      ? "Se importarán 91 visitas y 12 mediciones. No se guardarán email, IBAN, amigos ni pagos. Sustituye la importación del 15 jul 2026, 18:42. No se mezclan datos."
      : "Se importarán 91 visitas y 12 mediciones. No se guardarán email, IBAN, amigos ni pagos.";
  const BfGuide = window.BfObtainGuide;
  const Sheet = window.ConfirmSheet;

  return (
    <div id="panel-bf" role="tabpanel" aria-labelledby="tab-bf">
      <h1 style={{ font: "var(--text-h2)", textTransform: "uppercase", color: "var(--bf-ink)", textAlign: "center", margin: "0 0 6px" }}>
        Importar datos Basic-Fit
      </h1>
      <p style={{ font: "var(--text-body-sm)", color: "var(--text-muted)", textAlign: "center", margin: "0 0 var(--space-5)", maxWidth: 340, marginLeft: "auto", marginRight: "auto" }}>
        Descarga los JSON en My Basic-Fit y súbelos aquí. No pedimos tu contraseña.
      </p>

      <div style={{
        border: "1px solid var(--border-default)", borderRadius: "var(--radius-md)",
        padding: "var(--space-4)", marginBottom: "var(--space-5)", background: "var(--bf-grey-1)",
      }}>
        <div style={{ font: "var(--text-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>
          Cómo obtener los archivos
        </div>
        <ol style={{ margin: "0 0 10px", paddingLeft: 18, font: "var(--text-body-sm)", color: "var(--bf-ink-2)", display: "grid", gap: 4 }}>
          <li>Entra en my.basic-fit.com</li>
          <li>Mis datos personales</li>
          <li>Exportar mis datos (JSON) y Exportar datos fitness (JSON)</li>
        </ol>
        <a
          ref={guideTriggerRef}
          href="#"
          onClick={(e) => { e.preventDefault(); setShowGuide(true); }}
          style={{ color: "var(--text-link)", fontWeight: 600, font: "var(--text-body-sm)" }}
        >
          Ver guía completa →
        </a>
      </div>

      <FileSlot
        label="Datos personales"
        filename={personalFile}
        chip={hasValid && !isError ? "Detectado: datos personales · 91 visitas" : null}
        error={isError ? WRONG_FILE_MSG : null}
      />
      <FileSlot
        label="Datos fitness"
        filename={fitnessFile}
        chip={hasValid ? "Detectado: datos fitness · 12 mediciones" : null}
      />

      <ImpButton
        variant="primary"
        disabled={!hasValid || isError || loading}
        style={{ width: "100%", marginTop: 8 }}
        onClick={() => onConfirm && onConfirm()}
      >
        {loading ? "Validando…" : "Importar"}
      </ImpButton>

      {showGuide && BfGuide && (
        <BfGuide
          locale={locale}
          onClose={() => {
            setShowGuide(false);
            if (guideTriggerRef && guideTriggerRef.current) guideTriggerRef.current.focus();
          }}
        />
      )}

      {showConfirm && Sheet && (
        <Sheet
          title={confirmTitle}
          description={confirmDesc}
          primaryLabel={confirmKind === "replace" ? "Reemplazar" : "Confirmar"}
          onPrimary={onConfirm}
          onCancel={onCancelConfirm}
        />
      )}
    </div>
  );
}

function RutinaImportPanel({ demoState, locale, text, setText, showGuide, setShowGuide, onImported }) {
  const GuideOverlayComp = window.GuideOverlay;
  const errors = demoState === "error" ? [
    "program.phaseName: required",
    "phaseInfo: required",
    'days[0].exercises[0].equipmentId "g3-xx" not found in data/equipment.json',
  ] : [];
  const loading = demoState === "loading";

  return (
    <div id="panel-rutina" role="tabpanel" aria-labelledby="tab-rutina" style={{ width: "100%", maxWidth: 420 }}>
      <h1 style={{ font: "var(--text-h2)", textTransform: "uppercase", color: "var(--bf-ink)", textAlign: "center", margin: "0 0 6px" }}>
        Importa tu rutina para empezar
      </h1>
      <p style={{ font: "var(--text-body-sm)", color: "var(--text-muted)", textAlign: "center", margin: "0 0 var(--space-6)", maxWidth: 340, marginLeft: "auto", marginRight: "auto" }}>
        Pega el JSON generado por un LLM, o elige un archivo .json.
      </p>

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
        <a href="#" onClick={(e) => { e.preventDefault(); setShowGuide(true); }} style={{ color: "var(--text-link)", fontWeight: 600 }}>
          {GUIDE_LINK_TEXT[locale]}
        </a>
      </p>

      {showGuide && GuideOverlayComp && (
        <GuideOverlayComp locale={locale} onClose={() => setShowGuide(false)} />
      )}
    </div>
  );
}

/**
 * Mockup — ImportScreen with Rutina | Basic-Fit mode.
 * demoMode: 'rutina' | 'bf'
 * demoState (rutina): empty | loading | error
 * demoState (bf): empty | loading | error | confirm-first | confirm-replace | guide
 */
function ImportScreen({ demoState = "empty", demoMode = "rutina", demoLocale, onImported }) {
  const [mode, setMode] = React.useState(demoMode);
  const [text, setText] = React.useState(demoState === "error" && demoMode === "rutina"
    ? '{ "schemaVersion": 1, "days": [ { "label": "Lunes", "exercises": [ { "equipmentId": "g3-xx" } ] } ] }'
    : "");
  const [showGuide, setShowGuide] = React.useState(demoState === "guide");
  const [showConfirm, setShowConfirm] = React.useState(
    demoState === "confirm-first" || demoState === "confirm-replace"
  );
  const locale = demoLocale || detectGuideLocale(navigator.language);
  const guideTriggerRef = React.useRef(null);

  React.useEffect(() => { setMode(demoMode); }, [demoMode]);
  React.useEffect(() => {
    setShowGuide(demoState === "guide");
    setShowConfirm(demoState === "confirm-first" || demoState === "confirm-replace");
  }, [demoState]);

  const confirmKind = demoState === "confirm-replace" ? "replace" : "first";

  return (
    <div style={{ background: "var(--bf-white)", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "var(--space-10) var(--page-gutter) 100px" }}>
      <div style={{ font: "800 15px/1 var(--font-display)", color: "var(--bf-orange)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "var(--space-6)" }}>Basic-Fit</div>
      <div style={{ color: "var(--bf-purple)", marginBottom: 12 }}><ImpIcon name="dumbbell" size={40} strokeWidth={1.6} /></div>

      <div style={{ width: "100%", maxWidth: 420 }}>
        <ModeSegmentedControl mode={mode} onChange={setMode} />

        {mode === "rutina" ? (
          <RutinaImportPanel
            demoState={demoMode === "rutina" ? demoState : "empty"}
            locale={locale}
            text={text}
            setText={setText}
            showGuide={showGuide && mode === "rutina"}
            setShowGuide={setShowGuide}
            onImported={onImported}
          />
        ) : (
          <BfImportPanel
            demoState={demoMode === "bf" ? demoState : "empty"}
            locale={locale}
            showGuide={showGuide}
            setShowGuide={setShowGuide}
            showConfirm={showConfirm}
            confirmKind={confirmKind}
            onConfirm={() => { setShowConfirm(false); onImported && onImported(); }}
            onCancelConfirm={() => setShowConfirm(false)}
            guideTriggerRef={guideTriggerRef}
          />
        )}
      </div>
    </div>
  );
}
window.ImportScreen = ImportScreen;
