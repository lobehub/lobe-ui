import type { ElementType, ReactNode } from 'react';

import type { DivProps } from '@/types';

export interface LogoMarqueeItem {
  /** An icon component such as `OpenAI` from `@lobehub/icons`, or a ready-made node. */
  icon: ElementType<{ size: number }> | ReactNode;
  label: string;
}

export interface LogoMarqueeProps extends DivProps {
  /** Caption below the track, e.g. a link to the icon catalog. */
  caption?: ReactNode;
  /**
   * Seconds for one full loop.
   * @default 28
   */
  duration?: number;
  /**
   * Gap between items in pixels.
   * @default 36
   */
  gap?: number;
  /**
   * Hides the text labels and shows icons only.
   * @default false
   */
  iconOnly?: boolean;
  /** @default 18 */
  iconSize?: number;
  items: LogoMarqueeItem[];
  /**
   * Max width of the visible track.
   * @default 640
   */
  maxWidth?: number | string;
}
