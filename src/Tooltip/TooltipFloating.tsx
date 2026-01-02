'use client';

import type { FloatingContext, Placement } from '@floating-ui/react';
import { FloatingArrow } from '@floating-ui/react';
import { useDebounce } from 'ahooks';
import { cx } from 'antd-style';
import { AnimatePresence, type Target, type Transition } from 'motion/react';
import type { CSSProperties, ReactNode, RefObject } from 'react';
import { useMemo } from 'react';

import { Flexbox } from '@/Flex';
import Hotkey from '@/Hotkey';
import { useMotionComponent } from '@/MotionProvider';

import { styles } from './style';
import type { TooltipProps } from './type';

// Tooltip container animation
const tooltipAnimateState: Target = { opacity: 1, scale: 1, y: 0 };
const tooltipExitState: Target = { opacity: 0, scale: 0.98, y: 4 };
const tooltipInitialState: Target = { opacity: 0, scale: 0.96, y: 6 };
const tooltipTransition: Transition = { duration: 0.14, ease: [0.4, 0, 0.2, 1] };

// Tooltip content animation (for switching between tooltips)
const contentAnimateState: Target = { opacity: 1 };
const contentExitState: Target = { opacity: 0 };
const contentInitialState: Target = { opacity: 0 };
const contentTransition: Transition = { duration: 0.3 };

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
   * @description Whether this is the initial show (first appearance, not switching between tooltips)
   */
  isInitialShow?: boolean;

  /**
   * @description Whether to enable layout animation when switching between tooltips
   * @default true
   */
  layoutAnimation?: boolean;
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
  isInitialShow,
  layoutAnimation = true,

  className,
  classNames,
  styles: styleProps,
  zIndex,
}: TooltipFloatingProps) => {
  const basePlacement = String(placement || 'top').split('-')[0];

  const transformOrigin = useMemo(() => {
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
  }, [basePlacement]);

  const hasTransform = useDebounce(Boolean(floatingStyles?.transform), {
    leading: false,
    wait: 16,
  });

  const Motion = useMotionComponent();

  const TooltipContent = hotkey ? (
    <Flexbox align={'center'} gap={8} horizontal justify={'space-between'}>
      <span>{title}</span>
      <Hotkey inverseTheme keys={hotkey} {...hotkeyProps} />
    </Flexbox>
  ) : (
    title
  );
  return (
    <AnimatePresence>
      {open && title && (
        <div
          className={cx(
            styles.tooltip,
            layoutAnimation && hasTransform && styles.tooltipLayout,
            classNames?.container,
            classNames?.root,
            className,
          )}
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
              : {
                  ...floatingStyles,
                  zIndex,
                  ...styleProps?.container,
                }
          }
          {...floatingProps}
        >
          <Motion.div
            animate={tooltipAnimateState}
            exit={tooltipExitState}
            initial={tooltipInitialState}
            style={{ transformOrigin }}
            transition={tooltipTransition}
          >
            <div className={cx(styles.content, classNames?.content)} style={styleProps?.content}>
              {layoutAnimation ? (
                <AnimatePresence mode="popLayout">
                  <Motion.div
                    animate={contentAnimateState}
                    exit={contentExitState}
                    initial={isInitialShow ? false : contentInitialState}
                    key={String(title)}
                    transition={contentTransition}
                  >
                    {TooltipContent}
                  </Motion.div>
                </AnimatePresence>
              ) : (
                TooltipContent
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
          </Motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TooltipFloating;
