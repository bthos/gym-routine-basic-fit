/**
 * Big stat block — bold number + small qualifier (catalog header metadata).
 */
export interface StatCardProps {
  /** The big number, e.g. "27" or "1600+" */
  value: React.ReactNode;
  label: React.ReactNode;
  /** Ink background with orange number */
  inverse?: boolean;
  style?: React.CSSProperties;
}
export declare function StatCard(props: StatCardProps): JSX.Element;
