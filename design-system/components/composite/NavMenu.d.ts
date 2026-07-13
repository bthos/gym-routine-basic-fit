/**
 * Sticky blurred section nav; horizontal scroll on mobile, active item = orange pill.
 */
export interface NavMenuProps {
  items: { id: string; label: React.ReactNode }[];
  activeId?: string;
  onSelect?: (id: string) => void;
  style?: React.CSSProperties;
}
export declare function NavMenu(props: NavMenuProps): JSX.Element;
