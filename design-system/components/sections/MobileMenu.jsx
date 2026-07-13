import React from "react";
import { Button } from "../primitives/Button.jsx";
import { Icon } from "../primitives/Icon.jsx";

const BF_LOGO = "https://www.basic-fit.com/on/demandware.static/Sites-BFE-Site/-/default/dw312ce583/img/svg/logo-bf-orange.svg";

/** Mobile nav drawer (site style): cream panel, dotted separators,
    purple left bar on the active item, arrow for items with submenus. */
export function MobileMenu({ items = [], activeId, utilities = [], language = "español", ctaLabel = "empezar", logoSrc = BF_LOGO, onClose, style }) {
  const dotted = { borderBottom: "1px dotted var(--bf-grey-4)" };
  return (
    <div style={{
      background: "var(--bf-cream)", minHeight: "100%", display: "flex", flexDirection: "column",
      maxWidth: 420, ...style,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px" }}>
        <img src={logoSrc} alt="Basic-Fit" style={{ height: 22 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Button variant="primary" size="sm">{ctaLabel}</Button>
          <button onClick={onClose} aria-label="Cerrar" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--bf-ink)", padding: 4 }}>
            <Icon name="x" size={22} />
          </button>
        </div>
      </div>
      <nav style={{ display: "grid" }}>
        {items.map((it, i) => {
          const active = it.id === activeId;
          return (
            <a key={i} href={it.href || "#"} style={{
              ...dotted,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: active ? "16px 18px 16px 26px" : "16px 18px",
              font: "700 16px/1.3 var(--font-sans)", color: "var(--bf-ink)", textDecoration: "none",
              borderLeft: active ? "3px solid var(--bf-purple)" : "3px solid transparent",
            }}>
              {it.label}
              {it.hasMenu && <span style={{ color: "var(--bf-ink)" }}><Icon name="arrow-right" size={20} /></span>}
            </a>
          );
        })}
      </nav>
      <div style={{ flex: 1 }}></div>
      <div style={{ display: "grid", padding: "12px 0" }}>
        {utilities.map((u, i) => (
          <a key={i} href={u.href || "#"} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "12px 18px",
            font: "500 15px/1.3 var(--font-sans)", color: "var(--bf-ink)", textDecoration: "none",
          }}>
            {u.icon && <Icon name={u.icon} size={18} />}
            {u.label}
          </a>
        ))}
        <div style={{
          ...{ borderTop: "1px dotted var(--bf-grey-4)" },
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 18px", font: "500 15px/1.3 var(--font-sans)", color: "var(--bf-ink)",
        }}>
          {language}
          <Icon name="chevron-down" size={18} />
        </div>
      </div>
    </div>
  );
}
