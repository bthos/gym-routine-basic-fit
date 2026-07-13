/**
 * Compact rule card for the "Reglas generales" grid.
 */
export interface RuleItemProps {
  /** Icon name from the thin-line Icon set (e.g. "droplet", "clock"), or a custom node */
  icon?: string | React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function RuleItem(props: RuleItemProps): JSX.Element;
