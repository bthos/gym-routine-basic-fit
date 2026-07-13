/**
 * Toggleable filter pill (catalog category filters, EN/ES/BE language switch).
 */
export interface FilterPillProps {
  active?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function FilterPill(props: FilterPillProps): JSX.Element;
