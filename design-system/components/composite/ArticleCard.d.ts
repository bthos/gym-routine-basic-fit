/**
 * Article/content card: square photo, white sharp card overlapping the photo
 * bottom, outlined category tag, uppercase title, body, "Leer más ↘".
 * Place on the sand (--bf-sand) background band.
 */
export interface ArticleCardProps {
  image?: string;
  imageAlt?: string;
  /** Category label, e.g. "NUTRICIÓN" */
  tag?: React.ReactNode;
  title: React.ReactNode;
  body?: React.ReactNode;
  linkLabel?: React.ReactNode;
  href?: string;
  style?: React.CSSProperties;
}
export declare function ArticleCard(props: ArticleCardProps): JSX.Element;
