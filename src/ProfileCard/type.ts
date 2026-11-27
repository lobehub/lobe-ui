import type { CSSProperties, HTMLAttributes, Ref } from 'react';

export interface ProfileStat {
  label: string;
  value: string | number;
}

export interface ProfileCardClassNames {
  banner?: string;
  body?: string;
  contacts?: string;
  root?: string;
  stats?: string;
}

export interface ProfileCardStyles {
  banner?: CSSProperties;
  body?: CSSProperties;
  contacts?: CSSProperties;
  root?: CSSProperties;
  stats?: CSSProperties;
}

export interface ProfileCardTexts {
  /** Joins the role and the company. @default 'at' */
  at?: string;
}

export type ProfileCardVariant = 'default' | 'a2ui';

export interface ProfileCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Avatar image URL; the initials of `name` show while it loads or when it fails. */
  avatar?: string;
  bio?: string;
  classNames?: ProfileCardClassNames;
  company?: string;
  /** Shown as a `mailto:` link. */
  email?: string;
  location?: string;
  name: string;
  /** Shown as a `tel:` link. */
  phone?: string;
  ref?: Ref<HTMLDivElement>;
  role?: string;
  /** Up to four figures in a row, e.g. `{ label: 'Projects', value: '24' }`. */
  stats?: ProfileStat[];
  styles?: ProfileCardStyles;
  tags?: string[];
  /** Overrides the built-in `profileCard.*` texts. */
  texts?: ProfileCardTexts;
  /**
   * `default`: a plain lobe-ui card (theme border and radius, body type, `Tag` chips).
   * `a2ui`: the A2UI playground profile card (14px card, gradient banner, hairline chips and stats).
   * @default 'default'
   */
  variant?: ProfileCardVariant;
  /** Shown without the protocol; opens in a new tab. */
  website?: string;
}
