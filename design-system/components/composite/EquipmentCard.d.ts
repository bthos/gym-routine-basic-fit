/**
 * Equipment catalog card: photo, name + model code, muscle tags, description,
 * current-weight badge, tutorial/manual links.
 */
export interface EquipmentCardProps {
  name: React.ReactNode;
  /** e.g. "G3-S10" */
  modelCode?: React.ReactNode;
  /** e.g. "Aura" */
  series?: React.ReactNode;
  imageUrl?: string;
  primaryMuscles?: React.ReactNode[];
  secondaryMuscles?: React.ReactNode[];
  description?: React.ReactNode;
  /** Current user weight in kg (renders badge over photo) */
  weight?: number;
  videoHref?: string;
  manualHref?: string;
  style?: React.CSSProperties;
}
export declare function EquipmentCard(props: EquipmentCardProps): JSX.Element;
