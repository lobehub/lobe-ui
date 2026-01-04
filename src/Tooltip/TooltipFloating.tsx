'use client';

import type { ComponentRenderFn, HTMLProps } from '@base-ui/react/utils/types';
import type { Align, Side } from '@base-ui/react/utils/useAnchorPositioning';
import { cx } from 'antd-style';
import { type Target, type Transition } from 'motion/react';
import type { CSSProperties, ReactNode } from 'react';
import { useMemo } from 'react';

import { Flexbox } from '@/Flex';
import Hotkey from '@/Hotkey';
import { useMotionComponent } from '@/MotionProvider';

import { antdPlacementToFloating } from './antdPlacementToFloating';
import { BaseTooltip } from './baseTooltip';
import { styles } from './style';
import type { TooltipPlacement, TooltipProps } from './type';

// Tooltip container animation
const tooltipAnimateState: Target = { opacity: 1, scale: 1, y: 0 };
const tooltipExitState: Target = { opacity: 0, scale: 0.98, y: 4 };
const tooltipInitialState: Target = { opacity: 0, scale: 0.96, y: 6 };
const tooltipTransition: Transition = { duration: 0.14, ease: [0.4, 0, 0.2, 1] };

const resolvePlacement = (placement?: TooltipPlacement): { align: Align; side: Side } => {
  const resolved = antdPlacementToFloating(placement);
  const [side, align] = String(resolved).split('-');

  return {
    align: align === 'start' || align === 'end' ? align : 'center',
    side: side as Side,
  };
};

const resolveTransformOrigin = (side: Side) => {
  switch (side) {
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
};

type TooltipFloatingProps = {
  arrow?: boolean;

  className?: TooltipProps['className'];
  classNames?: TooltipProps['classNames'];

  hotkey?: TooltipProps['hotkey'];

  hotkeyProps?: TooltipProps['hotkeyProps'];
  /**
   * @description Whether to enable layout animation when switching between tooltips
   * @default false
   */
  layoutAnimation?: boolean;
  placement?: TooltipPlacement;

  styles?: TooltipProps['styles'];
  title?: ReactNode;
  zIndex?: TooltipProps['zIndex'];
};

const TooltipFloating = ({
  title,
  placement,
  arrow,
  hotkey,
  hotkeyProps,
  layoutAnimation = false,
  className,
  classNames,
  styles: styleProps,
  zIndex,
}: TooltipFloatingProps) => {
  const { align, side } = useMemo(() => resolvePlacement(placement), [placement]);
  const Motion = useMotionComponent();

  const popupClassName = cx(styles.tooltip, classNames?.container, classNames?.root, className);

  const popupStyle = useMemo<CSSProperties | undefined>(() => {
    if (!styleProps?.container && !styleProps?.root) return undefined;
    if (styleProps?.root) {
      return { ...styleProps.container, ...styleProps.root };
    }
    return { ...styleProps?.container };
  }, [styleProps?.container, styleProps?.root]);

  const TooltipContent = hotkey ? (
    <Flexbox align={'center'} gap={8} horizontal justify={'space-between'}>
      <span>{title}</span>
      <Hotkey inverseTheme keys={hotkey} {...hotkeyProps} />
    </Flexbox>
  ) : (
    title
  );

  const renderPopup: ComponentRenderFn<HTMLProps<HTMLDivElement>, BaseTooltip.Popup.State> = (
    popupProps,
    state,
  ) => {
    const transformOrigin = resolveTransformOrigin(state.side);
    const transition = state.instant ? { duration: 0 } : tooltipTransition;

    return (
      <Motion.div
        {...popupProps}
        animate={state.open ? tooltipAnimateState : tooltipExitState}
        initial={tooltipInitialState}
        style={{ ...popupProps.style, transformOrigin }}
        transition={transition}
      >
        <div className={cx(styles.content, classNames?.content)} style={styleProps?.content}>
          {layoutAnimation ? (
            <BaseTooltip.Viewport className={styles.viewport}>
              {TooltipContent}
            </BaseTooltip.Viewport>
          ) : (
            TooltipContent
          )}
        </div>
        {arrow && (
          <BaseTooltip.Arrow
            className={cx(styles.arrow, classNames?.arrow)}
            style={styleProps?.arrow}
          >
            <svg height={6} viewBox="0 0 12 6" width={12}>
              <path d="M0 6 L6 0 L12 6 Z" />
            </svg>
          </BaseTooltip.Arrow>
        )}
      </Motion.div>
    );
  };

  if (!title) return null;

  return (
    <BaseTooltip.Positioner
      align={align}
      className={cx(layoutAnimation && styles.positioner)}
      collisionPadding={8}
      side={side}
      sideOffset={8}
      style={zIndex !== undefined ? { zIndex } : undefined}
    >
      <BaseTooltip.Popup
        className={cx(popupClassName, layoutAnimation && styles.popup)}
        render={renderPopup}
        style={popupStyle}
      />
    </BaseTooltip.Positioner>
  );
};

export default TooltipFloating;
