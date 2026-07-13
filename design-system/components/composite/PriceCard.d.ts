/**
 * Subscription plan card (comfort / premium / ultimate): lowercase display
 * plan name, price with optional strike-through, promo + fee notes,
 * check-list features, orange CTA. flag renders the "Todo incluido" ribbon.
 */
export interface PriceCardProps {
  name: React.ReactNode;
  price: React.ReactNode;
  oldPrice?: React.ReactNode;
  period?: React.ReactNode;
  /** e.g. "19,99 € cuota de inscripción" */
  feeNote?: React.ReactNode;
  /** e.g. "Primeras 4 semanas por 9,99 € + una mochila" */
  promoNote?: React.ReactNode;
  features?: React.ReactNode[];
  /** Ribbon, e.g. "Todo incluido" */
  flag?: React.ReactNode;
  ctaLabel?: React.ReactNode;
  ctaHref?: string;
  style?: React.CSSProperties;
}
export declare function PriceCard(props: PriceCardProps): JSX.Element;
