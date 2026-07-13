import React from "react";

/** Small solid rectangular status label: weights, phase, gym availability. */
export function Badge({ tone = "brand", size = "md", children, style }) {
  const tones = {
    brand: { background: "var(--bf-orange)", color: "var(--bf-white)" },
    ink: { background: "var(--bf-ink)", color: "var(--bf-white)" },
    success: { background: "var(--bf-success)", color: "var(--bf-white)" },
    info: { background: "var(--bf-info)", color: "var(--bf-white)" },
    danger: { background: "var(--bf-danger)", color: "var(--bf-white)" },
    neutral: { background: "var(--bf-grey-2)", color: "var(--bf-ink-2)" },
  };
  const pad = size === "lg" ? "8px 20px" : "4px 12px";
  const fs = size === "lg" ? 15 : 13;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6, padding: pad,
      font: `700 ${fs}px/1.2 var(--font-sans)`, borderRadius: "var(--radius-sm)",
      letterSpacing: "0.04em", textTransform: "uppercase",
      whiteSpace: "nowrap", ...tones[tone], ...style,
    }}>
      {children}
    </span>
  );
}
