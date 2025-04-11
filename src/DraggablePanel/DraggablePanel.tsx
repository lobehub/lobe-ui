'use client';

import { useHover } from 'ahooks';
import { ConfigProvider } from 'antd';
import { cva } from 'class-variance-authority';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';
import type { Enable, NumberSize, Size } from 're-resizable';
import { Resizable } from 're-resizable';
import { memo, use, useEffect, useMemo, useRef, useState } from 'react';
import { Center } from 'react-layout-kit';
import useControlledState from 'use-merge-value';

import Icon from '@/Icon';

import { useStyles } from './style';
import type { DraggablePanelProps } from './type';
import { reversePlacement } from './utils';

// Constants
const DEFAULT_HEIGHT = 180;
const DEFAULT_WIDTH = 280;
const DEFAULT_HEADER_HEIGHT = 0;
const DEFAULT_PIN = true;
const DEFAULT_MODE = 'fixed';
const DEFAULT_EXPANDABLE = true;
const DEFAULT_EXPAND = true;
const DEFAULT_SHOW_HANDLE_WIDE_AREA = true;

const DraggablePanel = memo<DraggablePanelProps>(
  ({
    headerHeight = DEFAULT_HEADER_HEIGHT,
    fullscreen,
    maxHeight,
    pin = DEFAULT_PIN,
    mode = DEFAULT_MODE,
    children,
    placement = 'right',
    resize,
    style,
    showHandleWideArea = DEFAULT_SHOW_HANDLE_WIDE_AREA,
    size,
    defaultSize: customizeDefaultSize,
    minWidth,
    minHeight,
    maxWidth,
    onSizeChange,
    onSizeDragging,
    expandable = DEFAULT_EXPANDABLE,
    expand,
    defaultExpand = DEFAULT_EXPAND,
    onExpandChange,
    className,
    showHandleWhenCollapsed,
    destroyOnClose,
    styles: customStyles,
    classNames,
    dir,
  }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isHovering = useHover(ref);
    const isVertical = placement === 'top' || placement === 'bottom';

    // inherit direction from Ant Design ConfigProvider
    const { direction: antdDirection } = use(ConfigProvider.ConfigContext);
    const direction = dir ?? antdDirection;

    // Handle RTL direction
    const internalPlacement = useMemo(() => {
      return direction === 'rtl' && ['left', 'right'].includes(placement)
        ? placement === 'left'
          ? 'right'
          : 'left'
        : placement;
    }, [direction, placement]);

    const { styles, cx } = useStyles({ headerHeight, showHandleWideArea });

    const [isExpand, setIsExpand] = useControlledState(defaultExpand, {
      onChange: onExpandChange,
      value: expand,
    });

    // Auto-expand on hover if not pinned
    useEffect(() => {
      if (pin) return;

      if (isHovering && !isExpand) {
        setIsExpand(true);
      } else if (!isHovering && isExpand) {
        setIsExpand(false);
      }
    }, [pin, isHovering, isExpand, setIsExpand]);

    const [showExpand, setShowExpand] = useState(true);
    const [isResizing, setIsResizing] = useState(false);
    const canResizing = resize !== false && isExpand;

    // Style variants for the panel
    const variants = useMemo(
      () =>
        cva(styles.root, {
          compoundVariants: [
            {
              class: styles.bottomFloat,
              mode: 'float',
              placement: 'bottom',
            },
            {
              class: styles.topFloat,
              mode: 'float',
              placement: 'top',
            },
            {
              class: styles.leftFloat,
              mode: 'float',
              placement: 'left',
            },
            {
              class: styles.rightFloat,
              mode: 'float',
              placement: 'right',
            },
          ],
          /* eslint-disable sort-keys-fix/sort-keys-fix */
          variants: {
            placement: {
              top: styles.borderBottom,
              right: styles.borderLeft,
              bottom: styles.borderTop,
              left: styles.borderRight,
            },
            mode: {
              fixed: styles.fixed,
              float: null,
            },
          },
          /* eslint-enable sort-keys-fix/sort-keys-fix */
        }),
      [styles],
    );

    // Style variants for the handle
    const handleVariants = useMemo(
      () =>
        cva(styles.handleRoot, {
          variants: {
            placement: {
              bottom: styles.handleBottom,
              left: styles.handleLeft,
              right: styles.handleRight,
              top: styles.handleTop,
            },
          },
        }),
      [styles],
    );

    // Style variants for the toggle button
    const toggleVariants = useMemo(
      () =>
        cva(styles.toggleRoot, {
          variants: {
            placement: {
              bottom: styles.toggleTop,
              left: styles.toggleRight,
              right: styles.toggleLeft,
              top: styles.toggleBottom,
            },
          },
        }),
      [styles],
    );

    // Configure resizing handles
    const resizing = useMemo(
      () => ({
        bottom: false,
        bottomLeft: false,
        bottomRight: false,
        left: false,
        right: false,
        top: false,
        topLeft: false,
        topRight: false,
        [reversePlacement(internalPlacement)]: true,
        ...(resize as Enable),
      }),
      [internalPlacement, resize],
    );

    // Calculate default size based on orientation
    const defaultSize: Size = useMemo(() => {
      if (isVertical)
        return {
          height: DEFAULT_HEIGHT,
          width: '100%',
          ...customizeDefaultSize,
        };

      return {
        height: '100%',
        width: DEFAULT_WIDTH,
        ...customizeDefaultSize,
      };
    }, [isVertical, customizeDefaultSize]);

    // Determine appropriate size props based on expand state
    const sizeProps = useMemo(() => {
      if (!isExpand) {
        return isVertical
          ? { minHeight: 0, size: { height: 0 } }
          : { minWidth: 0, size: { width: 0 } };
      }

      return {
        defaultSize,
        maxHeight: typeof maxHeight === 'number' ? Math.max(maxHeight, 0) : maxHeight,
        maxWidth: typeof maxWidth === 'number' ? Math.max(maxWidth, 0) : maxWidth,
        minHeight: typeof minHeight === 'number' ? Math.max(minHeight, 0) : minHeight,
        minWidth: typeof minWidth === 'number' ? Math.max(minWidth, 0) : minWidth,
        size: size as Size,
      };
    }, [isExpand, isVertical, defaultSize, maxHeight, maxWidth, minHeight, minWidth, size]);

    // Determine the appropriate arrow icon based on placement
    const Arrow = useMemo(() => {
      switch (internalPlacement) {
        case 'top': {
          return ChevronDown;
        }
        case 'bottom': {
          return ChevronUp;
        }
        case 'right': {
          return ChevronLeft;
        }
        case 'left': {
          return ChevronRight;
        }
        default: {
          return ChevronLeft;
        }
      }
    }, [internalPlacement]);

    // Toggle handle component
    const handle = (
      <Center
        className={toggleVariants({ placement: internalPlacement })}
        style={{ opacity: isExpand ? (pin ? undefined : 0) : showHandleWhenCollapsed ? 1 : 0 }}
      >
        <Center
          className={classNames?.handle}
          onClick={() => setIsExpand(!isExpand)}
          style={customStyles?.handle}
        >
          <Icon
            className={styles.handlerIcon}
            icon={Arrow}
            size={16}
            style={{ transform: `rotate(${isExpand ? 180 : 0}deg)` }}
          />
        </Center>
      </Center>
    );

    // Handle resize events
    const handleResize = (
      _: unknown,
      _direction: unknown,
      reference_: HTMLElement,
      delta: NumberSize,
    ) => {
      onSizeDragging?.(delta, {
        height: reference_.style.height,
        width: reference_.style.width,
      });
    };

    const handleResizeStart = () => {
      setIsResizing(true);
      setShowExpand(false);
    };

    const handleResizeStop = (
      e: unknown,
      direction: unknown,
      reference_: HTMLElement,
      delta: NumberSize,
    ) => {
      setIsResizing(false);
      setShowExpand(true);
      onSizeChange?.(delta, {
        height: reference_.style.height,
        width: reference_.style.width,
      });
    };

    // Main panel content
    const inner = (
      <Resizable
        {...sizeProps}
        className={cx(styles.panel, classNames?.content)}
        enable={canResizing ? (resizing as Enable) : undefined}
        handleClasses={
          canResizing
            ? {
                [reversePlacement(internalPlacement)]: handleVariants({
                  placement: reversePlacement(internalPlacement),
                }),
              }
            : {}
        }
        onResize={handleResize}
        onResizeStart={handleResizeStart}
        onResizeStop={handleResizeStop}
        style={{
          transition: isResizing ? 'unset' : undefined,
          ...style,
        }}
      >
        {children}
      </Resizable>
    );

    // For fullscreen mode, return a simpler layout
    if (fullscreen) {
      return <div className={cx(styles.fullscreen, className)}>{children}</div>;
    }

    return (
      <aside
        className={cx(variants({ mode, placement: internalPlacement }), className)}
        dir={dir}
        ref={ref}
      >
        {expandable && showExpand && handle}
        {destroyOnClose ? isExpand && inner : inner}
      </aside>
    );
  },
);

DraggablePanel.displayName = 'DraggablePanel';

export default DraggablePanel;
