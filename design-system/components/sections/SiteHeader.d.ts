/**
 * Site header (basic-fit.com): white USP bar (ink text, optional icons,
 * right-aligned utility links) + white logo/nav row with search glyph and
 * purple uppercase CTA.
 */
export interface SiteHeaderProps {
  /** Strings or { icon, label } — icon is an Icon name or an image URL */
  usps?: (React.ReactNode | { icon?: string; label: React.ReactNode })[];
  /** Right side of USP bar, e.g. My Basic-Fit / Atención al cliente / ES; icon is an Icon name */
  utilities?: { label: React.ReactNode; href?: string; icon?: string }[];
  navItems?: { label: React.ReactNode; href?: string; hasMenu?: boolean }[];
  ctaLabel?: React.ReactNode;
  ctaHref?: string;
  /** Defaults to the official CDN logo SVG */
  logoSrc?: string;
  style?: React.CSSProperties;
}
export declare function SiteHeader(props: SiteHeaderProps): JSX.Element;
