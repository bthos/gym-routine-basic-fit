/**
 * Full-width solid color banner: phase objectives, warmup, cooldown blocks.
 */
export interface SectionBannerProps {
  /** brand = highlight, neutral = light grey (default for info sections), ink = dark; success/info reserved for app statuses */
  tone?: "brand" | "ink" | "neutral" | "success" | "info";
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Bullet list */
  items?: React.ReactNode[];
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function SectionBanner(props: SectionBannerProps): JSX.Element;
