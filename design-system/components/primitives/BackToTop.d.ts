/**
 * Fixed circular back-to-top FAB, bottom-right with safe-area insets.
 */
export interface BackToTopProps {
  visible?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function BackToTop(props: BackToTopProps): JSX.Element;
