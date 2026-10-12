import type { CSSProperties, MouseEventHandler } from 'react';

import type { ScrollTarget } from '@/hooks/useScroll';

export interface BackBottomProps {
  className?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  style?: CSSProperties;
  target: ScrollTarget;
  text?: string;
  visibilityHeight?: number;
}
