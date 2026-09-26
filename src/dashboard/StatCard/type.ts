import type { ReactNode } from 'react';

import type { IconProps } from '@/Icon';

export type StatDirection = 'up' | 'down' | 'flat';

/** Top-to-bottom gray wash. Decorative color fields stay in the app. */
export type StatWash = 'gray';

export interface StatCardProps {
  /** Control rendered on the label row, such as a menu. */
  action?: ReactNode;
  /** Change amount, colored by `direction`. */
  delta?: string;
  direction?: StatDirection;
  /** Line under the figure. */
  hint?: string;
  label: ReactNode;
  /** Corner glyph. Hidden from assistive tech so it does not repeat the label. */
  mark?: IconProps['icon'];
  /** Overview scale: label, then a large figure, then the note. */
  prominent?: boolean;
  value: ReactNode;
  wash?: StatWash;
}
