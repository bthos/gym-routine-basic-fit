import React from "react";
import { Tag } from "../primitives/Tag.jsx";
import { Icon } from "../primitives/Icon.jsx";

/** Article/content card (site style): square photo with white sharp card
    overlapping its bottom, category tag, uppercase title, body, "Leer más →". */
export function ArticleCard({ image, imageAlt = "", tag, title, body, linkLabel = "Leer más", href = "#", style }) {
  return (
    <article style={{ position: "relative", paddingBottom: 48, ...style }}>
      <div style={{ aspectRatio: "4 / 3", background: "var(--bf-grey-2)", overflow: "hidden" }}>
        {image && <img src={image} alt={imageAlt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
      </div>
      <div style={{
        background: "var(--bf-white)", padding: "var(--space-5)",
        margin: "-90px 0 0 var(--space-6)", position: "relative",
        display: "grid", gap: 12, justifyItems: "start",
      }}>
        {tag && <Tag>{tag}</Tag>}
        <h3 style={{
          font: "var(--text-h4)", textTransform: "uppercase", margin: 0,
          color: "var(--bf-ink)", letterSpacing: "var(--tracking-heading)",
        }}>{title}</h3>
        {body && <p style={{ font: "var(--text-body-md)", color: "var(--text-body)", margin: 0 }}>{body}</p>}
        <a href={href} style={{
          justifySelf: "end", display: "inline-flex", alignItems: "center", gap: 6,
          font: "700 16px/1 var(--font-sans)", color: "var(--bf-ink)", textDecoration: "none",
        }}>
          {linkLabel}
          <span style={{ color: "var(--bf-orange)", transform: "rotate(45deg)" }}><Icon name="arrow-right" size={16} strokeWidth={2.5} /></span>
        </a>
      </div>
    </article>
  );
}
