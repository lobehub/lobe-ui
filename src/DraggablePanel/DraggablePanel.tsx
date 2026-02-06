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
  use,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useTransition,
} from 'react';
import useControlledState from 'use-merge-value';

import { Center } from '@/Flex';
import Icon from '@/Icon';

import { handleVariants, panelVariants, styles, toggleVariants } from './style';
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

// State reducer for better state management
interface DraggablePanelState {
  isResizing: boolean;
  showExpand: boolean;
}

type DraggablePanelAction =
  | { type: 'START_RESIZE' }
  | { type: 'STOP_RESIZE' }
  | { payload: boolean; type: 'SET_SHOW_EXPAND' };

function draggablePanelReducer(
  state: DraggablePanelState,
  action: DraggablePanelAction,
): DraggablePanelState {
  switch (action.type) {
    case 'START_RESIZE': {
      return { ...state, isResizing: true, showExpand: false };
    }
    case 'STOP_RESIZE': {
      return { ...state, isResizing: false, showExpand: true };
    }
    case 'SET_SHOW_EXPAND': {
      return { ...state, showExpand: action.payload };
    }
    default: {
      return state;
    }
  }
}

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
    showBorder = true,
    showHandleHighlight = false,
    showHandleWideArea = DEFAULT_SHOW_HANDLE_WIDE_AREA,
    backgroundColor,
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
    const [isPending, startTransition] = useTransition();

    // Use ref for hover timeout to avoid memory leaks
    const hoverTimeoutRef = useRef<any>(undefined);

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

    const cssVariables = useMemo<Record<string, string>>(
      () => ({
        '--draggable-panel-bg': backgroundColor || '',
        '--draggable-panel-header-height': `${headerHeight}px`,
      }),
      [backgroundColor, headerHeight],
    );

    const [isExpand, setIsExpand] = useControlledState(defaultExpand, {
      onChange: onExpandChange,
      value: expand,
    });

    // Initialize state with useReducer for better performance
    const initialState: DraggablePanelState = {
      isResizing: false,
      showExpand: true,
    };

    const [state, dispatch] = useReducer(draggablePanelReducer, initialState);

    // Auto-expand on hover if not pinned with optimized transition
    useEffect(() => {
      if (pin) return;

      // Clear previous timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }

      if (isHovering && !isExpand) {
        startTransition(() => {
          setIsExpand(true);
        });
      } else if (!isHovering && isExpand) {
        // Add a small delay before collapsing to prevent flickering
        hoverTimeoutRef.current = setTimeout(() => {
          startTransition(() => {
            setIsExpand(false);
          });
        }, 150);
      }
    }, [pin, isHovering, isExpand, setIsExpand]);

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
        }
      };
    }, []);

    const canResizing = resize !== false && isExpand;

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

    // Toggle expand state with transition for better performance
    const toggleExpand = useCallback(() => {
      if (!expandable) return;

      startTransition(() => {
        setIsExpand(!isExpand);
      });
    }, [expandable, isExpand, setIsExpand]);

    // Toggle handle component
    const handle = useMemo(
      () => (
        <Center
          className={toggleVariants({ placement: internalPlacement, showHandleWideArea })}
          style={{ opacity: isExpand ? (pin ? undefined : 0) : showHandleWhenCollapsed ? 1 : 0 }}
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
                marginBottom: internalPlacement === 'top' ? 4 : 0,
                marginLeft: internalPlacement === 'right' ? 4 : 0,
                marginRight: internalPlacement === 'left' ? 4 : 0,
                marginTop: internalPlacement === 'bottom' ? 4 : 0,
                transform: `rotate(${isExpand ? 180 : 0}deg)`,
                transition: 'transform 0.3s ease',
              }}
            />
          </Center>
        </Center>
      ),
      [
        toggleVariants,
        internalPlacement,
        isExpand,
        pin,
        showHandleWhenCollapsed,
        classNames?.handle,
        toggleExpand,
        customStyles?.handle,
        styles.handlerIcon,
        Arrow,
      ],
    );

    // Handle resize events with memoization
    const handleResize = useCallback(
      (_: unknown, _direction: unknown, reference_: HTMLElement, delta: NumberSize) => {
        onSizeDragging?.(delta, {
          height: reference_.style.height,
          width: reference_.style.width,
        });
      },
      [onSizeDragging],
    );

    const handleResizeStart = useCallback(() => {
      dispatch({ type: 'START_RESIZE' });
    }, []);

    const handleResizeStop = useCallback(
      (e: unknown, direction: unknown, reference_: HTMLElement, delta: NumberSize) => {
        dispatch({ type: 'STOP_RESIZE' });
        onSizeChange?.(delta, {
          height: reference_.style.height,
          width: reference_.style.width,
        });
      },
      [onSizeChange],
    );

    // Main panel content
    const inner = useMemo(
      () => (
        <Resizable
          {...sizeProps}
          className={cx(styles.panel, classNames?.content)}
          enable={canResizing ? (resizing as Enable) : undefined}
          handleClasses={
            canResizing
              ? {
                  [reversePlacement(internalPlacement)]: cx(
                    handleVariants({
                      placement: reversePlacement(internalPlacement),
                    }),
                    showHandleHighlight && styles.handleHighlight,
                  ),
                }
              : {}
          }
          style={{
            ...cssVariables,
            opacity: isPending ? 0.95 : 1,
            transition: state.isResizing ? 'unset' : undefined,
            ...style,
          }}
          onResize={handleResize}
          onResizeStart={handleResizeStart}
          onResizeStop={handleResizeStop}
        >
          {children}
        </Resizable>
      ),
      [
        sizeProps,
        styles.panel,
        classNames?.content,
        canResizing,
        resizing,
        internalPlacement,
        handleVariants,
        showHandleHighlight,
        styles.handleHighlight,
        handleResize,
        handleResizeStart,
        handleResizeStop,
        state.isResizing,
        isPending,
        style,
        children,
        cx,
      ],
    );

    // For fullscreen mode, return a simpler layout
    if (fullscreen) {
      return (
        <div className={cx(styles.fullscreen, className)} style={cssVariables}>
          {children}
        </div>
      );
    }

    return (
      <aside
        dir={dir}
        ref={ref}
        style={cssVariables}
        className={cx(
          panelVariants({
            isExpand,
            mode,
            placement: internalPlacement,
            showBorder,
          }),
          className,
        )}
      >
        {expandable && state.showExpand && handle}
        {destroyOnClose ? isExpand && inner : inner}
      </aside>
    );
  },
  isEqual,
);

DraggablePanel.displayName = 'DraggablePanel';

export default DraggablePanel;
