import React from "react";

/** Horizontal section nav (site style): white bar, ink links, 4px deep-purple underline on active. */
export function NavMenu({ items = [], activeId, onSelect, style }) {
  const [hoverId, setHoverId] = React.useState(null);
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "var(--bf-white)",
      borderBottom: "1px solid var(--border-default)",
      padding: "0 var(--page-gutter)", ...style,
    }}>
      <ul style={{
        listStyle: "none", margin: 0, padding: 0, display: "flex", gap: 8,
        overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none",
      }}>
        {items.map((it) => {
          const active = it.id === activeId;
          const lit = active || it.id === hoverId;
          return (
            <li key={it.id} style={{ flexShrink: 0 }}>
              <a href={"#" + it.id}
                onClick={onSelect ? () => { onSelect(it.id); } : undefined}
                onMouseEnter={() => setHoverId(it.id)} onMouseLeave={() => setHoverId(null)}
                style={{
                  display: "block", padding: "14px 16px 10px",
                  font: `${active ? 700 : 500} 15px/1.2 var(--font-sans)`, textDecoration: "none",
                  color: "var(--bf-ink)",
                  borderBottom: "4px solid " + (lit ? "var(--bf-purple-deep)" : "transparent"),
                  transition: "border-color var(--motion-fast)",
                }}>{it.label}</a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
