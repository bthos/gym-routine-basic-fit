/**
 * Homepage hero: full-bleed orange gradient band with white dot pattern,
 * heavy uppercase ink headline, purple CTAs, optional diagonal-cut photo
 * with italic white overlay slogan. tone="light" for a plain white version.
 */
export interface HeroProps {
  title: React.ReactNode;
  /** Emphasized run after title, e.g. "9,99 €*" */
  highlight?: React.ReactNode;
  /** Bold uppercase subline, e.g. "y llévate una mochila" */
  subtitle?: React.ReactNode;
  /** Small-print legal note */
  note?: React.ReactNode;
  imageUrl?: string;
  imageAlt?: string;
  /** Italic white slogan over the photo, e.g. "El club que te sienta bien" */
  overlayText?: React.ReactNode;
  primaryCta?: { label: React.ReactNode; href?: string };
  secondaryCta?: { label: React.ReactNode; href?: string };
  tone?: "orange" | "light";
  style?: React.CSSProperties;
}
export declare function Hero(props: HeroProps): JSX.Element;
