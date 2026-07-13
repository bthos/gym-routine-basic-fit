import React from "react";

/** Routine summary table: ink header row, hairline dividers, hover row tint. */
export function SummaryTable({ columns = [], rows = [], style }) {
  const [hoverRow, setHoverRow] = React.useState(-1);
  return (
    <table style={{
      width: "100%", borderCollapse: "collapse", background: "var(--bf-white)",
      borderRadius: "var(--radius-lg)", overflow: "hidden",
      border: "1px solid var(--border-default)", ...style,
    }}>
      <thead>
        <tr style={{ background: "var(--bf-ink)" }}>
          {columns.map((c, i) => (
            <th key={i} style={{
              padding: "12px 16px", textAlign: "left", color: "var(--bf-white)",
              font: "var(--text-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase",
            }}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, ri) => (
          <tr key={ri} onMouseEnter={() => setHoverRow(ri)} onMouseLeave={() => setHoverRow(-1)}
            style={{ background: hoverRow === ri ? "var(--bf-orange-tint)" : "transparent" }}>
            {r.map((cell, ci) => (
              <td key={ci} style={{
                padding: "12px 16px", borderTop: "1px solid var(--border-default)",
                font: ci === 0 ? "600 14px/1.4 var(--font-sans)" : "var(--text-body-sm)",
                color: ci === 0 ? "var(--text-heading)" : "var(--text-body)",
              }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
