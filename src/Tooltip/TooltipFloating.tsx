'use client';

import type { FloatingContext, Placement } from '@floating-ui/react';
import { FloatingArrow } from '@floating-ui/react';
import type { CSSProperties, ReactNode, RefObject } from 'react';
import { useMemo } from 'react';
import { Flexbox } from 'react-layout-kit';

import Hotkey from '@/Hotkey';
import { AnimatePresence, LazyMotion, m } from '@/motion';

import { useStyles } from './style';
import type { TooltipProps } from './type';

type TooltipFloatingProps = {
  arrow?: boolean;
  arrowRef?: RefObject<SVGSVGElement | null>;

  className?: TooltipProps['className'];
  classNames?: TooltipProps['classNames'];
  context?: FloatingContext;

  floatingProps?: Record<string, any>;

  floatingStyles: CSSProperties;
  hotkey?: TooltipProps['hotkey'];
  hotkeyProps?: TooltipProps['hotkeyProps'];

  /**
   * Enable Framer Motion layout/position tweening when provided.
   * Useful for TooltipGroup where the floating position changes frequently.
   */
  layoutId?: string;

  open: boolean;
  placement?: Placement;

  setFloating: (node: HTMLElement | null) => void;
  styles?: TooltipProps['styles'];
  title?: ReactNode;
  zIndex?: TooltipProps['zIndex'];
};

const TooltipFloating = ({
  open,
  title,
  placement,
  floatingStyles,
  setFloating,
  floatingProps,
  arrow,
  arrowRef,
  context,
  hotkey,
  hotkeyProps,
  layoutId,
  className,
  classNames,
  styles: styleProps,
  zIndex,
}: TooltipFloatingProps) => {
  const { styles, cx } = useStyles();

  const transformOrigin = useMemo(() => {
    const basePlacement = String(placement || 'top').split('-')[0];
    switch (basePlacement) {
      case 'top': {
        return 'bottom center';
      }
      case 'bottom': {
        return 'top center';
      }
      case 'left': {
        return 'center right';
      }
      case 'right': {
        return 'center left';
      }
      default: {
        return 'center';
      }
    }
  }, [placement]);

  return (
    <LazyMotion>
      <AnimatePresence>
        {open && title && (
          <m.div
            animate={{ opacity: 1 }}
            className={cx(styles.tooltip, classNames?.container, classNames?.root, className)}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key="tooltip"
            ref={setFloating as any}
            role="tooltip"
            style={
              styleProps?.root
                ? {
                    ...floatingStyles,
                    zIndex,
                    ...styleProps.container,
                    ...styleProps.root,
                  }
                : { ...floatingStyles, zIndex, ...styleProps?.container }
            }
            transition={{ duration: 0.12, ease: [0.4, 0, 0.2, 1] }}
            {...floatingProps}
          >
            <m.div
              animate={{ scale: 1 }}
              exit={{ scale: 0.98 }}
              initial={{ scale: 0.96 }}
              layout={layoutId ? 'position' : undefined}
              layoutId={layoutId}
              style={{ transformOrigin }}
              transition={{ duration: 0.12, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className={cx(styles.content, classNames?.content)} style={styleProps?.content}>
                {hotkey ? (
                  <Flexbox align={'center'} gap={8} horizontal justify={'space-between'}>
                    <span>{title}</span>
                    <Hotkey inverseTheme keys={hotkey} {...hotkeyProps} />
                  </Flexbox>
                ) : (
                  title
                )}
              </div>
              {arrow && context && (
                <FloatingArrow
                  className={cx(styles.arrow, classNames?.arrow)}
                  context={context}
                  height={6}
                  ref={arrowRef as any}
                  style={styleProps?.arrow}
                  width={12}
                />
              )}
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
};

TooltipFloating.displayName = 'TooltipFloating';

export default TooltipFloating;
