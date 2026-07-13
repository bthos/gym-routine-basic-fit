import React from "react";
import { FilterPill } from "../primitives/FilterPill.jsx";
import { Icon } from "../primitives/Icon.jsx";

/** "Encuentra tu club" card: title with orange highlight, search input, city chips. */
export function ClubFinder({ title = "Encuentra tu", highlight = "club", subtitle, placeholder = "Busca por ciudad, calle, código postal o nombre del club", cities = [], onSearch, style }) {
  const [q, setQ] = React.useState("");
  return (
    <div style={{
      background: "var(--bf-white)", borderRadius: "var(--radius-md)",
      boxShadow: "var(--shadow-raised)", padding: "var(--space-6)",
      display: "grid", gap: "var(--space-4)", ...style,
    }}>
      <div>
        <h2 style={{
          font: "var(--text-h2)", textTransform: "uppercase", margin: 0,
          color: "var(--bf-ink)", letterSpacing: "var(--tracking-heading)",
        }}>
          {title} <span style={{ color: "var(--bf-orange)" }}>{highlight}</span>
        </h2>
        {subtitle && <p style={{ font: "var(--text-body-md)", color: "var(--text-body)", margin: "6px 0 0" }}>{subtitle}</p>}
      </div>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        border: "1px solid var(--border-control)", borderRadius: "var(--radius-control)",
        padding: "13px 16px", background: "var(--bf-white)",
      }}>
        <span style={{ color: "var(--bf-purple)" }}><Icon name="search" size={22} /></span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch && onSearch(q)}
          placeholder={placeholder}
          style={{
            border: "none", outline: "none", flex: 1, background: "transparent",
            font: "400 16px/1.3 var(--font-sans)", color: "var(--bf-ink)",
          }} />
      </div>
      {cities.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10 }}>
          {cities.map((c, i) => (
            <FilterPill key={i} onClick={() => onSearch && onSearch(c)} style={{ textAlign: "center" }}>{c}</FilterPill>
          ))}
        </div>
      )}
    </div>
  );
}
