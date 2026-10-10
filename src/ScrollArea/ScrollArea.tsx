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

export const ScrollArea: FC<ScrollAreaProps> = ({
  children,
  contentProps,
  corner = false,
  cornerProps,
  disableContentFit = false,
  scrollFade = false,
  scrollbarProps,
  thumbProps,
  viewportProps,
  ...rest
}) => {
  const mergedContentProps = disableContentFit
    ? { ...contentProps, style: { minWidth: 0, ...contentProps?.style } }
    : contentProps;

  return (
    <ScrollAreaRoot {...rest}>
      <ScrollAreaViewport scrollFade={scrollFade} {...viewportProps}>
        <ScrollAreaContent {...mergedContentProps}>{children}</ScrollAreaContent>
      </ScrollAreaViewport>
      <ScrollAreaScrollbar {...scrollbarProps}>
        <ScrollAreaThumb {...thumbProps} />
      </ScrollAreaScrollbar>
      {corner && <ScrollAreaCorner {...cornerProps} />}
    </ScrollAreaRoot>
  );
};
