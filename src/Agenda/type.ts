import type { CSSProperties, ReactNode, Ref } from 'react';

/** Accent bar colour of an event. */
export type AgendaTone = 'default' | 'positive' | 'negative' | 'warning' | 'info' | 'accent';

export interface AgendaEvent {
  description?: ReactNode;
  location?: ReactNode;
  speaker?: ReactNode;
  /** Shown in the time column; an event without one reads "All day". */
  time?: ReactNode;
  title: ReactNode;
  /** Accent bar colour. @default 'accent' */
  tone?: AgendaTone;
}

export interface AgendaDay {
  /** `YYYY-MM-DD` (or any `Date`-parsable string); shown as weekday, day number and month. */
  date: string;
  events?: AgendaEvent[];
  /** Replaces the weekday above the day number, e.g. "Today". */
  label?: ReactNode;
}

export interface AgendaClassNames {
  day?: string;
  event?: string;
  root?: string;
  title?: string;
}

export interface AgendaStyles {
  day?: CSSProperties;
  event?: CSSProperties;
  root?: CSSProperties;
  title?: CSSProperties;
}

export interface AgendaTexts {
  /** Time column of an event without `time`. */
  allDay?: string;
  /** A day without events. */
  empty?: string;
}

export type AgendaVariant = 'default' | 'a2ui';

export interface AgendaProps {
  className?: string;
  classNames?: AgendaClassNames;
  days: AgendaDay[];
  /** Locale of the weekday and month names; defaults to the `ConfigProvider` locale. */
  locale?: string;
  ref?: Ref<HTMLDivElement>;
  style?: CSSProperties;
  styles?: AgendaStyles;
  /** Overrides the built-in `agenda.*` texts. */
  texts?: AgendaTexts;
  /** Card heading. */
  title?: ReactNode;
  /**
   * `default`: a plain lobe-ui card (theme border and radius, body type, filled event rows).
   * `a2ui`: the A2UI playground agenda (14px card, compact type, events in hairline wells).
   * @default 'default'
   */
  variant?: AgendaVariant;
}
