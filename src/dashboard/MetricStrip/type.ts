import type { ReactNode } from 'react';

import type { SurfaceRenderLink } from '../Surface/type';

export interface MetricItem {
  delta?: ReactNode;
  direction?: 'up' | 'down' | 'flat';
  hint?: ReactNode;
  href?: string;
  label: ReactNode;
  /** This cell only. Cells fed by different queries arrive at different times. */
  loading?: boolean;
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
}
