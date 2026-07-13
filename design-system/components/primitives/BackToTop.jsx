import React from "react";
import { Icon } from "./Icon.jsx";

/** Fixed square back-to-top button (bottom-right). */
export function BackToTop({ visible = true, onClick, style }) {
  const [hover, setHover] = React.useState(false);
  if (!visible) return null;
  return (
    <button aria-label="Volver arriba"
      onClick={onClick || (() => { document.documentElement.scrollTop = 0; document.body.scrollTop = 0; })}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        position: "fixed",
        bottom: "calc(20px + env(safe-area-inset-bottom, 0px))",
        right: "calc(20px + env(safe-area-inset-right, 0px))",
        width: 48, height: 48, borderRadius: "var(--radius-btn)", border: "none", cursor: "pointer",
        background: hover ? "var(--bf-purple-dark)" : "var(--bf-purple)",
        color: "var(--bf-white)", fontSize: 20, lineHeight: 1,
        boxShadow: "var(--shadow-raised)", zIndex: 999,
        transition: "background var(--motion-fast)", ...style,
      }}><Icon name="arrow-up" size={22} style={{ margin: "0 auto" }} /></button>
  );
}
