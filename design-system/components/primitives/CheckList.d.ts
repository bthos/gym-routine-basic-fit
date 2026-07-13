/**
 * Bullet list with orange ✓ marks — the site's benefits pattern.
 */
export interface CheckListProps {
  items: React.ReactNode[];
  size?: "md" | "lg";
  style?: React.CSSProperties;
}
export declare function CheckList(props: CheckListProps): JSX.Element;
