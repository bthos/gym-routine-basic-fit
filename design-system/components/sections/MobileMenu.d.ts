/**
 * Mobile nav drawer: cream panel, dotted separators, purple left bar on the
 * active item, arrow-right on items with submenus, utility links + language
 * row at the bottom.
 */
export interface MobileMenuProps {
  items?: { id?: string; label: React.ReactNode; href?: string; hasMenu?: boolean }[];
  activeId?: string;
  /** e.g. [{ icon: "user", label: "My Basic-Fit" }, { icon: "info", label: "Atención al cliente" }] */
  utilities?: { icon?: string; label: React.ReactNode; href?: string }[];
  language?: React.ReactNode;
  ctaLabel?: React.ReactNode;
  logoSrc?: string;
  onClose?: () => void;
  style?: React.CSSProperties;
}
export declare function MobileMenu(props: MobileMenuProps): JSX.Element;
