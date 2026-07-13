import React from "react";

/** Basic-Fit button: rectangular (4px), bold UPPERCASE label, purple action color. */
export function Button({ variant = "primary", size = "md", disabled = false, href, onClick, children, style }) {
  const pad = size === "lg" ? "16px 32px" : size === "sm" ? "9px 18px" : "13px 26px";
  const fontSize = size === "lg" ? 16 : size === "sm" ? 13 : 15;
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    padding: pad, font: `700 ${fontSize}px/1 var(--font-sans)`,
    letterSpacing: "0.04em", textTransform: "uppercase",
    borderRadius: "var(--radius-btn)", cursor: disabled ? "default" : "pointer",
    textDecoration: "none", border: "2px solid transparent",
    transition: "background var(--motion-fast), color var(--motion-fast), border-color var(--motion-fast)",
    boxSizing: "border-box",
  };
  const variants = {
    primary: { background: "var(--bf-purple)", color: "var(--bf-white)", borderColor: "var(--bf-purple)" },
    outline: { background: "var(--bf-white)", color: "var(--bf-purple)", borderColor: "var(--bf-purple)" },
    secondary: { background: "var(--bf-ink)", color: "var(--bf-white)", borderColor: "var(--bf-ink)" },
    ghost: { background: "transparent", color: "var(--bf-purple)", borderColor: "transparent" },
    inverse: { background: "var(--bf-white)", color: "var(--bf-ink)", borderColor: "var(--bf-white)" },
  };
  const [hover, setHover] = React.useState(false);
  const hoverStyles = {
    primary: { background: "var(--bf-purple-dark)", borderColor: "var(--bf-purple-dark)" },
    outline: { background: "var(--bf-purple-tint)" },
    secondary: { background: "#000", borderColor: "#000" },
    ghost: { background: "var(--bf-purple-tint)" },
    inverse: { background: "var(--bf-grey-2)", borderColor: "var(--bf-grey-2)" },
  };
  const s = {
    ...base, ...variants[variant],
    ...(hover && !disabled ? hoverStyles[variant] : {}),
    ...(disabled ? { opacity: 0.45, pointerEvents: "none" } : {}),
    ...style,
  };
  const Tag = href ? "a" : "button";
  return (
    <Tag href={href} onClick={onClick} disabled={disabled && !href} style={s}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {children}
    </Tag>
  );
}
