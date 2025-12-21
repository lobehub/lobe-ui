'use client';

import { cva } from 'class-variance-authority';
import { memo, useMemo, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';

import { Flexbox } from '@/Flex';

import { useStyles } from './style';
import type { ScrollShadowProps } from './type';
import { useScrollOverflow } from './useScrollOverflow';

const ScrollShadow = memo<ScrollShadowProps>(
  ({
    className,
    children,
    orientation = 'vertical',
    hideScrollBar = false,
    size = 40,
    offset = 0,
    visibility = 'auto',
    isEnabled = true,
    onVisibilityChange,
    style,
    ref,
    ...rest
  }) => {
    const { cx, styles } = useStyles(size);
    const domRef = useRef<HTMLDivElement>(null);

    // 使用滚动检测钩子
    const scrollState = useScrollOverflow({
      domRef,
      isEnabled: isEnabled && visibility === 'auto',
      offset,
      onVisibilityChange,
      orientation,
      updateDeps: [children],
    });

    // 决定最终的滚动状态
    const finalScrollState = useMemo(() => {
      if (visibility === 'always') {
        return {
          bottom: true,
          left: true,
          right: true,
          top: true,
        };
      }

      if (visibility === 'never') {
        return {
          bottom: false,
          left: false,
          right: false,
          top: false,
        };
      }

      return scrollState;
    }, [visibility, scrollState]);

    // 计算数据属性
    const dataAttributes = useMemo(() => {
      const attributes: Record<string, boolean | string> = {
        'data-orientation': orientation,
      };

      if (orientation === 'vertical') {
        if (finalScrollState.top && finalScrollState.bottom) {
          attributes['data-top-bottom-scroll'] = true;
        } else if (finalScrollState.top) {
          attributes['data-top-scroll'] = true;
        } else if (finalScrollState.bottom) {
          attributes['data-bottom-scroll'] = true;
        }
      } else {
        if (finalScrollState.left && finalScrollState.right) {
          attributes['data-left-right-scroll'] = true;
        } else if (finalScrollState.left) {
          attributes['data-left-scroll'] = true;
        } else if (finalScrollState.right) {
          attributes['data-right-scroll'] = true;
        }
      }

      return attributes;
    }, [orientation, finalScrollState]);

    // 计算滚动位置变体
    const scrollPosition = useMemo(() => {
      if (orientation === 'vertical') {
        if (finalScrollState.top && finalScrollState.bottom) return 'top-bottom';
        if (finalScrollState.top) return 'top';
        if (finalScrollState.bottom) return 'bottom';
      } else {
        if (finalScrollState.left && finalScrollState.right) return 'left-right';
        if (finalScrollState.left) return 'left';
        if (finalScrollState.right) return 'right';
      }
      return 'none';
    }, [orientation, finalScrollState]);

    const variants = useMemo(
      () =>
        cva(styles.root, {
          defaultVariants: {
            hideScrollBar: false,
            orientation: 'vertical',
            scrollPosition: 'none',
          },
          /* eslint-disable sort-keys-fix/sort-keys-fix */
          variants: {
            orientation: {
              horizontal: styles.horizontal,
              vertical: styles.vertical,
            },
            hideScrollBar: {
              true: styles.hideScrollBar,
              false: null,
            },
            scrollPosition: {
              'none': null,
              'top': styles.topShadow,
              'bottom': styles.bottomShadow,
              'top-bottom': styles.topBottomShadow,
              'left': styles.leftShadow,
              'right': styles.rightShadow,
              'left-right': styles.leftRightShadow,
            },
          },
          /* eslint-enable sort-keys-fix/sort-keys-fix */
        }),
      [styles],
    );

    return (
      <Flexbox
        className={cx(variants({ hideScrollBar, orientation, scrollPosition }), className)}
        ref={mergeRefs<HTMLDivElement>([domRef, ref])}
        style={style}
        {...dataAttributes}
        {...rest}
      >
        {children}
      </Flexbox>
    );
  },
);

ScrollShadow.displayName = 'ScrollShadow';

export default ScrollShadow;
