import type { ReactNode } from 'react';

import type { DivProps } from '@/types';

export interface SpotlightCardProps<T = any> extends DivProps {
  borderRadius?: number;
  columns?: number;
  gap?: number | string;
  items: T[];
  maxItemWidth?: string | number;
  renderItem: (item: T) => ReactNode;
  size?: number;
  spotlight?: boolean;
}

export interface SpotlightCardItemProps extends DivProps {
  borderRadius: number;
  size: number;
}
