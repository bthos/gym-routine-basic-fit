/**
 * Basic-Fit pill button. Primary orange CTA, lowercase label per brand.
 */
export interface ButtonProps {
  /** Visual style */
  variant?: "primary" | "secondary" | "outline" | "ghost" | "inverse";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  /** Renders an <a> when set */
  href?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Button(props: ButtonProps): JSX.Element;
