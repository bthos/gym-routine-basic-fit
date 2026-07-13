/**
 * Page header in site style: white bg, logo, optional breadcrumb, big uppercase
 * ink title, subtitle, badge, meta. tone="ink" gives the dark variant.
 */
export interface PageHeaderProps {
  /** "light" (default, site style) or "ink" (dark) */
  tone?: "light" | "ink";
  /** e.g. [{label:"Home", href:"#"}, {label:"Pase de día"}] */
  breadcrumb?: { label: React.ReactNode; href?: string }[];
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Phase pill, e.g. "FASE 1 — ADAPTACIÓN (Meses 1-3)" */
  badge?: React.ReactNode;
  badgeTone?: "brand" | "ink" | "success";
  /** Gym + updated line */
  meta?: React.ReactNode;
  /** Official logo image; plain-type wordmark if omitted */
  logoSrc?: string;
  style?: React.CSSProperties;
}
export declare function PageHeader(props: PageHeaderProps): JSX.Element;
