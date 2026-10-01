import type { Target } from 'ahooks/lib/useScroll';
import type { CSSProperties, MouseEventHandler } from 'react';

export interface BackBottomProps {
  className?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  style?: CSSProperties;
  target: Target;
  text?: string;
  visibilityHeight?: number;
}
