import React from "react";

const BF_LOGO = "https://www.basic-fit.com/on/demandware.static/Sites-BFE-Site/-/default/dw312ce583/img/svg/logo-bf-orange.svg";
import { Button } from "../primitives/Button.jsx";
import { Icon } from "../primitives/Icon.jsx";

/** Site header (basic-fit.com): cream USP bar with ink text + utility links,
    then white logo/nav row with search icon and purple CTA. */
export function SiteHeader({ usps = [], utilities = [], navItems = [], ctaLabel = "empezar", ctaHref = "#", logoSrc = BF_LOGO, style }) {
  return (
    <div style={{ ...style }}>
      {(usps.length > 0 || utilities.length > 0) && (
        <div style={{ background: "var(--bf-cream)", padding: "10px var(--page-gutter)" }}>
          <div style={{
            maxWidth: "var(--page-max-width)", margin: "0 auto", display: "flex",
            gap: "var(--space-6)", alignItems: "center", overflowX: "auto", scrollbarWidth: "none",
          }}>
            {usps.map((u, i) => (
              <span key={i} style={{
                font: "500 14px/1.2 var(--font-sans)", color: "var(--bf-ink)",
                whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 8,
              }}>
                {u.icon && (typeof u.icon === "string" && !u.icon.includes(".") && !u.icon.includes("/") ? <Icon name={u.icon} size={16} /> : <img src={u.icon} alt="" style={{ height: 16 }} />)}
                {u.label !== undefined ? u.label : u}
              </span>
            ))}
            <span style={{ flex: 1 }}></span>
            {utilities.map((u, i) => (
              <a key={i} href={u.href || "#"} style={{
                font: "500 14px/1.2 var(--font-sans)", color: "var(--bf-ink)",
                whiteSpace: "nowrap", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 6,
              }}>{u.icon && <Icon name={u.icon} size={15} />}{u.label}</a>
            ))}
          </div>
        </div>
      )}
      <div style={{ background: "var(--bf-white)", borderBottom: "1px solid var(--border-default)", padding: "14px var(--page-gutter)" }}>
        <div style={{
          maxWidth: "var(--page-max-width)", margin: "0 auto",
          display: "flex", alignItems: "center", gap: "var(--space-5)",
        }}>
          <img src={logoSrc} alt="Basic-Fit" style={{ height: 24, flexShrink: 0 }} />
          <nav style={{ display: "flex", gap: 2, flex: 1, overflowX: "auto", scrollbarWidth: "none" }}>
            {navItems.map((it, i) => (
              <a key={i} href={it.href || "#"} style={{
                padding: "10px 14px", font: "500 15px/1.2 var(--font-sans)",
                color: "var(--bf-ink)", whiteSpace: "nowrap", display: "inline-flex",
                alignItems: "center", gap: 6,
              }}>
                {it.label}
                {it.hasMenu && <span style={{ color: "var(--bf-ink-3)" }}><Icon name="chevron-down" size={14} /></span>}
              </a>
            ))}
          </nav>
          <span style={{ color: "var(--bf-ink)", padding: "0 4px", cursor: "pointer" }}><Icon name="search" size={20} /></span>
          <Button variant="primary" size="sm" href={ctaHref} style={{ flexShrink: 0 }}>{ctaLabel}</Button>
        </div>
      </div>
    </div>
  );
}
