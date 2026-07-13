import React from "react";
import { Icon } from "./Icon.jsx";

/** Bullet list with orange checkmarks (site USP pattern). */
export function CheckList({ items = [], size = "md", style }) {
  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: size === "lg" ? 12 : 8, ...style }}>
      {items.map((it, i) => (
        <li key={i} style={{
          display: "flex", gap: 10, alignItems: "flex-start",
          font: size === "lg" ? "var(--text-body-lg)" : "var(--text-body-md)",
          color: "var(--text-body)",
        }}>
          <span style={{ color: "var(--bf-orange)", marginTop: 2 }}><Icon name="check" size={size === "lg" ? 20 : 17} strokeWidth={3} /></span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}
