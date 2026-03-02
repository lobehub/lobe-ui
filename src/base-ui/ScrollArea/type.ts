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
  scrollbarProps?: Omit<ScrollAreaScrollbarProps, 'children'>;
  scrollFade?: boolean;
  thumbProps?: ScrollAreaThumbProps;
  viewportProps?: Omit<ScrollAreaViewportProps, 'children' | 'scrollFade'>;
}
