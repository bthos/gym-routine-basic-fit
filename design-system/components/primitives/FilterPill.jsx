import React from "react";

/** Toggleable filter chip (site style): white with 1px ink border; active = solid orange. */
export function FilterPill({ active = false, onClick, children, style }) {
  const [hover, setHover] = React.useState(false);
  const s = {
    padding: "11px 22px", font: "600 15px/1.2 var(--font-sans)",
    borderRadius: "var(--radius-control)", cursor: "pointer",
    border: "1px solid " + (active ? "var(--bf-orange)" : "var(--border-control)"),
    background: active ? "var(--bf-orange)" : "var(--bf-white)",
    color: active ? "var(--bf-white)" : "var(--bf-ink)",
    boxShadow: hover && !active ? "inset 0 0 0 1px var(--border-control)" : "none",
    transition: "all var(--motion-fast)", whiteSpace: "nowrap",
    ...style,
  };
  return (
    <button style={s} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {children}
    </button>
  );
}
