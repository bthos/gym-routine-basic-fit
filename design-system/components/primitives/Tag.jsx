import React from "react";

/** Outlined rectangular category label (site "NUTRICIÓN" style): uppercase, 1px ink border. */
export function Tag({ tone = "neutral", children, style }) {
  const tones = {
    neutral: { background: "var(--bf-white)", color: "var(--bf-ink)", border: "1px solid var(--bf-ink)" },
    primary: { background: "var(--bf-white)", color: "var(--bf-orange-deep)", border: "1px solid var(--bf-orange)" },
    secondary: { background: "var(--bf-grey-1)", color: "var(--bf-ink-2)", border: "1px solid var(--bf-grey-3)" },
  };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: "4px 10px",
      font: "700 12px/1.3 var(--font-sans)", letterSpacing: "0.05em",
      textTransform: "uppercase", borderRadius: "var(--radius-sm)",
      whiteSpace: "nowrap", ...tones[tone], ...style,
    }}>
      {children}
    </span>
  );
}
