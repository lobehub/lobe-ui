'use client';

import { cx } from 'antd-style';
import { ChevronLeft } from 'lucide-react';
import type { HTMLMotionProps, MotionStyle } from 'motion/react';
import { motion, useTransform } from 'motion/react';
import {
  type CSSProperties,
  memo,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import useControlledState from 'use-merge-value';

import ActionIcon from '@/base-ui/ActionIcon';
import type { DivProps } from '@/types';

import { DraggablePanelContext, useDraggablePanelContext } from './context';
import type { Placement } from './core/axes';
import { AXES } from './core/axes';
import type { PanelControllerOptions } from './core/controller';
import { createPanelController } from './core/controller';
import { coarsePointer, handleSize as getHandleSize } from './core/env';
import { useIsomorphicLayoutEffect, useStore } from './core/internal';
import { timing } from './core/transition';
import { BOW, handleVariants, rootVariants, styles, toggleVariants } from './style';

const PAN_THRESHOLD = 3;

const BOW_CX = 15;
const BOW_CY = BOW.half + 8;
const BOW_W = BOW_CX * 2;
const BOW_H = BOW_CY * 2;

const bowPath = (direction: 1 | -1, verticalSeam: boolean) => {
  const k = BOW.half * BOW.curve;
  const b = BOW_CX + BOW.bulge * direction;
  const a0 = BOW_CY - BOW.half;
  const a1 = BOW_CY + BOW.half;
  // `a` runs along the seam, `b` across it; a horizontal seam swaps the two.
  const pt = (along: number, across: number) =>
    verticalSeam ? `${along} ${across}` : `${across} ${along}`;
  return [
    `M${pt(BOW_CX, a0)}`,
    `C${pt(BOW_CX, a0 + k)} ${pt(b, BOW_CY - k)} ${pt(b, BOW_CY)}`,
    `C${pt(b, BOW_CY + k)} ${pt(BOW_CX, a1 - k)} ${pt(BOW_CX, a1)}`,
  ].join(' ');
};

const BOW_PATHS = {
  horizontalSeam: [bowPath(-1, false), bowPath(1, false)],
  verticalSeam: [bowPath(-1, true), bowPath(1, true)],
};

/** The chevron points the way a click moves the panel. */
const CHEVRON_TURN = { bottom: 270, left: 0, right: 180, top: 90 } as const;

const chevronPath = (cx: number, cy: number) =>
  `M${cx + 2.4} ${cy - 4.8} L${cx - 2.4} ${cy} L${cx + 2.4} ${cy + 4.8}`;

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
          className={cx(rootVariants({ mode, placement }), className)}
          data-expand={isExpand}
          data-expandable={expandable}
          data-resizing={state.dragging}
          ref={elementRef}
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
    const { axis, controller, expand, placement, state } = useDraggablePanelContext();
    const extent = useTransform(controller.motion.size, (value) => Math.max(0, value));
    // Subscribed, not read: a collapse that changes only the target would otherwise
    // leave the content unclipped and painted outside the zero-width box.
    const target = useStore(controller.subscribe, () => controller.target);
    const clipping = state.dragging || state.folding || target === 0;
    const shrunk = state.collapsing || !expand;

    return (
      <motion.div
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
        <motion.div
          animate={{ scale: shrunk ? COLLAPSED_SCALE : 1 }}
          className={cx(styles.content, className)}
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
        </motion.div>
      </motion.div>
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
        className={cx(handleVariants({ edge: axis.edge }), className)}
        data-border={showBorder}
        data-resizing={state.dragging || undefined}
        role="separator"
        tabIndex={0}
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
        onLostPointerCapture={() => {
          if (draggingRef.current) controller.drag.cancel();
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
    const { axis, expand, expandable, placement, toggleExpand } = useDraggablePanelContext();

    if (!expandable) return null;

    const turn = CHEVRON_TURN[placement] + (expand ? 0 : 180);
    const chevX = axis.vertical ? BOW_CY : BOW_CX;
    const chevY = axis.vertical ? BOW_CX : BOW_CY;

    return (
      <div
        className={cx(toggleVariants({ placement }), className)}
        style={{ opacity: expand ? undefined : showHandleWhenCollapsed ? 1 : 0, ...style }}
        {...rest}
      >
        <button
          aria-label={expand ? 'Collapse panel' : 'Expand panel'}
          type="button"
          onClick={toggleExpand}
        >
          <svg
            fill="none"
            height={axis.vertical ? BOW_W : BOW_H}
            viewBox={`0 0 ${axis.vertical ? BOW_H : BOW_W} ${axis.vertical ? BOW_W : BOW_H}`}
            width={axis.vertical ? BOW_H : BOW_W}
          >
            {BOW_PATHS[axis.vertical ? 'horizontalSeam' : 'verticalSeam'].map((d) => (
              <path d={d} data-bow="" key={d} strokeLinecap="round" strokeWidth={BOW.stroke} />
            ))}
            <g
              style={{
                rotate: `${turn}deg`,
                transformOrigin: `${chevX}px ${chevY}px`,
                transition: 'rotate 0.25s var(--ant-motion-ease-out, ease)',
              }}
            >
              <path
                d={chevronPath(chevX, chevY)}
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.6}
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
  ({ className, ...rest }) => <div className={cx(styles.container, className)} {...rest} />,
);

DraggablePanelContainer.displayName = 'DraggablePanelContainer';

export type DraggablePanelBodyProps = DivProps;

export const DraggablePanelBody = memo<DraggablePanelBodyProps>(({ className, style, ...rest }) => (
  <div className={cx(styles.body, className)} style={{ flex: 1, ...style }} {...rest} />
));

DraggablePanelBody.displayName = 'DraggablePanelBody';

export type DraggablePanelFooterProps = DivProps;

export const DraggablePanelFooter = memo<DraggablePanelFooterProps>(({ className, ...rest }) => (
  <div className={cx(styles.footer, className)} {...rest} />
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
      <div className={cx(styles.header, className)} {...rest}>
        <ActionIcon icon={ChevronLeft} size={'small'} onClick={onCollapse ?? toggleExpand} />
        {title}
        {extra}
      </div>
    );
  },
);

DraggablePanelHeader.displayName = 'DraggablePanelHeader';
