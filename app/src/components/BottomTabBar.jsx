import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from '../../../design-system/components/primitives/Icon.jsx';

/**
 * Fixed bottom nav — ux-design.md's deliberate departure from the
 * design-system's top NavMenu anchor-scroll pattern (this is a multi-screen
 * app with persistent state, not one scrolling document). Derives its
 * active tab from useLocation() (via NavLink) rather than being a
 * fully-controlled component, per tech-plan.md.
 *
 * data-testid="bottom-tab-bar" / "tab-item" are load-bearing: tests/
 * viewport-check.js asserts all tab-item elements share one offsetTop
 * (never wraps to multiple rows) at 360/390/412/768px.
 */
const TABS = [
  { id: 'home', label: 'Inicio', icon: 'home', path: '/', end: true },
  { id: 'program', label: 'Programa', icon: 'dumbbell', path: '/program', end: false },
  { id: 'catalog', label: 'Catálogo', icon: 'search', path: '/catalog', end: false },
  { id: 'history', label: 'Historial', icon: 'bar-chart-2', path: '/history', end: false },
];

const linkStyle = ({ isActive }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 4,
  padding: '10px 4px 8px',
  textDecoration: 'none',
  borderTop: isActive ? '3px solid var(--bf-purple-deep)' : '3px solid transparent',
  color: isActive ? 'var(--bf-white)' : 'rgba(255,255,255,.62)',
  font: '600 11px/1.1 var(--font-sans)',
  letterSpacing: '.02em',
  cursor: 'pointer',
  minHeight: 52,
  minWidth: 44,
});

export function BottomTabBar() {
  return (
    <nav
      aria-label="Navegación principal"
      data-testid="bottom-tab-bar"
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 200,
        background: 'var(--bf-ink)',
        display: 'flex',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        borderTop: '1px solid rgba(255,255,255,.08)',
        boxShadow: '0 -2px 12px rgba(0,0,0,.18)',
      }}
    >
      {TABS.map((tab) => (
        <NavLink key={tab.id} to={tab.path} end={tab.end} data-testid="tab-item" style={linkStyle}>
          {({ isActive }) => (
            <>
              <Icon name={tab.icon} size={22} strokeWidth={isActive ? 2.4 : 2} />
              {tab.label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
