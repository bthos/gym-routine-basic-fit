import React from "react";

/** Ink page hero OR light content header (site style). Default tone "light":
    white bg, breadcrumb, big uppercase ink title. */
export function PageHeader({ tone = "light", breadcrumb, title, subtitle, badge, badgeTone = "brand", meta, logoSrc, style }) {
  const light = tone === "light";
  const Badge = ({ children }) => (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: "8px 20px",
      font: "700 14px/1.2 var(--font-sans)", borderRadius: "var(--radius-sm)",
      letterSpacing: "0.04em", textTransform: "uppercase",
      background: badgeTone === "success" ? "var(--bf-success)" : badgeTone === "ink" ? "var(--bf-ink)" : "var(--bf-orange)",
      color: "var(--bf-white)",
    }}>{children}</span>
  );
  return (
    <header style={{
      background: light ? "var(--bf-white)" : "var(--bf-ink)",
      color: light ? "var(--bf-ink)" : "var(--bf-white)",
      padding: "var(--space-6) var(--page-gutter) var(--space-8)",
      borderBottom: light ? "1px solid var(--border-default)" : "none", ...style,
    }}>
      <div style={{ maxWidth: "var(--page-max-width)", margin: "0 auto" }}>
        {logoSrc
          ? <img src={logoSrc} alt="Basic-Fit" style={{ height: 28, display: "block", marginBottom: "var(--space-5)" }} />
          : <div style={{
              font: "800 15px/1 var(--font-display)", color: "var(--bf-orange)",
              textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--space-5)",
            }}>Basic-Fit</div>}
        {breadcrumb && (
          <nav style={{ font: "var(--text-body-sm)", color: light ? "var(--text-muted)" : "rgba(255,255,255,.7)", marginBottom: "var(--space-3)", display: "flex", gap: 8 }}>
            {breadcrumb.map((b, i) => (
              <span key={i} style={{ display: "inline-flex", gap: 8 }}>
                {i > 0 && <span>/</span>}
                {b.href ? <a href={b.href} style={{ color: "inherit", fontWeight: 500 }}>{b.label}</a> : <span style={{ fontWeight: 600, color: light ? "var(--bf-ink)" : "#fff" }}>{b.label}</span>}
              </span>
            ))}
          </nav>
        )}
        <h1 style={{
          font: "var(--text-h1)", color: "inherit", textTransform: "uppercase",
          letterSpacing: "var(--tracking-heading)", margin: 0,
        }}>{title}</h1>
        {subtitle && <p style={{ font: "var(--text-body-lg)", color: light ? "var(--text-body)" : "rgba(255,255,255,.8)", margin: "10px 0 0", maxWidth: 640 }}>{subtitle}</p>}
        {badge && <div style={{ marginTop: "var(--space-4)" }}><Badge>{badge}</Badge></div>}
        {meta && (
          <div style={{
            display: "inline-block", marginTop: "var(--space-4)",
            background: light ? "var(--bf-grey-1)" : "rgba(255,255,255,0.08)",
            borderRadius: "var(--radius-md)", padding: "10px 18px",
            font: "var(--text-body-sm)", color: light ? "var(--text-body)" : "rgba(255,255,255,.85)",
          }}>{meta}</div>
        )}
      </div>
    </header>
  );
}
