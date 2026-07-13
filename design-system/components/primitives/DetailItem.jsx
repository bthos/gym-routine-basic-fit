import React from "react";

/** Label + value block inside exercise cards (series×reps, descanso, intensidad). */
export function DetailItem({ label, value, style }) {
  return (
    <div style={{
      background: "var(--bf-grey-1)", borderRadius: "var(--radius-md)",
      padding: "var(--space-3)", ...style,
    }}>
      <div style={{
        font: "var(--text-label)", letterSpacing: "var(--tracking-label)",
        textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4,
      }}>{label}</div>
      <div style={{ font: "700 17px/1.3 var(--font-sans)", color: "var(--text-heading)" }}>{value}</div>
    </div>
  );
}
