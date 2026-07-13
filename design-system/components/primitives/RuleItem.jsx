import React from "react";
import { Icon } from "./Icon.jsx";

/** Compact rule card (reglas generales grid). icon is an Icon name. */
export function RuleItem({ icon, children, style }) {
  return (
    <div style={{
      display: "flex", gap: 12, alignItems: "flex-start",
      background: "var(--bf-white)", border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-md)", padding: "var(--space-4)", ...style,
    }}>
      {icon && (
        <span style={{ color: "var(--bf-purple)", marginTop: 1 }}>
          {typeof icon === "string" ? <Icon name={icon} size={20} /> : icon}
        </span>
      )}
      <span style={{ font: "var(--text-body-sm)", color: "var(--text-body)" }}>{children}</span>
    </div>
  );
}
