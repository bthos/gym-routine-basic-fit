const DSTab = window.BasicFitDesignSystem_1cb8a2;
const { Icon: TabIcon } = DSTab;

/**
 * Mockup — new component, not yet in design-system/components/.
 * Replaces the top NavMenu anchor-scroll pattern for this app-shaped feature.
 * Ink dark surface (per readme.md's "Dark surfaces" convention: white text,
 * orange reserved for the wordmark/logo only — active state uses purple,
 * matching the top nav's "4px deep-purple underline" convention mirrored as
 * a top border since this bar sits at the bottom of the screen).
 */
function BottomTabBar({ active, onChange, tabs }) {
  return (
    <nav aria-label="Navegación principal" style={{
      position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 200,
      background: "var(--bf-ink)", display: "flex",
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
      borderTop: "1px solid rgba(255,255,255,.08)",
      boxShadow: "0 -2px 12px rgba(0,0,0,.18)",
    }}>
      {tabs.map((t) => {
        const isActive = t.id === active;
        return (
          <button key={t.id} onClick={() => onChange(t.id)} aria-current={isActive ? "page" : undefined} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            padding: "10px 4px 8px", background: "transparent",
            border: "none", borderTop: isActive ? "3px solid var(--bf-purple-deep)" : "3px solid transparent",
            color: isActive ? "var(--bf-white)" : "rgba(255,255,255,.62)",
            font: "600 11px/1.1 var(--font-sans)", letterSpacing: ".02em",
            cursor: "pointer", minHeight: 52, minWidth: 44,
          }}>
            <TabIcon name={t.icon} size={22} strokeWidth={isActive ? 2.4 : 2} />
            {t.label}
          </button>
        );
      })}
    </nav>
  );
}
window.BottomTabBar = BottomTabBar;
