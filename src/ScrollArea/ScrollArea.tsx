'use client';

import { type FC } from 'react';

import {
  ScrollAreaContent,
  ScrollAreaCorner,
  ScrollAreaRoot,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
  ScrollAreaViewport,
} from './atoms';
import type { ScrollAreaProps } from './type';

const ScrollArea: FC<ScrollAreaProps> = ({
  children,
  contentProps,
  corner = false,
  cornerProps,
  scrollFade = false,
  scrollbarProps,
  thumbProps,
  viewportProps,
  ...rest
}) => {
  return (
    <ScrollAreaRoot {...rest}>
      <ScrollAreaViewport scrollFade={scrollFade} {...viewportProps}>
        <ScrollAreaContent {...contentProps}>{children}</ScrollAreaContent>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar {...scrollbarProps}>
        <ScrollAreaThumb {...thumbProps} />
      </ScrollAreaScrollbar>
      {corner && <ScrollAreaCorner {...cornerProps} />}
    </ScrollAreaRoot>
  );
};

ScrollArea.displayName = 'ScrollArea';

export default ScrollArea;
