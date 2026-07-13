/**
 * Weekly-plan summary table with ink header row.
 */
export interface SummaryTableProps {
  /** Header labels */
  columns: React.ReactNode[];
  /** Row cells, one array per row */
  rows: React.ReactNode[][];
  style?: React.CSSProperties;
}
export declare function SummaryTable(props: SummaryTableProps): JSX.Element;
