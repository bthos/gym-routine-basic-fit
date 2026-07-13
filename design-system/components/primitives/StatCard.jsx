import React from "react";

/** Big stat block: number + qualifier ("1600+ clubs", "27 máquinas"). */
export function StatCard({ value, label, inverse = false, style }) {
  return (
    <div style={{
      background: inverse ? "var(--bf-ink)" : "var(--bf-white)",
      border: inverse ? "none" : "1px solid var(--border-default)",
      borderRadius: "var(--radius-lg)", padding: "var(--space-5)",
      textAlign: "center", ...style,
    }}>
      <div style={{ font: "var(--text-stat)", color: inverse ? "var(--bf-orange)" : "var(--bf-orange-deep)" }}>{value}</div>
      <div style={{ font: "var(--text-body-sm)", color: inverse ? "rgba(255,255,255,.85)" : "var(--text-muted)", marginTop: 6 }}>{label}</div>
    </div>
  );
}
