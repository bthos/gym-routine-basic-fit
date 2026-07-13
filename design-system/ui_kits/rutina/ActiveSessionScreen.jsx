const DSSess = window.BasicFitDesignSystem_1cb8a2;
const { Icon: SessIcon, Button: SessButton, DetailItem: SessDetailItem } = DSSess;

const SESSION_EXERCISES = [
  { id: "g3-s10", name: "Prensa de Pecho", sets: "4 × 12-15", rest: "45 seg", rir: "RIR 1-2", status: "done", weight: 39, difficulty: "easy" },
  { id: "g3-s12", name: "Aperturas de Pecho", sets: "4 × 12-15", rest: "45 seg", rir: "RIR 1-2", status: "done", weight: 32, difficulty: "normal" },
  { id: "g3-s30", name: "Jalón al Pecho", sets: "4 × 10-12", rest: "60 seg", rir: "RIR 2", status: "current", weight: 45, difficulty: null, equipment: "Matrix Aura G3-S30" },
  { id: "g3-s31", name: "Remo Sentado", sets: "3 × 12", rest: "60 seg", rir: null, status: "upcoming" },
  { id: "g3-s40", name: "Curl de Bíceps", sets: "3 × 12-15", rest: "45 seg", rir: null, status: "upcoming" },
  { id: "g3-s42", name: "Extensión de Tríceps", sets: "3 × 12-15", rest: "45 seg", rir: null, status: "upcoming" },
];

const DIFFICULTIES = [
  { id: "easy", label: "Fácil" },
  { id: "normal", label: "Normal" },
  { id: "hard", label: "Difícil" },
];

/** Text-only difficulty picker — no emoji/icon, per project's no-emoji-as-icons policy and the a11y rule that difficulty must never be color/icon-only. */
function DifficultyPicker({ value, onChange }) {
  return (
    <div role="radiogroup" aria-label="¿Cómo fue el ejercicio?" style={{ display: "flex", gap: 8 }}>
      {DIFFICULTIES.map((d) => {
        const selected = value === d.id;
        return (
          <button key={d.id} role="radio" aria-checked={selected} onClick={() => onChange(d.id)} style={{
            flex: 1, minHeight: 44, padding: "10px 4px",
            font: "700 13px/1.2 var(--font-sans)", letterSpacing: ".02em",
            borderRadius: "var(--radius-control)",
            border: selected ? "2px solid var(--bf-purple)" : "1px solid var(--border-control)",
            background: selected ? "var(--bf-purple-tint)" : "var(--bf-white)",
            color: selected ? "var(--bf-purple-dark)" : "var(--bf-ink)",
            cursor: "pointer",
          }}>{d.label}</button>
        );
      })}
    </div>
  );
}

function ExerciseLogCard({ ex, expanded, onToggle, onComplete }) {
  const [weight, setWeight] = React.useState(ex.weight ?? "");
  const [difficulty, setDifficulty] = React.useState(ex.difficulty);
  const isDone = ex.status === "done";
  const isCurrent = ex.status === "current" || expanded;

  return (
    <div style={{
      background: "var(--bf-white)", border: "1px solid var(--border-default)",
      borderLeft: isCurrent ? "3px solid var(--bf-purple)" : "3px solid transparent",
      borderRadius: "var(--radius-md)", padding: "var(--space-4)",
    }}>
      <button onClick={onToggle} style={{ all: "unset", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, width: "100%", boxSizing: "border-box" }}>
        <span style={{
          width: 24, height: 24, flexShrink: 0, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: isDone ? "var(--bf-success)" : "var(--bf-grey-2)",
          color: isDone ? "var(--bf-white)" : "var(--text-muted)",
        }}>
          {isDone ? <SessIcon name="check" size={14} strokeWidth={3} /> : null}
        </span>
        <span style={{ flex: 1, textAlign: "left" }}>
          <div style={{ font: "700 15px/1.3 var(--font-sans)", color: "var(--bf-ink)" }}>{ex.name}</div>
          {isDone && <div style={{ font: "var(--text-body-sm)", color: "var(--text-muted)" }}>{ex.weight} kg · {DIFFICULTIES.find(d => d.id === ex.difficulty)?.label}</div>}
          {!isDone && !isCurrent && <div style={{ font: "var(--text-body-sm)", color: "var(--text-muted)" }}>{ex.sets}</div>}
        </span>
        {isCurrent && !isDone && <span style={{ font: "700 11px/1 var(--font-sans)", color: "var(--bf-purple)", textTransform: "uppercase", letterSpacing: ".04em" }}>Actual</span>}
      </button>

      {isCurrent && !isDone && (
        <div style={{ marginTop: "var(--space-4)", display: "grid", gap: "var(--space-4)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px,1fr))", gap: 8 }}>
            <SessDetailItem label="Series × Reps" value={ex.sets} />
            <SessDetailItem label="Descanso" value={ex.rest} />
            {ex.rir && <SessDetailItem label="Intensidad" value={ex.rir} />}
          </div>
          {ex.equipment && <div style={{ font: "var(--text-body-sm)", color: "var(--text-body)" }}><strong>Equipo:</strong> {ex.equipment}</div>}

          <div>
            <label htmlFor={`weight-${ex.id}`} style={{ display: "block", font: "var(--text-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>Peso usado (kg)</label>
            <input id={`weight-${ex.id}`} type="number" inputMode="decimal" value={weight}
              onChange={(e) => setWeight(e.target.value)} onFocus={(e) => e.target.select()}
              style={{
                width: "100%", boxSizing: "border-box", font: "700 20px/1.2 var(--font-sans)", color: "var(--bf-ink)",
                border: "1px solid var(--border-control)", borderRadius: "var(--radius-control)", padding: "12px 14px",
              }} />
            <div style={{ font: "var(--text-caption)", color: "var(--text-muted)", marginTop: 4 }}>Prellenado con el último peso registrado para este equipo.</div>
          </div>

          <div>
            <div style={{ font: "var(--text-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>¿Cómo fue?</div>
            <DifficultyPicker value={difficulty} onChange={setDifficulty} />
          </div>

          <SessButton variant="primary" disabled={!difficulty} onClick={() => onComplete(ex.id, weight, difficulty)}>
            <SessIcon name="check" size={16} /> Marcar completado
          </SessButton>
        </div>
      )}
    </div>
  );
}

function EndSessionDialog({ onFinish, onAbandon, onCancel }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(45,45,45,.5)", zIndex: 300, display: "flex", alignItems: "flex-end" }}>
      <div style={{ background: "var(--bf-white)", width: "100%", borderRadius: "var(--radius-lg) var(--radius-lg) 0 0", padding: "var(--space-6) var(--page-gutter) calc(var(--space-6) + env(safe-area-inset-bottom, 0px))" }}>
        <h3 style={{ font: "var(--text-h3)", color: "var(--bf-ink)", margin: "0 0 4px" }}>Terminar sesión</h3>
        <p style={{ font: "var(--text-body-sm)", color: "var(--text-muted)", margin: "0 0 var(--space-5)" }}>2 de 6 ejercicios completados.</p>
        <div style={{ display: "grid", gap: 10 }}>
          <SessButton variant="primary" style={{ width: "100%" }} onClick={onFinish}>Finalizar sesión</SessButton>
          <SessButton variant="outline" style={{ width: "100%" }} onClick={onAbandon}>Sesión terminada sin completar</SessButton>
          <SessButton variant="ghost" style={{ width: "100%" }} onClick={onCancel}>Cancelar</SessButton>
        </div>
      </div>
    </div>
  );
}

/** Mockup — the highest-stakes screen. States: exercise collapsed/current/done, plus the end-session confirm dialog. */
function ActiveSessionScreen({ onEnd }) {
  const [expandedId, setExpandedId] = React.useState("g3-s30");
  const [showDialog, setShowDialog] = React.useState(false);
  const done = SESSION_EXERCISES.filter(e => e.status === "done").length;
  const total = SESSION_EXERCISES.length;

  return (
    <div style={{ background: "var(--bf-grey-1)", minHeight: "100vh", paddingBottom: 40 }}>
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "var(--bf-white)", borderBottom: "1px solid var(--border-default)", padding: "var(--space-4) var(--page-gutter)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <button aria-label="Terminar sesión" onClick={() => setShowDialog(true)} style={{ all: "unset", cursor: "pointer", color: "var(--bf-ink)", padding: 8 }}>
            <SessIcon name="x" size={20} />
          </button>
          <div style={{ textAlign: "center" }}>
            <div style={{ font: "700 15px/1.2 var(--font-sans)", color: "var(--bf-ink)" }}>Miércoles — Full Body B</div>
            <div style={{ font: "var(--text-body-sm)", color: "var(--text-muted)" }}>{done} / {total} completados</div>
          </div>
          <span style={{ width: 36 }} />
        </div>
        <div style={{ height: 4, background: "var(--bf-grey-2)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(done / total) * 100}%`, background: "var(--bf-purple)", transition: "width var(--motion-base)" }} />
        </div>
      </div>

      <div style={{ padding: "var(--space-4) var(--page-gutter)", display: "grid", gap: 10 }}>
        {SESSION_EXERCISES.map((ex) => (
          <ExerciseLogCard key={ex.id} ex={ex} expanded={expandedId === ex.id}
            onToggle={() => setExpandedId(expandedId === ex.id ? null : ex.id)}
            onComplete={() => setExpandedId(null)} />
        ))}
      </div>

      {showDialog && (
        <EndSessionDialog
          onFinish={() => { setShowDialog(false); onEnd && onEnd("completed"); }}
          onAbandon={() => { setShowDialog(false); onEnd && onEnd("abandoned"); }}
          onCancel={() => setShowDialog(false)}
        />
      )}
    </div>
  );
}
window.ActiveSessionScreen = ActiveSessionScreen;
