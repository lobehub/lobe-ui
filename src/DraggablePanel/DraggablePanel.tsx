'use client';

import { useHover } from 'ahooks';
import { ConfigProvider } from 'antd';
import { cx } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';
import type { Enable, NumberSize, Size } from 're-resizable';
import { Resizable } from 're-resizable';
import {
  memo,
  startTransition,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import useControlledState from 'use-merge-value';

import { Center } from '@/Flex';
import Icon from '@/Icon';

import { handleVariants, panelVariants, styles, toggleVariants } from './style';
import type { DraggablePanelProps } from './type';
import { reversePlacement } from './utils';

const ARROW_MAP = {
  bottom: ChevronUp,
  left: ChevronRight,
  right: ChevronLeft,
  top: ChevronDown,
} as const;

const MARGIN_MAP = {
  bottom: { marginTop: 4 },
  left: { marginRight: 4 },
  right: { marginLeft: 4 },
  top: { marginBottom: 4 },
} as const;

const DISABLED_RESIZING: Enable = {
  bottom: false,
  bottomLeft: false,
  bottomRight: false,
  left: false,
  right: false,
  top: false,
  topLeft: false,
  topRight: false,
};

const toCssSize = (value: string | number | undefined, fallback: string) => {
  if (typeof value === 'number') return `${Math.max(value, 0)}px`;
  if (typeof value === 'string' && value.length > 0) return value;
  return fallback;
};

const DraggablePanel = memo<DraggablePanelProps>(
  ({
    headerHeight = 0,
    fullscreen,
    maxHeight,
    pin = true,
    mode = 'fixed',
    children,
    placement = 'right',
    resize,
    style,
    showBorder = true,
    showHandleHighlight = false,
    showHandleWideArea = true,
    backgroundColor,
    size,
    stableLayout = false,
    defaultSize: customizeDefaultSize,
    minWidth,
    minHeight,
    maxWidth,
    onSizeChange,
    onSizeDragging,
    expandable = true,
    expand,
    defaultExpand = true,
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
    const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const resizableRef = useRef<Resizable>(null);

    const { direction: antdDirection } = use(ConfigProvider.ConfigContext);
    const direction = dir ?? antdDirection;

    const internalPlacement = useMemo(() => {
      if (direction !== 'rtl') return placement;
      if (placement === 'left') return 'right';
      if (placement === 'right') return 'left';
      return placement;
    }, [direction, placement]);

    const cssVariables = {
      '--draggable-panel-bg': backgroundColor || '',
      '--draggable-panel-header-height': `${headerHeight}px`,
    } as Record<string, string>;

    const [isExpand, setIsExpand] = useControlledState(defaultExpand, {
      onChange: onExpandChange,
      value: expand,
    });

    const [isResizing, setIsResizing] = useState(false);
    const [showExpand, setShowExpand] = useState(true);

    useEffect(() => {
      if (pin) return;

      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }

      if (isHovering && !isExpand) {
        startTransition(() => setIsExpand(true));
      } else if (!isHovering && isExpand) {
        hoverTimeoutRef.current = setTimeout(() => {
          startTransition(() => setIsExpand(false));
        }, 150);
      }
    }, [pin, isHovering, isExpand, setIsExpand]);

    useEffect(() => {
      return () => {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
        }
      };
    }, []);

    const canResizing = resize !== false && isExpand;

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

    const defaultSize: Size = useMemo(() => {
      if (isVertical) return { height: 180, width: '100%', ...customizeDefaultSize };
      return { height: '100%', width: 280, ...customizeDefaultSize };
    }, [isVertical, customizeDefaultSize]);
    const normalizedMaxHeight = typeof maxHeight === 'number' ? Math.max(maxHeight, 0) : undefined;
    const normalizedMaxWidth = typeof maxWidth === 'number' ? Math.max(maxWidth, 0) : undefined;
    const normalizedMinHeight = typeof minHeight === 'number' ? Math.max(minHeight, 0) : undefined;
    const normalizedMinWidth = typeof minWidth === 'number' ? Math.max(minWidth, 0) : undefined;

    const sizeProps = useMemo(() => {
      if (!stableLayout && !isExpand) {
        return isVertical
          ? { minHeight: 0, size: { height: 0 } }
          : { minWidth: 0, size: { width: 0 } };
      }

      return {
        defaultSize,
        maxHeight: normalizedMaxHeight,
        maxWidth: normalizedMaxWidth,
        minHeight: normalizedMinHeight,
        minWidth: normalizedMinWidth,
        size: size as Size,
      };
    }, [
      stableLayout,
      isExpand,
      isVertical,
      defaultSize,
      normalizedMaxHeight,
      normalizedMaxWidth,
      normalizedMinHeight,
      normalizedMinWidth,
      size,
    ]);

    const fallbackExpandedSize = isVertical ? '180px' : '280px';
    const controlledExpandedSize = useMemo(() => {
      const controlledSize = isVertical ? size?.height : size?.width;
      if (controlledSize === undefined) return undefined;
      return toCssSize(controlledSize, fallbackExpandedSize);
    }, [isVertical, size?.height, size?.width, fallbackExpandedSize]);
    const defaultExpandedSize = useMemo(() => {
      const initialSize = isVertical ? defaultSize.height : defaultSize.width;
      return toCssSize(initialSize, fallbackExpandedSize);
    }, [isVertical, defaultSize.height, defaultSize.width, fallbackExpandedSize]);
    const [resizedExpandedSize, setResizedExpandedSize] = useState<{
      horizontal?: string;
      vertical?: string;
    }>({});
    const expandedOuterSize =
      controlledExpandedSize ??
      (isVertical ? resizedExpandedSize.vertical : resizedExpandedSize.horizontal) ??
      defaultExpandedSize;

    const toggleExpand = useCallback(() => {
      if (expandable) setIsExpand(!isExpand);
    }, [expandable, isExpand, setIsExpand]);

    const clampResizeSize = useCallback(
      (el: HTMLElement) => {
        const rect = el.getBoundingClientRect();
        const currentMainSize = isVertical ? rect.height : rect.width;
        const minMainSize = isVertical ? normalizedMinHeight : normalizedMinWidth;
        const maxMainSize = isVertical ? normalizedMaxHeight : normalizedMaxWidth;

        let clampedMainSize = currentMainSize;
        if (typeof minMainSize === 'number')
          clampedMainSize = Math.max(clampedMainSize, minMainSize);
        if (typeof maxMainSize === 'number')
          clampedMainSize = Math.min(clampedMainSize, maxMainSize);

        if (
          !Number.isFinite(clampedMainSize) ||
          Math.abs(clampedMainSize - currentMainSize) < 0.5
        ) {
          return { height: el.style.height, width: el.style.width };
        }

        const width = isVertical ? el.style.width || '100%' : `${clampedMainSize}px`;
        const height = isVertical ? `${clampedMainSize}px` : el.style.height || '100%';
        resizableRef.current?.updateSize({ height, width });

        return { height, width };
      },
      [
        isVertical,
        normalizedMaxHeight,
        normalizedMaxWidth,
        normalizedMinHeight,
        normalizedMinWidth,
      ],
    );

    const handleResize = useCallback(
      (_event: unknown, _direction: unknown, el: HTMLElement, delta: NumberSize) => {
        const nextSize = clampResizeSize(el);
        if (stableLayout) {
          const currentSize = isVertical ? nextSize.height : nextSize.width;
          if (currentSize) {
            setResizedExpandedSize((state) =>
              isVertical
                ? { ...state, vertical: currentSize }
                : { ...state, horizontal: currentSize },
            );
          }
        }
        onSizeDragging?.(delta, nextSize);
      },
      [clampResizeSize, stableLayout, isVertical, onSizeDragging],
    );

    const handleResizeStart = useCallback(() => {
      setIsResizing(true);
      setShowExpand(false);
    }, []);

    const handleResizeStop = useCallback(
      (_event: unknown, _direction: unknown, el: HTMLElement, delta: NumberSize) => {
        const nextSize = clampResizeSize(el);
        if (stableLayout) {
          const currentSize = isVertical ? nextSize.height : nextSize.width;
          if (currentSize) {
            setResizedExpandedSize((state) =>
              isVertical
                ? { ...state, vertical: currentSize }
                : { ...state, horizontal: currentSize },
            );
          }
        }
        setIsResizing(false);
        setShowExpand(true);
        onSizeChange?.(delta, nextSize);
      },
      [clampResizeSize, stableLayout, isVertical, onSizeChange],
    );

    if (fullscreen) {
      return (
        <div className={cx(styles.fullscreen, className)} style={cssVariables}>
          {children}
        </div>
      );
    }

    const Arrow = ARROW_MAP[internalPlacement] ?? ChevronLeft;
    const reversed = reversePlacement(internalPlacement);
    const sidebarOuterStyle = isVertical
      ? {
          height: isExpand ? expandedOuterSize : 0,
          overflow: 'hidden',
          transition: isResizing ? 'unset' : 'height 0.2s var(--ant-motion-ease-out, ease)',
          width: '100%',
        }
      : {
          overflow: 'hidden',
          transition: isResizing ? 'unset' : 'width 0.2s var(--ant-motion-ease-out, ease)',
          width: isExpand ? expandedOuterSize : 0,
        };
    const sidebarInnerStyle = isVertical ? { height: '100%', width: '100%' } : { width: '100%' };

    const panelNode = (!destroyOnClose || isExpand) && (
      <Resizable
        ref={resizableRef}
        {...sizeProps}
        className={cx(styles.panel, classNames?.content)}
        enable={canResizing ? (resizing as Enable) : DISABLED_RESIZING}
        handleClasses={
          canResizing
            ? {
                [reversed]: cx(
                  handleVariants({ placement: reversed }),
                  showHandleHighlight && styles.handleHighlight,
                ),
              }
            : {}
        }
        style={{
          ...cssVariables,
          transition: isResizing ? 'unset' : undefined,
          ...style,
        }}
        onResize={handleResize}
        onResizeStart={handleResizeStart}
        onResizeStop={handleResizeStop}
      >
        {stableLayout ? <div style={sidebarInnerStyle}>{children}</div> : children}
      </Resizable>
    );

    return (
      <aside
        dir={dir}
        ref={ref}
        style={cssVariables}
        className={cx(
          panelVariants({ isExpand, mode, placement: internalPlacement, showBorder }),
          className,
        )}
      >
        {expandable && showExpand && (
          <Center
            className={toggleVariants({ placement: internalPlacement, showHandleWideArea })}
            style={{
              opacity: isExpand ? (pin ? undefined : 0) : showHandleWhenCollapsed ? 1 : 0,
            }}
          >
            <Center
              className={classNames?.handle}
              style={customStyles?.handle}
              onClick={toggleExpand}
            >
              <Icon
                className={styles.handlerIcon}
                icon={Arrow}
                size={16}
                style={{
                  ...MARGIN_MAP[internalPlacement],
                  transform: `rotate(${isExpand ? 180 : 0}deg)`,
                  transition: 'transform 0.3s ease',
                }}
              />
            </Center>
          </Center>
        )}
        {stableLayout ? <div style={sidebarOuterStyle}>{panelNode}</div> : panelNode}
      </aside>
    );
  },
  isEqual,
);

DraggablePanel.displayName = 'DraggablePanel';

export default DraggablePanel;
