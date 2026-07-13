/**
 * "Encuentra tu club" search card: uppercase title with orange highlight
 * word, bordered search input with purple glyph, grid of city chips.
 */
export interface ClubFinderProps {
  title?: React.ReactNode;
  /** Orange word, default "club" */
  highlight?: React.ReactNode;
  subtitle?: React.ReactNode;
  placeholder?: string;
  cities?: string[];
  onSearch?: (query: string) => void;
  style?: React.CSSProperties;
}
export declare function ClubFinder(props: ClubFinderProps): JSX.Element;
