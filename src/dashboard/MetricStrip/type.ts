import type { ReactNode } from 'react';

import type { IconProps } from '@/Icon';

import type { SurfaceRenderLink } from '../Surface/type';

export interface MetricItem {
  /** Control on the label row, such as a menu. */
  action?: ReactNode;
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

export interface MetricStripProps {
  items: MetricItem[];
  /** First load only: values become placeholders, labels stay. */
  loading?: boolean;
  renderLink?: SurfaceRenderLink;
  /**
   * `joined`: one card divided into cells. `split`: every item is its own card (the StatCard look)
   * on a responsive grid with a gap.
   * @default 'joined'
   */
  variant?: 'joined' | 'split';
}
