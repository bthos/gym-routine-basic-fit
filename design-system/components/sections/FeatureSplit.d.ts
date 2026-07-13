/**
 * Alternating photo/text content block: rounded photo, uppercase H2, body,
 * optional orange-check list and CTA. tone="ink" for the dark band variant.
 */
export interface FeatureSplitProps {
  title: React.ReactNode;
  body?: React.ReactNode;
  checks?: React.ReactNode[];
  imageUrl?: string;
  imageAlt?: string;
  cta?: { label: React.ReactNode; href?: string };
  /** Photo on the right */
  reverse?: boolean;
  tone?: "light" | "ink";
  style?: React.CSSProperties;
}
export declare function FeatureSplit(props: FeatureSplitProps): JSX.Element;
