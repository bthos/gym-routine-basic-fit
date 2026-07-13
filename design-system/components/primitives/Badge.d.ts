/**
 * Solid status pill (weight badge, phase badge, gym badge).
 */
export interface BadgeProps {
  /** Color tone */
  tone?: "brand" | "ink" | "success" | "info" | "danger" | "neutral";
  size?: "md" | "lg";
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Badge(props: BadgeProps): JSX.Element;
