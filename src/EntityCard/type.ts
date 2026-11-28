import type { CSSProperties, MouseEvent, ReactNode, Ref } from 'react';

/** Badge colour of an `EntityCard`. */
export type EntityCardBadgeColor =
  'default' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'discovery';

export interface EntityCardBadge {
  /** @default 'default' */
  color?: EntityCardBadgeColor;
  label: ReactNode;
}

export interface EntityCardAction {
  /** Opens this URL in a new tab. */
  href?: string;
  key?: string | number;
  label: ReactNode;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  /**
   * `solid` is the primary button, `soft` a filled one, `outline` a bordered one and `ghost` a
   * plain one. Without it, an action with `href` or a card `onAction` is `outline`, else `ghost`.
   */
  variant?: 'solid' | 'soft' | 'outline' | 'ghost';
}

export interface EntityCardClassNames {
  actions?: string;
  body?: string;
  image?: string;
  root?: string;
  title?: string;
}

export interface EntityCardStyles {
  actions?: CSSProperties;
  body?: CSSProperties;
  image?: CSSProperties;
  root?: CSSProperties;
  title?: CSSProperties;
}

export type EntityCardVariant = 'default' | 'a2ui';

export interface EntityCardProps {
  /** Up to three buttons under the content; more are dropped. */
  actions?: EntityCardAction[];
  /** A short status pill next to the subtitle, e.g. "In stock". */
  badge?: ReactNode | EntityCardBadge;
  className?: string;
  classNames?: EntityCardClassNames;
  /** Up to three lines. */
  description?: ReactNode;
  /** Opens this URL in a new tab when the card is clicked. */
  href?: string;
  /** Image URL, or a node (e.g. an `Image`) shown in the image slot. */
  image?: ReactNode;
  /** Alternative text of an image URL; defaults to the title when it is a string. */
  imageAlt?: string;
  /**
   * Aspect ratio of the image in the vertical layout.
   * @default '4 / 3'
   */
  imageAspectRatio?: string;
  /**
   * `vertical` puts the image on top, `horizontal` puts a square image on the left.
   * @default 'vertical'
   */
  layout?: 'vertical' | 'horizontal';
  /** A short fact line, e.g. "$29 / month" or "Open until 22:00". */
  meta?: ReactNode;
  /** Called when an action without `href` and without its own `onClick` is clicked. */
  onAction?: (action: EntityCardAction, index: number) => void;
  /** Called when the card is clicked; makes the card a link-like control. */
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  /** 0 to 5, shown as stars with the value. */
  rating?: number;
  /** Number of ratings, shown after the value. */
  ratingCount?: number;
  ref?: Ref<HTMLDivElement>;
  style?: CSSProperties;
  styles?: EntityCardStyles;
  /** A second line above the title, e.g. the brand or category. */
  subtitle?: ReactNode;
  /** The name. */
  title: ReactNode;
  /**
   * `default`: a lobe-ui card (theme border and radius, body type, lobe-ui `Tag` and `Button`).
   * `a2ui`: the A2UI playground entity card (CopilotKit standard catalog): 16px radius, compact
   * type that follows the surrounding font size, pill buttons and text stars.
   * @default 'default'
   */
  variant?: EntityCardVariant;
  /** Card width (number = px). Defaults to the full width of the container. */
  width?: number | string;
}
