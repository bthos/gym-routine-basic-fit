import React from "react";
import { Button } from "../primitives/Button.jsx";
import { CheckList } from "../primitives/CheckList.jsx";

/** Subscription plan card: lowercase plan name, price block, features, CTA. */
export function PriceCard({ name, price, oldPrice, period = "/ 4 semanas", feeNote, promoNote, features = [], flag, ctaLabel = "empezar", ctaHref = "#", style }) {
  return (
    <article style={{
      background: "var(--bf-white)", borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-card)", overflow: "hidden",
      border: flag ? "2px solid var(--bf-orange)" : "1px solid var(--border-default)",
      display: "grid", alignContent: "start", ...style,
    }}>
      {flag && (
        <div style={{
          background: "var(--bf-orange)", color: "var(--bf-white)", textAlign: "center",
          font: "700 13px/1.2 var(--font-sans)", padding: "6px 12px", textTransform: "uppercase", letterSpacing: ".05em",
        }}>{flag}</div>
      )}
      <div style={{ padding: "var(--space-5)", display: "grid", gap: "var(--space-4)", justifyItems: "start" }}>
        <h3 style={{
          font: "800 24px/1 var(--font-display)", textTransform: "lowercase",
          color: "var(--bf-ink)", margin: 0,
        }}>{name}</h3>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
            {oldPrice && <span style={{ font: "600 18px/1 var(--font-sans)", color: "var(--bf-grey-4)", textDecoration: "line-through" }}>{oldPrice}</span>}
            <span style={{ font: "800 34px/1 var(--font-display)", color: "var(--bf-ink)" }}>{price}</span>
            <span style={{ font: "var(--text-body-sm)", color: "var(--text-muted)" }}>{period}</span>
          </div>
          {feeNote && <div style={{ font: "var(--text-caption)", color: "var(--text-muted)", marginTop: 4 }}>{feeNote}</div>}
          {promoNote && <div style={{ font: "600 14px/1.4 var(--font-sans)", color: "var(--bf-orange-deep)", marginTop: 6 }}>{promoNote}</div>}
        </div>
        {features.length > 0 && <CheckList items={features} />}
        <Button variant="primary" href={ctaHref} style={{ justifySelf: "stretch" }}>{ctaLabel}</Button>
      </div>
    </article>
  );
}
