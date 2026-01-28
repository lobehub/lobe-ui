import type { ReactNode } from 'react';

import type {
  ScrollAreaContentProps,
  ScrollAreaCornerProps,
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
  scrollFade?: boolean;
  scrollbarProps?: Omit<ScrollAreaScrollbarProps, 'children'>;
  thumbProps?: ScrollAreaThumbProps;
  viewportProps?: Omit<ScrollAreaViewportProps, 'children' | 'scrollFade'>;
}
