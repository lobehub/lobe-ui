import type { ReactNode } from 'react';

import type { LandingLinkRender } from '@/awesome/landingLink';
import type { DivProps } from '@/types';

export interface BentoGridProps extends DivProps {
  children?: ReactNode;
  /**
   * Columns on wide screens. The grid drops to two columns on tablets and one on phones.
   * @default 4
   */
  columns?: number;
  /**
   * Minimum row height in pixels.
   * @default 120
   */
  rowHeight?: number;
}

export interface BentoCardProps extends Omit<DivProps, 'title'> {
  /** The live content of the tile. Render real components, not screenshots. */
  children?: ReactNode;
  /**
   * Columns the tile spans on wide screens.
   * @default 1
   */
  colSpan?: 1 | 2 | 3 | 4;
  /** Short muted note on the right side of the header. */
  hint?: ReactNode;
  /** Makes the title a link, e.g. to the component page. */
  href?: string;
  renderLink?: LandingLinkRender;
  /**
   * Rows the tile spans on wide screens.
   * @default 1
   */
  rowSpan?: 1 | 2 | 3;
  title?: ReactNode;
}
