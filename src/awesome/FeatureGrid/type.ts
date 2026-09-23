import type { ReactNode } from 'react';

import type { LandingLinkRender } from '@/awesome/landingLink';
import type { IconProps } from '@/Icon';
import type { DivProps } from '@/types';

export interface FeatureGridItem {
  description: ReactNode;
  /** Makes the whole card a link. */
  href?: string;
  icon?: IconProps['icon'];
  title: ReactNode;
}

export interface FeatureGridProps extends DivProps {
  /**
   * Columns on wide screens. The grid collapses to one column on phones.
   * @default 3
   */
  columns?: number;
  items: FeatureGridItem[];
  renderLink?: LandingLinkRender;
}
