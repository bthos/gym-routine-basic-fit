import React from "react";

/** Titled note card ("Notas importantes" list). */
export function NoteItem({ title, tone = "neutral", children, style }) {
  const tones = {
    neutral: { borderColor: "var(--border-default)", titleColor: "var(--text-heading)" },
    success: { borderColor: "var(--bf-success)", titleColor: "var(--bf-success)" },
    danger: { borderColor: "var(--bf-danger)", titleColor: "var(--bf-danger)" },
  };
  const t = tones[tone];
  return (
    <div style={{
      background: "var(--bf-white)", border: "1px solid var(--border-default)",
      borderTop: `3px solid ${t.borderColor}`,
      borderRadius: "var(--radius-md)", padding: "var(--space-4)", ...style,
    }}>
      {title && <div style={{ font: "var(--text-h4)", color: t.titleColor, marginBottom: 6 }}>{title}</div>}
      <div style={{ font: "var(--text-body-sm)", color: "var(--text-body)" }}>{children}</div>
    </div>
  );
}
