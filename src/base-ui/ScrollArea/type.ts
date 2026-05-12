import type { ReactNode } from 'react';

import type {
  ScrollAreaContentProps,
  ScrollAreaCornerProps,
  ScrollAreaFadeOrientation,
  ScrollAreaRootProps,
  ScrollAreaScrollbarProps,
  ScrollAreaThumbProps,
  ScrollAreaViewportProps,
} from './atoms';

export interface ScrollAreaProps extends Omit<ScrollAreaRootProps, 'children'> {
  children?: ReactNode;
  contentProps?: Omit<ScrollAreaContentProps, 'children'>;
  corner?: boolean;
  cornerProps?: ScrollAreaCornerProps;
  scrollbarProps?: Omit<ScrollAreaScrollbarProps, 'children'>;
  /**
   * Enable gradient scroll fade on the viewport edges.
   *
   * Accepts a boolean (true ≡ vertical) or an explicit orientation:
   * `'vertical' | 'horizontal' | 'both'`.
   *
   * @default false
   */
  scrollFade?: boolean | ScrollAreaFadeOrientation;
  thumbProps?: ScrollAreaThumbProps;
  viewportProps?: Omit<ScrollAreaViewportProps, 'children' | 'scrollFade'>;
}
