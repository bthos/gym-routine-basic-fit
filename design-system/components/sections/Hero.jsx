import React from "react";
import { Button } from "../primitives/Button.jsx";

/** Homepage hero: full-bleed orange gradient band, heavy uppercase ink headline,
    purple CTAs, optional full-height photo with diagonal cut on the right. */
export function Hero({ title, highlight, subtitle, note, imageUrl, imageAlt = "", overlayText, primaryCta, secondaryCta, tone = "orange", style }) {
  const orange = tone === "orange";
  return (
    <section style={{
      background: orange
        ? "linear-gradient(160deg, #F98A2B 0%, #F27A27 60%, #D66D23 100%)"
        : "var(--bf-white)",
      position: "relative", overflow: "hidden", ...style,
    }}>
      {orange && (
        <div aria-hidden="true" style={{
          position: "absolute", left: 24, bottom: 24, width: 130, height: 130,
          backgroundImage: "radial-gradient(rgba(255,255,255,.55) 2px, transparent 2.5px)",
          backgroundSize: "16px 16px", pointerEvents: "none",
        }}></div>
      )}
      <div style={{
        maxWidth: "var(--page-max-width)", margin: "0 auto",
        display: "grid", gridTemplateColumns: imageUrl ? "minmax(300px, 5fr) minmax(280px, 6fr)" : "1fr",
        alignItems: "stretch", position: "relative",
      }}>
        <div style={{
          padding: "var(--space-10) var(--page-gutter)",
          display: "grid", gap: "var(--space-4)", justifyItems: "start", alignContent: "center",
        }}>
          <h1 style={{ font: "var(--text-hero)", textTransform: "uppercase", color: "var(--bf-ink)", margin: 0, letterSpacing: "var(--tracking-heading)" }}>
            {title}{highlight && <> <span style={{ color: orange ? "var(--bf-ink)" : "var(--bf-orange)" }}>{highlight}</span></>}
          </h1>
          {subtitle && <p style={{ font: "700 18px/1.3 var(--font-sans)", textTransform: "uppercase", color: "var(--bf-ink)", margin: 0 }}>{subtitle}</p>}
          {note && <p style={{ font: "var(--text-body-sm)", color: orange ? "var(--bf-ink-2)" : "var(--text-muted)", margin: 0, maxWidth: 460 }}>{note}</p>}
          {(primaryCta || secondaryCta) && (
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 8 }}>
              {primaryCta && <Button variant="primary" href={primaryCta.href}>{primaryCta.label}</Button>}
              {secondaryCta && <Button variant="outline" href={secondaryCta.href}>{secondaryCta.label}</Button>}
            </div>
          )}
        </div>
        {imageUrl && (
          <div style={{
            position: "relative", minHeight: 380,
            clipPath: "polygon(14% 0, 100% 0, 100% 100%, 0 100%)",
          }}>
            <img src={imageUrl} alt={imageAlt} style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", display: "block",
            }} />
            {overlayText && (
              <div style={{
                position: "absolute", inset: 0, display: "grid", alignContent: "center",
                padding: "0 8%", pointerEvents: "none",
              }}>
                <div style={{
                  font: "800 clamp(36px, 5vw, 64px)/1.02 var(--font-display)",
                  fontStyle: "italic", textTransform: "uppercase", color: "var(--bf-white)",
                  letterSpacing: "0.01em", textShadow: "0 2px 24px rgba(0,0,0,.25)",
                }}>{overlayText}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
