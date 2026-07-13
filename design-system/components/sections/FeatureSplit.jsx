import React from "react";
import { Button } from "../primitives/Button.jsx";
import { CheckList } from "../primitives/CheckList.jsx";

/** Alternating photo + text content block (site pattern). */
export function FeatureSplit({ title, body, checks = [], imageUrl, imageAlt = "", cta, reverse = false, tone = "light", style }) {
  const dark = tone === "ink";
  return (
    <section style={{
      background: dark ? "var(--bf-ink)" : "transparent",
      padding: dark ? "var(--space-8) var(--page-gutter)" : "var(--space-8) var(--page-gutter)", ...style,
    }}>
      <div style={{
        maxWidth: "var(--page-max-width)", margin: "0 auto",
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "var(--space-8)", alignItems: "center",
      }}>
        {imageUrl && (
          <img src={imageUrl} alt={imageAlt} style={{
            width: "100%", display: "block", borderRadius: "var(--radius-xl)",
            aspectRatio: "4 / 3", objectFit: "cover", background: "var(--bf-grey-1)",
            order: reverse ? 2 : 1,
          }} />
        )}
        <div style={{ order: reverse ? 1 : 2, display: "grid", gap: "var(--space-4)", justifyItems: "start" }}>
          <h2 style={{
            font: "var(--text-h2)", textTransform: "uppercase", margin: 0,
            color: dark ? "var(--bf-white)" : "var(--bf-ink)", letterSpacing: "var(--tracking-heading)",
          }}>{title}</h2>
          {body && <p style={{ font: "var(--text-body-md)", color: dark ? "rgba(255,255,255,.85)" : "var(--text-body)", margin: 0 }}>{body}</p>}
          {checks.length > 0 && <CheckList items={checks} />}
          {cta && <Button variant={dark ? "inverse" : "secondary"} href={cta.href}>{cta.label}</Button>}
        </div>
      </div>
    </section>
  );
}
