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

export type ScrollAreaFadeOrientation = 'vertical' | 'horizontal' | 'both';

export type ScrollAreaViewportProps = React.ComponentProps<typeof BaseScrollArea.Viewport> & {
  /**
   * Enable gradient scroll fade on the viewport edges.
   *
   * - `true` / `'vertical'`: fade top and bottom edges.
   * - `'horizontal'`: fade start and end edges.
   * - `'both'`: fade all four edges (combined via `mask-composite: intersect`).
   * - `false`: no fade.
   *
   * @default false
   */
  scrollFade?: boolean | ScrollAreaFadeOrientation;
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

const resolveFadeClass = (
  scrollFade: ScrollAreaViewportProps['scrollFade'],
): string | undefined => {
  if (!scrollFade) return undefined;
  const orientation: ScrollAreaFadeOrientation = scrollFade === true ? 'vertical' : scrollFade;
  if (orientation === 'horizontal') return styles.viewportFadeHorizontal;
  if (orientation === 'both') return styles.viewportFadeBoth;
  return styles.viewportFade;
};

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
          mergeStateClassName(cx(styles.viewport, resolveFadeClass(scrollFade)), className) as any
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
