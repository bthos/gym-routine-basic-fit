import React from "react";

/** Full-width tinted banner for phase info / warmup / cooldown sections. */
export function SectionBanner({ tone = "brand", title, subtitle, items = [], children, style }) {
  const tones = {
    brand: { background: "var(--bf-orange)", color: "var(--bf-white)" },
    ink: { background: "var(--bf-ink)", color: "var(--bf-white)" },
    neutral: { background: "var(--bf-sand)", color: "var(--bf-ink)" },
    success: { background: "var(--bf-success)", color: "var(--bf-white)" },
    info: { background: "var(--bf-info)", color: "var(--bf-white)" },
  };
  return (
    <section style={{
      borderRadius: "var(--radius-lg)", padding: "var(--space-6)",
      ...tones[tone], ...style,
    }}>
      {title && <h2 style={{
        font: "var(--text-h2)", color: "inherit", textTransform: "uppercase",
        letterSpacing: "var(--tracking-heading)", margin: 0,
      }}>{title}</h2>}
      {subtitle && <p style={{ font: "var(--text-body-md)", margin: "8px 0 0", opacity: tone === "neutral" ? 1 : 0.92, color: tone === "neutral" ? "var(--text-body)" : "inherit" }}>{subtitle}</p>}
      {items.length > 0 && (
        <ul style={{ margin: "var(--space-4) 0 0", paddingLeft: 20, display: "grid", gap: 6, font: "var(--text-body-md)" }}>
          {items.map((it, i) => <li key={i}>{it}</li>)}
        </ul>
      )}
      {children}
    </section>
  );
}
