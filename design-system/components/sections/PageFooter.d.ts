/**
 * Dark site footer: logo, link columns, legal lines above a hairline.
 */
export interface PageFooterProps {
  logoSrc?: string;
  columns?: { title: React.ReactNode; links: { label: React.ReactNode; href?: string }[] }[];
  lines?: React.ReactNode[];
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function PageFooter(props: PageFooterProps): JSX.Element;
