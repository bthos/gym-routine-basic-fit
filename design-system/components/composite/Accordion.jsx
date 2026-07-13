import React from "react";

/** FAQ accordion (site pattern): hairline rows, bold question, +/− toggle. */
export function Accordion({ items = [], defaultOpen = -1, style }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div style={{ display: "grid", ...style }}>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i} style={{ borderBottom: "1px solid var(--border-default)" }}>
            <button onClick={() => setOpen(isOpen ? -1 : i)} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
              width: "100%", padding: "18px 4px", background: "none", border: "none",
              cursor: "pointer", textAlign: "left",
              font: "700 17px/1.35 var(--font-sans)", color: "var(--bf-ink)",
            }}>
              <span>{it.question}</span>
              <span aria-hidden="true" style={{
                font: "400 26px/1 var(--font-sans)", color: "var(--bf-purple)", flexShrink: 0,
                transform: isOpen ? "rotate(45deg)" : "none", transition: "transform var(--motion-fast)",
              }}>+</span>
            </button>
            {isOpen && (
              <div style={{ padding: "0 4px 18px", font: "var(--text-body-md)", color: "var(--text-body)", maxWidth: 720 }}>
                {it.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
