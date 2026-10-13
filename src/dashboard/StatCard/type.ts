import type { ReactNode } from 'react';

import type { IconProps } from '@/Icon';

import type { SurfaceRenderLink } from '../Surface/type';

export type StatDirection = 'up' | 'down' | 'flat';

/** @deprecated StatCard renders as a MetricStrip item and no longer draws a wash. */
export type StatWash = 'gray';

export interface StatCardProps {
  /** Control rendered on the label row, such as a menu. */
  action?: ReactNode;
  className?: string;
  /** Change amount, colored by `direction`. */
  delta?: ReactNode;
  direction?: StatDirection;
  /** Line after the delta. */
  hint?: ReactNode;
  /** Makes the card a link (through `renderLink` / `SurfaceLinkProvider`). */
  href?: string;
  label: ReactNode;
  /** Value placeholder while loading; the label stays. */
  loading?: boolean;
  /** Corner glyph. Hidden from assistive tech so it does not repeat the label. */
  mark?: IconProps['icon'];
  onClick?: () => void;
  /** @deprecated Ignored. StatCard always uses the MetricStrip item scale. */
  prominent?: boolean;
  renderLink?: SurfaceRenderLink;
  value: ReactNode;
  /** Color the figure when the number itself is the thing to act on. */
  valueTone?: 'danger' | 'warning';
  /** @deprecated Ignored. StatCard renders as a MetricStrip item without a wash. */
  wash?: StatWash;
}
