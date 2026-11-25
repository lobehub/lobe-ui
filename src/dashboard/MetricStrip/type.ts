import type { ReactNode } from 'react';

import type { IconProps } from '@/Icon';

import type { SurfaceRenderLink } from '../Surface/type';

export interface MetricItem {
  /** Control on the label row, such as a menu. */
  action?: ReactNode;
  /** Full-width chart (sparkline, area) under the delta and hint. */
  chart?: ReactNode;
  delta?: ReactNode;
  direction?: 'up' | 'down' | 'flat';
  hint?: ReactNode;
  href?: string;
  label: ReactNode;
  /** This cell only. Cells fed by different queries arrive at different times. */
  loading?: boolean;
  /** Corner glyph. Hidden from assistive tech so it does not repeat the label. */
  mark?: IconProps['icon'];
  onClick?: () => void;
  value: ReactNode;
  /** Color the figure when the number itself is the thing to act on. */
  valueTone?: 'danger' | 'warning';
}

export type MetricStripSize = 'default' | 'small';

export interface MetricStripProps {
  className?: string;
  /**
   * Fixed number of columns. Unset, the strip fits as many 180px columns as the width allows.
   * Set it to choose the rows yourself, e.g. every figure on one row in a narrow container.
   */
  columns?: number;
  items: MetricItem[];
  /** First load only: values become placeholders, labels stay. */
  loading?: boolean;
  renderLink?: SurfaceRenderLink;
  /**
   * `small`: compact cells for narrow containers (chat cards, side panels): tighter padding, a
   * smaller figure, and a delta and hint that stay on one line, cut with an ellipsis.
   * @default 'default'
   */
  size?: MetricStripSize;
  /**
   * `joined`: one card divided into cells. `split`: every item is its own card (the StatCard look)
   * on a responsive grid with a gap.
   * @default 'joined'
   */
  variant?: 'joined' | 'split';
}
