import React from "react";

/** Dark site footer: contact row, link columns, legal lines. */
export function PageFooter({ logoSrc, columns = [], lines = [], children, style }) {
  return (
    <footer style={{
      background: "var(--bf-ink)", color: "rgba(255,255,255,.75)",
      padding: "var(--space-10) var(--page-gutter) var(--space-8)", ...style,
    }}>
      <div style={{ maxWidth: "var(--page-max-width)", margin: "0 auto", display: "grid", gap: "var(--space-8)" }}>
        <div>
          {logoSrc
            ? <img src={logoSrc} alt="Basic-Fit" style={{ height: 26, display: "block" }} />
            : <div style={{
                font: "800 14px/1 var(--font-display)", color: "var(--bf-orange)",
                textTransform: "uppercase", letterSpacing: "0.06em",
              }}>Basic-Fit</div>}
        </div>
        {columns.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "var(--space-6)" }}>
            {columns.map((col, i) => (
              <div key={i}>
                <div style={{
                  font: "700 15px/1.3 var(--font-sans)", color: "var(--bf-white)",
                  marginBottom: "var(--space-3)",
                }}>{col.title}</div>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 8 }}>
                  {col.links.map((l, j) => (
                    <li key={j}><a href={l.href || "#"} style={{
                      font: "var(--text-body-sm)", color: "rgba(255,255,255,.75)", fontWeight: 400,
                    }}>{l.label}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        {lines.length > 0 && (
          <div style={{
            display: "grid", gap: 6, font: "var(--text-caption)",
            borderTop: "1px solid rgba(255,255,255,.15)", paddingTop: "var(--space-5)",
          }}>
            {lines.map((l, i) => <p key={i} style={{ margin: 0 }}>{l}</p>)}
          </div>
        )}
        {children}
      </div>
    </footer>
  );
}
