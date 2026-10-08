'use client';

import './global.css';

import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import clsx from 'clsx';
import type React from 'react';
import type { ReactElement } from 'react';

import { focusRing } from '@/styles/stylex/focusRing';
import { styleProps } from '@/styles/stylex/props';

import { styles } from './style';

const classNameOf = (styles: Parameters<typeof styleProps>[0]) => styleProps(styles).className;

const mergeStateClassName = <TState,>(
  base: string,
  className: string | ((state: TState) => string | undefined) | undefined,
) => {
  if (typeof className === 'function') return (state: TState) => clsx(base, className(state));
  return clsx(base, className);
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
    <BaseScrollArea.Root
      {...rest}
      className={mergeStateClassName(classNameOf(styles.root), className) as any}
    />
  );
};

ScrollAreaRoot.displayName = 'ScrollAreaRoot';

const resolveFadeClass = (
  scrollFade: ScrollAreaViewportProps['scrollFade'],
): string | undefined => {
  if (!scrollFade) return undefined;
  const orientation: ScrollAreaFadeOrientation = scrollFade === true ? 'vertical' : scrollFade;
  if (orientation === 'horizontal') return 'lobe-scroll-area-fade-horizontal';
  if (orientation === 'both') return 'lobe-scroll-area-fade-both';
  return 'lobe-scroll-area-fade';
};

export const ScrollAreaViewportImpl = ({
  className,
  scrollFade = false,
  xstyle,
  ...rest
}: ScrollAreaViewportProps & { xstyle?: Parameters<typeof styleProps>[0] }) => {
  return (
    <BaseScrollArea.Viewport
      {...rest}
      className={
        mergeStateClassName(
          clsx(
            classNameOf([styles.viewport, focusRing.info, xstyle]),
            resolveFadeClass(scrollFade),
          ),
          className,
        ) as any
      }
    />
  );
};

ScrollAreaViewportImpl.displayName = 'ScrollAreaViewport';

export const ScrollAreaViewport = ScrollAreaViewportImpl as (
  props: ScrollAreaViewportProps,
) => ReactElement;

export const ScrollAreaContent = BaseScrollArea.Content;

export const ScrollAreaScrollbar = ({ className, ...rest }: ScrollAreaScrollbarProps) => {
  return (
    <BaseScrollArea.Scrollbar
      {...rest}
      className={mergeStateClassName(classNameOf(styles.scrollbar), className) as any}
    />
  );
};

ScrollAreaScrollbar.displayName = 'ScrollAreaScrollbar';

export const ScrollAreaThumb = ({ className, ...rest }: ScrollAreaThumbProps) => {
  return (
    <BaseScrollArea.Thumb
      {...rest}
      className={mergeStateClassName(classNameOf(styles.thumb), className) as any}
    />
  );
};

ScrollAreaThumb.displayName = 'ScrollAreaThumb';

export const ScrollAreaCorner = ({ className, ...rest }: ScrollAreaCornerProps) => {
  return (
    <BaseScrollArea.Corner
      {...rest}
      className={mergeStateClassName(classNameOf(styles.corner), className) as any}
    />
  );
};

ScrollAreaCorner.displayName = 'ScrollAreaCorner';
