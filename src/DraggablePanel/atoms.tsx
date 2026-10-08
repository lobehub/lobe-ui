'use client';

import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import { ChevronLeft } from 'lucide-react';
import type { HTMLMotionProps, MotionStyle } from 'motion/react';
import { useTransform } from 'motion/react';
import {
  type CSSProperties,
  memo,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import useControlledState from 'use-merge-value';

import ActionIcon from '@/ActionIcon';
import { useMotionComponent } from '@/MotionProvider';
import { styleProps } from '@/styles/stylex/props';
import type { DivProps } from '@/types';

import { DraggablePanelContext, useDraggablePanelContext } from './context';
import type { Placement } from './core/axes';
import { AXES } from './core/axes';
import type { PanelControllerOptions } from './core/controller';
import { createPanelController } from './core/controller';
import { coarsePointer, handleSize as getHandleSize } from './core/env';
import { useIsomorphicLayoutEffect, useStore } from './core/internal';
import { timing } from './core/transition';
import { draggablePanelMarker, draggablePanelToggleMarker } from './marker.stylex';
import { SEAM_ARROW, styles } from './style';

const prefix = 'base-draggable-panel';

const floatStyles = {
  bottom: styles.bottomFloat,
  left: styles.leftFloat,
  right: styles.rightFloat,
  top: styles.topFloat,
};

const toggleStyles = {
  bottom: styles.toggleTop,
  left: styles.toggleRight,
  right: styles.toggleLeft,
  top: styles.toggleBottom,
};

const togglePlacementClass = {
  bottom: `${prefix}-toggle-top`,
  left: `${prefix}-toggle-right`,
  right: `${prefix}-toggle-left`,
  top: `${prefix}-toggle-bottom`,
};

const PAN_THRESHOLD = 3;

const ARROW_BOX = (SEAM_ARROW.half + SEAM_ARROW.lead) * 2;
const ARROW_C = ARROW_BOX / 2;

const ARROW_PATH = (() => {
  const { depth: d, half: h, lead } = SEAM_ARROW;
  const c = ARROW_C;
  const r = 0.12;
  return [
    `M${c} ${c - h - lead}`,
    `Q${c} ${c - h} ${c - d * r} ${c - h + h * r}`,
    `L${c - d * (1 - r)} ${c - h * r}`,
    `Q${c - d} ${c} ${c - d * (1 - r)} ${c + h * r}`,
    `L${c - d * r} ${c + h - h * r}`,
    `Q${c} ${c + h} ${c} ${c + h + lead}`,
  ].join(' ');
})();

// The path bends toward -x; the sign flips it so the seam points the way a click moves the panel.
const bendSign = (placement: Placement, expand: boolean) =>
  (placement === 'left' || placement === 'top' ? 1 : -1) * (expand ? 1 : -1);

const ORIGIN_MAP = {
  bottom: 'center bottom',
  left: 'left center',
  right: 'right center',
  top: 'center top',
} as const;

const COLLAPSED_SCALE = 0.97;

const EDGE_INSET = {
  bottom: 'insetBlockEnd',
  left: 'insetInlineStart',
  right: 'insetInlineEnd',
  top: 'insetBlockStart',
} as const;

export interface DraggablePanelRootProps extends Omit<DivProps, 'onDrag'> {
  backgroundColor?: string;
  collapseThreshold?: number;
  defaultExpand?: boolean;
  defaultSize?: number;
  expand?: boolean;
  expandable?: boolean;
  max?: number;
  min?: number;
  mode?: 'fixed' | 'float';
  onExpandChange?: (expand: boolean) => void;
  onSizeChange?: (size: number, delta: number) => void;
  onSizeDragging?: (size: number, delta: number) => void;
  placement?: Placement;
  showBorder?: boolean;
  size?: number;
}

export const DraggablePanelRoot = memo<DraggablePanelRootProps>(
  ({
    backgroundColor,
    children,
    className,
    collapseThreshold,
    defaultExpand = true,
    defaultSize,
    expand,
    expandable = true,
    max,
    min = 0,
    mode = 'fixed',
    onExpandChange,
    onSizeChange,
    onSizeDragging,
    placement = 'right',
    showBorder = true,
    size,
    style,
    ...rest
  }) => {
    const axis = AXES[placement];
    const fallbackSize = axis.vertical ? 180 : 280;
    const resolvedDefaultSize = defaultSize ?? fallbackSize;

    const [isExpand, setIsExpand] = useControlledState(defaultExpand, {
      onChange: onExpandChange,
      value: expand,
    });
    const [innerSize, setInnerSize] = useState(resolvedDefaultSize);
    const currentSize = size ?? innerSize;

    const commitSize = useCallback(
      (next: number, delta: number) => {
        if (size === undefined) setInnerSize(next);
        onSizeChange?.(next, delta);
      },
      [onSizeChange, size],
    );

    const options: PanelControllerOptions = {
      collapseThreshold,
      defaultSize: resolvedDefaultSize,
      expand: isExpand,
      max,
      min,
      onExpandChange: setIsExpand,
      onSizeChange: commitSize,
      onSizeDragging,
      placement,
      size: currentSize,
    };

    const [controller] = useState(() => createPanelController(options));
    const state = useStore(controller.subscribe, () => controller.state);
    const elementRef = useRef<HTMLElement>(null);

    useIsomorphicLayoutEffect(() => {
      controller.sync(options);
    });

    useIsomorphicLayoutEffect(() => {
      const node = elementRef.current;
      return node ? controller.attach(node) : undefined;
    }, [controller]);

    const toggleExpand = useCallback(() => {
      if (expandable) setIsExpand(!isExpand);
    }, [expandable, isExpand, setIsExpand]);

    const context = useMemo(
      () => ({
        axis,
        controller,
        expand: isExpand,
        expandable,
        placement,
        showBorder,
        state,
        toggleExpand,
      }),
      [axis, controller, isExpand, expandable, placement, showBorder, state, toggleExpand],
    );

    return (
      <DraggablePanelContext value={context}>
        <aside
          data-expand={isExpand}
          data-expandable={expandable}
          data-resizing={state.dragging}
          ref={elementRef}
          className={
            styleProps(
              [
                styles.root,
                mode === 'float' ? floatStyles[placement] : styles.fixed,
                draggablePanelMarker,
              ],
              clsx(prefix, className),
            ).className
          }
          style={
            {
              '--draggable-panel-bg': backgroundColor || '',
              'flexDirection': axis.vertical ? 'column' : 'row',
              ...style,
            } as CSSProperties
          }
          {...rest}
        >
          {children}
        </aside>
      </DraggablePanelContext>
    );
  },
);

DraggablePanelRoot.displayName = 'DraggablePanelRoot';

export interface DraggablePanelContentProps extends Omit<DivProps, 'onDrag'> {}

export const DraggablePanelContent = memo<DraggablePanelContentProps>(
  ({ children, className, style, ...rest }) => {
    const Motion = useMotionComponent();
    const { axis, controller, expand, placement, state } = useDraggablePanelContext();
    const extent = useTransform(controller.motion.size, (value) => Math.max(0, value));
    // Subscribed, not read: a collapse that changes only the target would otherwise
    // leave the content unclipped and painted outside the zero-width box.
    const target = useStore(controller.subscribe, () => controller.target);
    const clipping = state.dragging || state.folding || target === 0;
    const shrunk = state.collapsing || !expand;

    return (
      <Motion.div
        inert={!expand}
        style={
          {
            display: 'flex',
            flexDirection: axis.vertical ? 'column' : 'row',
            flexShrink: 0,
            justifyContent: axis.anchorEnd ? 'flex-end' : 'flex-start',
            overflow: clipping ? 'clip' : 'visible',
            [axis.cross]: '100%',
            [axis.extent]: extent,
          } as MotionStyle
        }
      >
        <Motion.div
          animate={{ scale: shrunk ? COLLAPSED_SCALE : 1 }}
          className={styleProps(styles.content, clsx(`${prefix}-content`, className)).className}
          transition={timing()}
          style={
            {
              transformOrigin: ORIGIN_MAP[placement],
              [axis.cross]: '100%',
              [axis.extent]: controller.motion.content,
              ...style,
            } as MotionStyle
          }
          {...(rest as HTMLMotionProps<'div'>)}
        >
          {children}
        </Motion.div>
      </Motion.div>
    );
  },
);

DraggablePanelContent.displayName = 'DraggablePanelContent';

export interface DraggablePanelHandleProps extends Omit<DivProps, 'onDrag'> {
  wideArea?: boolean;
}

export const DraggablePanelHandle = memo<DraggablePanelHandleProps>(
  ({ className, style, wideArea = true, ...rest }) => {
    const { axis, controller, expand, showBorder, state } = useDraggablePanelContext();
    const size = useStore(coarsePointer.subscribe, () => getHandleSize(wideArea));
    const target = useStore(controller.subscribe, () => controller.target);
    useEffect(() => () => controller.drag.cancel(), [controller]);

    const pressedRef = useRef<{ x: number; y: number } | null>(null);
    const draggingRef = useRef(false);
    const draggedRef = useRef(false);
    const { max, min } = controller.bounds();

    if (!expand) return null;

    return (
      <div
        aria-orientation={axis.ariaOrientation}
        aria-valuemax={Number.isFinite(max) ? max : undefined}
        aria-valuemin={min}
        aria-valuenow={target}
        aria-valuetext={`${target} pixels`}
        data-border={showBorder}
        data-resizing={state.dragging || undefined}
        role="separator"
        tabIndex={0}
        className={
          styleProps(
            [styles.handle, axis.vertical ? styles.handleHorizontal : styles.handleVertical],
            clsx(`${prefix}-handle`, className),
          ).className
        }
        style={
          {
            '--draggable-panel-handle-size': `${size}px`,
            [EDGE_INSET[axis.edge]]: -size / 2,
            ...style,
          } as CSSProperties
        }
        onKeyDown={(event) => controller.resizeByKey(event)}
        onDoubleClick={() => {
          if (!draggedRef.current) controller.reset();
        }}
        // Capture can be stolen mid-drag (another setPointerCapture, an OOPIF under the
        // cursor) and the pointerup then never reaches us; the pointer is wherever the
        // user last dragged it, so commit rather than snap back.
        onLostPointerCapture={() => {
          if (draggingRef.current) controller.drag.end();
          pressedRef.current = null;
          draggingRef.current = false;
        }}
        onPointerCancel={() => {
          controller.drag.cancel();
          pressedRef.current = null;
          draggingRef.current = false;
        }}
        onPointerDown={(event) => {
          draggedRef.current = false;
          pressedRef.current = { x: event.clientX, y: event.clientY };
          // A synthetic pointerdown carries no active pointer, and capturing throws.
          try {
            event.currentTarget.setPointerCapture(event.pointerId);
          } catch {
            /* empty */
          }
        }}
        onPointerMove={(event) => {
          if (!pressedRef.current) return;
          const offset = {
            x: event.clientX - pressedRef.current.x,
            y: event.clientY - pressedRef.current.y,
          };
          if (!draggingRef.current) {
            if (Math.hypot(offset.x, offset.y) < PAN_THRESHOLD) return;
            draggingRef.current = true;
            draggedRef.current = true;
            controller.drag.start();
          }
          controller.drag.move(offset);
        }}
        onPointerUp={() => {
          if (draggingRef.current) controller.drag.end();
          pressedRef.current = null;
          draggingRef.current = false;
        }}
        {...rest}
      />
    );
  },
);

DraggablePanelHandle.displayName = 'DraggablePanelHandle';

export interface DraggablePanelToggleProps extends Omit<DivProps, 'onDrag'> {
  showHandleWhenCollapsed?: boolean;
}

export const DraggablePanelToggle = memo<DraggablePanelToggleProps>(
  ({ className, showHandleWhenCollapsed, style, ...rest }) => {
    const { axis, expand, expandable, placement, showBorder, toggleExpand } =
      useDraggablePanelContext();
    const gradientId = `seam-arrow-${useId().replaceAll(/[^\w-]/g, '')}`;

    if (!expandable) return null;

    const bend = bendSign(placement, expand);
    const edgeOpacity = expand && showBorder ? 1 : 0;

    return (
      <div
        style={{ opacity: expand ? undefined : showHandleWhenCollapsed ? 1 : 0, ...style }}
        className={
          styleProps(
            [styles.toggleRoot, toggleStyles[placement]],
            clsx(`${prefix}-toggle`, togglePlacementClass[placement], className),
          ).className
        }
        {...rest}
      >
        <button
          aria-label={expand ? 'Collapse panel' : 'Expand panel'}
          type="button"
          onClick={toggleExpand}
          {...stylex.props(
            styles.toggleButton,
            axis.vertical && styles.toggleButtonHorizontal,
            draggablePanelToggleMarker,
          )}
        >
          <svg
            {...stylex.props(styles.toggleSvg)}
            fill="none"
            height={ARROW_BOX}
            style={{ '--seam-bend': bend } as CSSProperties}
            viewBox={`0 0 ${ARROW_BOX} ${ARROW_BOX}`}
            width={ARROW_BOX}
          >
            <defs>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                id={gradientId}
                x1={ARROW_C}
                x2={ARROW_C}
                y1={0}
                y2={ARROW_BOX}
              >
                <stop
                  data-end=""
                  offset={0}
                  stopOpacity={edgeOpacity}
                  {...stylex.props(styles.toggleStopEnd)}
                />
                <stop data-tip="" offset={0.3} {...stylex.props(styles.toggleStopTip)} />
                <stop data-tip="" offset={0.7} {...stylex.props(styles.toggleStopTip)} />
                <stop
                  data-end=""
                  offset={1}
                  stopOpacity={edgeOpacity}
                  {...stylex.props(styles.toggleStopEnd)}
                />
              </linearGradient>
            </defs>
            <g transform={axis.vertical ? `rotate(90 ${ARROW_C} ${ARROW_C})` : undefined}>
              <path
                {...stylex.props(styles.togglePath)}
                d={ARROW_PATH}
                stroke={`url(#${gradientId})`}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={SEAM_ARROW.stroke}
              />
            </g>
          </svg>
        </button>
      </div>
    );
  },
);

DraggablePanelToggle.displayName = 'DraggablePanelToggle';

export type DraggablePanelContainerProps = DivProps;

export const DraggablePanelContainer = memo<DraggablePanelContainerProps>(
  ({ className, ...rest }) => (
    <div className={styleProps(styles.container, className).className} {...rest} />
  ),
);

DraggablePanelContainer.displayName = 'DraggablePanelContainer';

export type DraggablePanelBodyProps = DivProps;

export const DraggablePanelBody = memo<DraggablePanelBodyProps>(({ className, style, ...rest }) => (
  <div {...styleProps(styles.body, className, { flex: 1, ...style })} {...rest} />
));

DraggablePanelBody.displayName = 'DraggablePanelBody';

export type DraggablePanelFooterProps = DivProps;

export const DraggablePanelFooter = memo<DraggablePanelFooterProps>(({ className, ...rest }) => (
  <div className={styleProps(styles.footer, className).className} {...rest} />
));

DraggablePanelFooter.displayName = 'DraggablePanelFooter';

export interface DraggablePanelHeaderProps extends Omit<DivProps, 'children' | 'title'> {
  extra?: ReactNode;
  onCollapse?: () => void;
  title?: ReactNode;
}

export const DraggablePanelHeader = memo<DraggablePanelHeaderProps>(
  ({ className, extra, onCollapse, title, ...rest }) => {
    const { toggleExpand } = useDraggablePanelContext();

    return (
      <div className={styleProps(styles.header, className).className} {...rest}>
        <ActionIcon icon={ChevronLeft} size={'small'} onClick={onCollapse ?? toggleExpand} />
        {title}
        {extra}
      </div>
    );
  },
);

DraggablePanelHeader.displayName = 'DraggablePanelHeader';
