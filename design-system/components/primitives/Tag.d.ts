/**
 * Muted square-corner chip for muscle groups, equipment specs, categories.
 */
export interface TagProps {
  /** primary = targeted muscle (orange tint); secondary = assisting muscle; neutral = spec/category */
  tone?: "neutral" | "primary" | "secondary";
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Tag(props: TagProps): JSX.Element;
