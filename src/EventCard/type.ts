import type { CSSProperties, HTMLAttributes, MouseEventHandler, ReactNode, Ref } from 'react';

export interface EventCardClassNames {
  body?: string;
  cover?: string;
  date?: string;
  footer?: string;
  root?: string;
}

export interface EventCardStyles {
  body?: CSSProperties;
  cover?: CSSProperties;
  date?: CSSProperties;
  footer?: CSSProperties;
  root?: CSSProperties;
}

export interface EventCardTexts {
  /** Month cell of the date block when `date` cannot be parsed. @default 'Date' */
  date?: string;
  /** Attendee count; `{count}` is replaced. @default '{count} going' */
  going?: string;
  /** Host line; `{host}` is replaced. @default 'Hosted by {host}' */
  hostedBy?: string;
}

export type EventCardVariant = 'default' | 'a2ui';

export interface EventCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Text of the action button. @default 'RSVP' */
  actionLabel?: ReactNode;
  /** Number of people going, in the footer. */
  attendees?: number;
  classNames?: EventCardClassNames;
  /**
   * `YYYY-MM-DD` (read as a local date) or anything `Date` can parse; drawn as a calendar block.
   * Free text that does not parse is shown on the time line instead.
   */
  date: string;
  description?: ReactNode;
  host?: ReactNode;
  /** Cover image URL; the date block overlaps its lower edge. */
  image?: string;
  /** Locale of the month and weekday names. @default 'en-US' */
  locale?: string;
  /** Shows the action button (with `actionLabel`) in the footer. */
  onAction?: MouseEventHandler<HTMLElement>;
  ref?: Ref<HTMLDivElement>;
  styles?: EventCardStyles;
  tags?: string[];
  /** Overrides the built-in `eventCard.*` texts. */
  texts?: EventCardTexts;
  /** e.g. "6:30 PM to 9:00 PM". */
  time?: ReactNode;
  title: ReactNode;
  /**
   * `default`: a plain lobe-ui card (theme border and radius, body type, `Tag` chips, `Button`).
   * `a2ui`: the A2UI playground event card (14px card, raised date block, hairline chips).
   * @default 'default'
   */
  variant?: EventCardVariant;
  venue?: ReactNode;
}
