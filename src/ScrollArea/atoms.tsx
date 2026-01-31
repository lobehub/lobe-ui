'use client';

import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import { cx } from 'antd-style';
import type React from 'react';

import ScrollAreaGlobalStyle from './globalStyle';
import { styles } from './style';

const mergeStateClassName = <TState,>(
  base: string,
  className: string | ((state: TState) => string | undefined) | undefined,
) => {
  if (typeof className === 'function') return (state: TState) => cx(base, className(state));
  return cx(base, className);
};

export type ScrollAreaRootProps = React.ComponentProps<typeof BaseScrollArea.Root>;
export type ScrollAreaViewportProps = React.ComponentProps<typeof BaseScrollArea.Viewport> & {
  /**
   * Enable gradient scroll fade on the viewport edges.
   * @default false
   */
  scrollFade?: boolean;
};
export type ScrollAreaContentProps = React.ComponentProps<typeof BaseScrollArea.Content>;
export type ScrollAreaScrollbarProps = React.ComponentProps<typeof BaseScrollArea.Scrollbar>;
export type ScrollAreaThumbProps = React.ComponentProps<typeof BaseScrollArea.Thumb>;
export type ScrollAreaCornerProps = React.ComponentProps<typeof BaseScrollArea.Corner>;

export const ScrollAreaRoot = ({ className, ...rest }: ScrollAreaRootProps) => {
  return (
    <BaseScrollArea.Root {...rest} className={mergeStateClassName(styles.root, className) as any} />
  );
};

ScrollAreaRoot.displayName = 'ScrollAreaRoot';

export const ScrollAreaViewport = ({
  className,
  scrollFade = false,
  ...rest
}: ScrollAreaViewportProps) => {
  return (
    <>
      <ScrollAreaGlobalStyle />
      <BaseScrollArea.Viewport
        {...rest}
        className={
          mergeStateClassName(
            cx(styles.viewport, scrollFade && styles.viewportFade),
            className,
          ) as any
        }
      />
    </>
  );
};

ScrollAreaViewport.displayName = 'ScrollAreaViewport';

export const ScrollAreaContent = ({ className, ...rest }: ScrollAreaContentProps) => {
  return (
    <BaseScrollArea.Content
      {...rest}
      className={mergeStateClassName(styles.content, className) as any}
    />
  );
};

ScrollAreaContent.displayName = 'ScrollAreaContent';

export const ScrollAreaScrollbar = ({ className, ...rest }: ScrollAreaScrollbarProps) => {
  return (
    <BaseScrollArea.Scrollbar
      {...rest}
      className={mergeStateClassName(styles.scrollbar, className) as any}
    />
  );
};

ScrollAreaScrollbar.displayName = 'ScrollAreaScrollbar';

export const ScrollAreaThumb = ({ className, ...rest }: ScrollAreaThumbProps) => {
  return (
    <BaseScrollArea.Thumb
      {...rest}
      className={mergeStateClassName(styles.thumb, className) as any}
    />
  );
};

ScrollAreaThumb.displayName = 'ScrollAreaThumb';

export const ScrollAreaCorner = ({ className, ...rest }: ScrollAreaCornerProps) => {
  return (
    <BaseScrollArea.Corner
      {...rest}
      className={mergeStateClassName(styles.corner, className) as any}
    />
  );
};

ScrollAreaCorner.displayName = 'ScrollAreaCorner';
