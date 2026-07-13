/**
 * FAQ accordion: hairline-separated rows, bold question, orange +/× toggle.
 */
export interface AccordionProps {
  items: { question: React.ReactNode; answer: React.ReactNode }[];
  /** Index open initially; -1 = all closed */
  defaultOpen?: number;
  style?: React.CSSProperties;
}
export declare function Accordion(props: AccordionProps): JSX.Element;
