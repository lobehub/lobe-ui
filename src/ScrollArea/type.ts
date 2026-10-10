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
  /**
   * Override Base UI's default `min-width: fit-content` on the content node by
   * setting `min-width: 0`. Use this when an unbreakable wide child (e.g. a
   * `<pre>` code block) would otherwise propagate its intrinsic width up the
   * ancestor chain and stretch the scroll container past its parent.
   *
   * @default false
   */
  disableContentFit?: boolean;
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
