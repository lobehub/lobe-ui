'use client';

import { useHover } from 'ahooks';
import { ConfigProvider } from 'antd';
import { cx } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';
import type { Enable, NumberSize, Size } from 're-resizable';
import { Resizable } from 're-resizable';
import {
  type CSSProperties,
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
import { isBelowCollapseThreshold, reversePlacement } from './utils';

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
    collapseThreshold,
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
    const resetTransitionTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const resizableRef = useRef<Resizable>(null);
    const initialExpandedSizeRef = useRef<Size | undefined>(undefined);
    const resizeStartSizeRef = useRef<Size | undefined>(undefined);
    const outerRef = useRef<HTMLDivElement>(null);

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

    const [shouldTransition, setShouldTransition] = useState(true);
    const [showExpand, setShowExpand] = useState(true);
    const usesStableLayout = stableLayout || collapseThreshold !== undefined;

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
        if (resetTransitionTimeoutRef.current) {
          clearTimeout(resetTransitionTimeoutRef.current);
        }
      };
    }, []);

    useEffect(() => {
      initialExpandedSizeRef.current = undefined;
    }, [internalPlacement]);

    const reversed = reversePlacement(internalPlacement);
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
        [reversed]: true,
        ...(resize as Enable),
      }),
      [reversed, resize],
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
      if (!usesStableLayout && !isExpand) {
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
      usesStableLayout,
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

    const setExpandedMainSize = useCallback(
      (nextSize: Size) => {
        if (!usesStableLayout) return;

        const currentSize = isVertical ? nextSize.height : nextSize.width;
        if (!currentSize) return;

        const normalizedSize = toCssSize(currentSize, fallbackExpandedSize);
        setResizedExpandedSize((state) =>
          isVertical
            ? { ...state, vertical: normalizedSize }
            : { ...state, horizontal: normalizedSize },
        );
      },
      [fallbackExpandedSize, isVertical, usesStableLayout],
    );

    const readCurrentSize = useCallback((): Size | undefined => {
      const rect = resizableRef.current?.resizable?.getBoundingClientRect();
      if (!rect) return undefined;

      return isVertical
        ? { height: rect.height, width: '100%' }
        : { height: '100%', width: rect.width };
    }, [isVertical]);

    const captureInitialExpandedSize = useCallback(() => {
      if (initialExpandedSizeRef.current) return initialExpandedSizeRef.current;

      const nextInitialSize = readCurrentSize();
      if (!nextInitialSize) return undefined;

      initialExpandedSizeRef.current = nextInitialSize;
      return nextInitialSize;
    }, [readCurrentSize]);

    useEffect(() => {
      if (!isExpand) return;
      captureInitialExpandedSize();
    }, [captureInitialExpandedSize, isExpand]);

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
        const nextCollapsePreview = isBelowCollapseThreshold({
          axis: isVertical ? 'height' : 'width',
          collapseThreshold,
          size: nextSize,
        });

        if (usesStableLayout && outerRef.current) {
          // Sync outer DOM width immediately so it doesn't lag behind the
          // re-resizable inline style (which would otherwise trigger a 0.2s
          // width transition on the outer/aside each frame during drag).
          const dimension = isVertical ? nextSize.height : nextSize.width;
          if (dimension) {
            const previewDimension = nextCollapsePreview ? '0px' : dimension;
            if (isVertical) outerRef.current.style.height = previewDimension;
            else outerRef.current.style.width = previewDimension;
          }
        }
        // With drag-to-collapse enabled, defer the persisted expanded size until
        // pointer release. This keeps the pre-drag width as the single source of
        // truth while the outer stable-layout layer previews collapse/restore.
        if (collapseThreshold === undefined) setExpandedMainSize(nextSize);
        onSizeDragging?.(delta, nextSize);
      },
      [
        clampResizeSize,
        collapseThreshold,
        isVertical,
        onSizeDragging,
        setExpandedMainSize,
        usesStableLayout,
      ],
    );

    const triggerResetWithoutTransition = useCallback(() => {
      if (resetTransitionTimeoutRef.current) {
        clearTimeout(resetTransitionTimeoutRef.current);
      }

      setShouldTransition(false);
      resetTransitionTimeoutRef.current = setTimeout(() => {
        setShouldTransition(true);
      }, 0);
    }, []);

    const handleResetSize = useCallback(() => {
      if (!canResizing) return;

      const resetSize = captureInitialExpandedSize();
      if (!resetSize) return;

      triggerResetWithoutTransition();

      const rect = resizableRef.current?.resizable?.getBoundingClientRect();
      const prevMainSize = rect ? (isVertical ? rect.height : rect.width) : 0;
      const resetMainSize = isVertical ? resetSize.height : resetSize.width;
      const nextMainSize = typeof resetMainSize === 'number' ? resetMainSize : prevMainSize;

      resizableRef.current?.updateSize(resetSize);
      setExpandedMainSize(resetSize);

      onSizeChange?.(
        isVertical
          ? { height: nextMainSize - prevMainSize, width: 0 }
          : { height: 0, width: nextMainSize - prevMainSize },
        resetSize,
      );
    }, [
      canResizing,
      captureInitialExpandedSize,
      isVertical,
      onSizeChange,
      setExpandedMainSize,
      triggerResetWithoutTransition,
    ]);

    const handleResizeStart = useCallback(
      (event: { detail?: number }) => {
        if (event.detail === 2) {
          handleResetSize();
          return false;
        }

        if (resetTransitionTimeoutRef.current) {
          clearTimeout(resetTransitionTimeoutRef.current);
          resetTransitionTimeoutRef.current = undefined;
        }

        resizeStartSizeRef.current = readCurrentSize();

        // Synchronously disable the outer transition so the first drag frame
        // does not animate. `setShouldTransition(false)` below is asynchronous
        // and would only take effect after the next React commit.
        if (usesStableLayout && outerRef.current) {
          outerRef.current.style.transition = 'none';
        }
        setShouldTransition(false);
        setShowExpand(false);
      },
      [handleResetSize, readCurrentSize, usesStableLayout],
    );

    const handleResizeStop = useCallback(
      (_event: unknown, _direction: unknown, el: HTMLElement, delta: NumberSize) => {
        const nextSize = clampResizeSize(el);
        const shouldCollapse = isBelowCollapseThreshold({
          axis: isVertical ? 'height' : 'width',
          collapseThreshold,
          size: nextSize,
        });
        const committedSize = shouldCollapse ? (resizeStartSizeRef.current ?? nextSize) : nextSize;

        resizableRef.current?.updateSize(committedSize);
        if (!shouldCollapse) setExpandedMainSize(committedSize);
        setShouldTransition(true);
        setShowExpand(true);
        // Keep the collapsed main-axis size at zero until the controlled
        // `expand=false` value arrives. Clearing it here would reveal the panel
        // for one render between preview teardown and controlled-state commit.
        if (usesStableLayout && outerRef.current) {
          outerRef.current.style.removeProperty('transition');
          if (shouldCollapse) {
            if (isVertical) outerRef.current.style.height = '0px';
            else outerRef.current.style.width = '0px';
          } else {
            outerRef.current.style.removeProperty('width');
            outerRef.current.style.removeProperty('height');
          }
        }
        if (shouldCollapse) setIsExpand(false);

        resizeStartSizeRef.current = undefined;
        onSizeChange?.(delta, committedSize);
      },
      [
        clampResizeSize,
        collapseThreshold,
        isVertical,
        onSizeChange,
        setExpandedMainSize,
        setIsExpand,
        usesStableLayout,
      ],
    );

    const resizeHandleClassName = useMemo(
      () =>
        cx(handleVariants({ placement: reversed }), showHandleHighlight && styles.handleHighlight),
      [reversed, showHandleHighlight],
    );

    if (fullscreen) {
      return (
        <div className={cx(styles.fullscreen, className)} style={cssVariables}>
          {children}
        </div>
      );
    }

    const Arrow = ARROW_MAP[internalPlacement] ?? ChevronLeft;
    const stableOuterFlex = usesStableLayout
      ? ({
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        } as const)
      : {};

    const sidebarOuterStyle = isVertical
      ? {
          height: isExpand ? expandedOuterSize : 0,
          overflow: 'hidden',
          transition: shouldTransition ? 'height 0.2s var(--ant-motion-ease-out, ease)' : 'none',
          width: '100%',
          ...stableOuterFlex,
        }
      : {
          overflow: 'hidden',
          transition: shouldTransition ? 'width 0.2s var(--ant-motion-ease-out, ease)' : 'none',
          width: isExpand ? expandedOuterSize : 0,
          ...(usesStableLayout
            ? {
                ...stableOuterFlex,
                flex: 1,
                minWidth: 0,
                height: '100%',
              }
            : {}),
        };

    const stableInnerStyle: CSSProperties = {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      height: '100%',
      minHeight: 0,
      minWidth: 0,
      width: '100%',
    };
    const sidebarInnerStyle: CSSProperties = usesStableLayout
      ? stableInnerStyle
      : isVertical
        ? { height: '100%', width: '100%' }
        : { width: '100%' };

    const stableAsideStyle: CSSProperties = usesStableLayout
      ? {
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          ...(mode === 'fixed' ? { height: '100%' } : {}),
        }
      : {};

    const stableResizableStyle: CSSProperties = {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      height: '100%',
      minHeight: 0,
      minWidth: 0,
      width: '100%',
    };

    const panelNode = (!destroyOnClose || isExpand) && (
      <Resizable
        ref={resizableRef}
        {...sizeProps}
        className={cx(styles.panel, classNames?.content)}
        enable={canResizing ? (resizing as Enable) : DISABLED_RESIZING}
        handleClasses={
          canResizing
            ? {
                [reversed]: resizeHandleClassName,
              }
            : {}
        }
        style={{
          ...cssVariables,
          transition: shouldTransition ? undefined : 'none',
          ...(usesStableLayout ? stableResizableStyle : {}),
          ...style,
        }}
        onResize={handleResize}
        onResizeStart={handleResizeStart}
        onResizeStop={handleResizeStop}
      >
        {usesStableLayout ? <div style={sidebarInnerStyle}>{children}</div> : children}
      </Resizable>
    );

    return (
      <aside
        dir={dir}
        ref={ref}
        style={{ ...cssVariables, ...stableAsideStyle }}
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
        {usesStableLayout ? (
          <div ref={outerRef} style={sidebarOuterStyle}>
            {panelNode}
          </div>
        ) : (
          panelNode
        )}
      </aside>
    );
  },
  isEqual,
);

DraggablePanel.displayName = 'DraggablePanel';

export default DraggablePanel;
