/**
 * Titled note card for "Notas importantes" — top border carries the tone.
 */
export interface NoteItemProps {
  title?: React.ReactNode;
  /** danger = deload / caution notes */
  tone?: "neutral" | "success" | "danger";
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function NoteItem(props: NoteItemProps): JSX.Element;
