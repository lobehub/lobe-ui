import type { CSSProperties, ReactNode, Ref } from 'react';

export interface CitationClassNames {
  card?: string;
  marker?: string;
  root?: string;
}

export interface CitationStyles {
  card?: CSSProperties;
  marker?: CSSProperties;
  root?: CSSProperties;
}

export interface CitationTexts {
  /** Link text at the bottom of the card. */
  openSource?: string;
  /** Accessible name of the marker; `{marker}` is replaced by the marker text. */
  source?: string;
}

export type CitationVariant = 'default' | 'a2ui';

export interface CitationProps {
  className?: string;
  classNames?: CitationClassNames;
  /** Marker number. @default 1 */
  index?: number;
  /** Marker text instead of the number, e.g. a domain. */
  label?: ReactNode;
  ref?: Ref<HTMLSpanElement>;
  /** The quoted passage, one or two lines. */
  snippet?: ReactNode;
  /** The publisher or domain; defaults to the host of `url`. */
  source?: ReactNode;
  style?: CSSProperties;
  styles?: CitationStyles;
  /** Overrides the built-in `citation.*` texts. */
  texts?: CitationTexts;
  /** The source title. */
  title?: ReactNode;
  /** The source URL (http or https); shows its favicon and an "Open source" link. */
  url?: string;
  /**
   * `default`: a lobe-ui marker and popover card.
   * `a2ui`: the A2UI playground citation (CopilotKit standard `Citation`): a superscript pill
   * marker and a 280px card, type following the surrounding font size.
   * @default 'default'
   */
  variant?: CitationVariant;
}
