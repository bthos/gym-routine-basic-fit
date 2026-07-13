/**
 * Small label+value block for exercise parameters (Series × Reps, Descanso…).
 */
export interface DetailItemProps {
  label: React.ReactNode;
  value: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function DetailItem(props: DetailItemProps): JSX.Element;
