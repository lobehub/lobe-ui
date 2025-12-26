'use client';

import { useHover } from 'ahooks';
import { cx } from 'antd-style';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Resizable, ResizeCallback } from 're-resizable';
import { CSSProperties, memo, useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import useControlledState from 'use-merge-value';

import { Center, Flexbox } from '@/Flex';
import Icon from '@/Icon';

import { styles } from './style';
import type { DraggableSideNavProps } from './type';

const DEFAULT_MIN_WIDTH = 64; // 最小宽度即折叠宽度
const DEFAULT_EXPAND = true;
const DEFAULT_EXPANDED_WIDTH = 280;
const ANIMATION_DURATION = 300;
const COLLAPSE_ANIMATION_DELAY = 200;

// Pre-define static objects to avoid recreating
const RESIZE_DISABLED = {
  bottom: false,
  bottomLeft: false,
  bottomRight: false,
  left: false,
  right: false,
  top: false,
  topLeft: false,
  topRight: false,
};

// State reducer for better state management
interface SideNavState {
  expandedWidth: number;
  internalWidth: number;
  isAnimating: boolean;
  isResizing: boolean;
  renderExpand: boolean;
}

type SideNavAction =
  | { type: 'START_RESIZE' }
  | { type: 'STOP_RESIZE' }
  | { type: 'START_ANIMATION' }
  | { type: 'STOP_ANIMATION' }
  | { payload: number; type: 'SET_WIDTH' }
  | { payload: number; type: 'SET_EXPANDED_WIDTH' }
  | { payload: boolean; type: 'SET_RENDER_EXPAND' }
  | { payload: number; type: 'ANIMATE_EXPAND' }
  | { payload: number; type: 'ANIMATE_COLLAPSE' };

function sideNavReducer(state: SideNavState, action: SideNavAction): SideNavState {
  switch (action.type) {
    case 'START_RESIZE': {
      return { ...state, isResizing: true };
    }
    case 'STOP_RESIZE': {
      return { ...state, isResizing: false };
    }
    case 'START_ANIMATION': {
      return { ...state, isAnimating: true };
    }
    case 'STOP_ANIMATION': {
      return { ...state, isAnimating: false };
    }
    case 'SET_WIDTH': {
      return { ...state, internalWidth: action.payload };
    }
    case 'SET_EXPANDED_WIDTH': {
      return { ...state, expandedWidth: action.payload };
    }
    case 'SET_RENDER_EXPAND': {
      return { ...state, renderExpand: action.payload };
    }
    case 'ANIMATE_EXPAND': {
      return { ...state, internalWidth: action.payload, renderExpand: true };
    }
    case 'ANIMATE_COLLAPSE': {
      return { ...state, internalWidth: action.payload };
    }
    default: {
      return state;
    }
  }
}

const DraggableSideNav = memo<DraggableSideNavProps>(
  ({
    body,
    className,
    classNames,
    defaultExpand = DEFAULT_EXPAND,
    defaultWidth,
    expand,
    expandable = true,
    footer,
    header,
    maxWidth,
    minWidth = DEFAULT_MIN_WIDTH,
    onExpandChange,
    onWidthChange,
    onWidthDragging,
    placement = 'left',
    resizable = true,
    showBorder = true,
    showHandle = true,
    showHandleWhenCollapsed = false,
    showHandleHighlight = false,
    backgroundColor,
    styles: customStyles,
    width,
    ...rest
  }) => {
    const cssVariables = useMemo<Record<string, string>>(
      () => ({
        '--draggable-side-nav-bg': backgroundColor || '',
      }),
      [backgroundColor],
    );
    const ref = useRef<HTMLDivElement>(null);
    const isHovering = useHover(ref);

    // Expand state management
    const [isExpand, setIsExpand] = useControlledState(defaultExpand, {
      onChange: onExpandChange,
      value: expand,
    });

    // Use refs for animation timeouts to avoid memory leaks
    const animationTimeoutRef = useRef<any>(undefined);
    const collapseTimeoutRef = useRef<any>(undefined);

    // Compute default expanded width - memoize to avoid recalculation
    const computedDefaultExpandedWidth = useMemo(
      () => defaultWidth || DEFAULT_EXPANDED_WIDTH,
      [defaultWidth],
    );

    // Initialize state with useReducer for better performance
    const initialState: SideNavState = {
      expandedWidth: width ?? computedDefaultExpandedWidth,
      internalWidth: isExpand ? (width ?? computedDefaultExpandedWidth) : minWidth,
      isAnimating: false,
      isResizing: false,
      renderExpand: isExpand,
    };

    const [state, dispatch] = useReducer(sideNavReducer, initialState);

    // 计算折叠阈值：展开最小宽度和折叠宽度的中间值
    const collapseThreshold = useMemo(() => {
      return minWidth + (state.expandedWidth - minWidth) / 3;
    }, [minWidth, state.expandedWidth]);

    // Toggle expand state with smooth animation
    const toggleExpand = useCallback(() => {
      if (!expandable) return;

      // 在动画或拖拽期间阻止新的切换操作，避免状态混乱
      if (state.isAnimating || state.isResizing) return;

      // 清除之前的动画
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }

      // 立即设置动画状态，避免其他 useEffect 干扰
      dispatch({ type: 'START_ANIMATION' });
      setIsExpand(!isExpand);

      // 动画完成后重置状态 - 与宽度动画时长一致
      animationTimeoutRef.current = setTimeout(() => {
        dispatch({ type: 'STOP_ANIMATION' });
      }, ANIMATION_DURATION);
    }, [expandable, isExpand, setIsExpand, state.isAnimating, state.isResizing]);

    // 用于跟踪上一次的 expand 状态，以检测外部变化
    const prevExpandRef = useRef(isExpand);

    // 监听外部 expand prop 变化，触发动画
    useEffect(() => {
      // 检测到 expand 状态变化，且不在拖拽和动画中
      if (prevExpandRef.current !== isExpand && !state.isResizing && !state.isAnimating) {
        if (animationTimeoutRef.current) {
          clearTimeout(animationTimeoutRef.current);
        }

        // 立即设置动画状态，避免其他 useEffect 干扰
        dispatch({ type: 'START_ANIMATION' });

        animationTimeoutRef.current = setTimeout(() => {
          dispatch({ type: 'STOP_ANIMATION' });
        }, ANIMATION_DURATION);

        prevExpandRef.current = isExpand;
      }
    }, [isExpand, state.isResizing, state.isAnimating]);

    // 处理展开/折叠状态变化时的宽度动画和内容切换时机
    useEffect(() => {
      if (state.isAnimating) {
        // 使用 requestAnimationFrame 确保动画平滑
        const rafId = requestAnimationFrame(() => {
          if (isExpand) {
            // 展开动画：立即切换内容（先切换内容，再开始宽度动画）
            dispatch({ payload: state.expandedWidth, type: 'ANIMATE_EXPAND' });
          } else {
            // 折叠动画：延迟切换内容，在动画接近结束时才切换（300ms，略早于动画结束）
            dispatch({ payload: minWidth, type: 'ANIMATE_COLLAPSE' });

            if (collapseTimeoutRef.current) {
              clearTimeout(collapseTimeoutRef.current);
            }
            collapseTimeoutRef.current = setTimeout(() => {
              dispatch({ payload: false, type: 'SET_RENDER_EXPAND' });
            }, COLLAPSE_ANIMATION_DELAY);
          }
        });

        return () => {
          cancelAnimationFrame(rafId);
        };
      }
    }, [isExpand, state.isAnimating, minWidth, state.expandedWidth]);

    // 同步非动画期间的 renderExpand 状态（如拖拽）
    // 使用 ref 追踪上一次的 isResizing 状态，只在拖拽结束时同步
    const prevIsResizingRef = useRef(state.isResizing);
    useEffect(() => {
      const wasResizing = prevIsResizingRef.current;
      prevIsResizingRef.current = state.isResizing;

      // 只在拖拽刚结束时同步 renderExpand，避免干扰正常的展开/折叠动画
      if (wasResizing && !state.isResizing && !state.isAnimating) {
        dispatch({ payload: isExpand, type: 'SET_RENDER_EXPAND' });
      }
    }, [isExpand, state.isAnimating, state.isResizing]);

    // 处理外部 width prop 变化
    // width 表示展开时的宽度，实际显示宽度根据 isExpand 状态决定
    useEffect(() => {
      if (width !== undefined && !state.isResizing && !state.isAnimating) {
        // 更新展开宽度记录
        dispatch({ payload: width, type: 'SET_EXPANDED_WIDTH' });
        // 根据当前状态设置实际宽度
        if (isExpand) {
          dispatch({ payload: width, type: 'SET_WIDTH' });
        }
        // 如果是折叠状态，保持 minWidth，不改变 internalWidth
      }
    }, [width, state.isResizing, state.isAnimating, isExpand]);

    // 计算当前的 body 内容 - 使用 renderExpand
    const currentBody = useMemo(() => {
      return body(state.renderExpand);
    }, [body, state.renderExpand]);

    // 计算当前的 header（支持函数和静态值）- 使用 renderExpand
    const currentHeader = useMemo(() => {
      return typeof header === 'function' ? header(state.renderExpand) : header;
    }, [header, state.renderExpand]);

    // 计算当前的 footer（支持函数和静态值）- 使用 renderExpand
    const currentFooter = useMemo(() => {
      return typeof footer === 'function' ? footer(state.renderExpand) : footer;
    }, [footer, state.renderExpand]);

    // Handle resize - memoize to prevent recreating on every render
    const handleResize: ResizeCallback = useCallback(
      (_, __, ref, delta) => {
        const currentWidth = ref.offsetWidth;
        dispatch({ payload: currentWidth, type: 'SET_WIDTH' });

        onWidthDragging?.(delta, currentWidth);
      },
      [onWidthDragging],
    );

    const handleResizeStart = useCallback(() => {
      dispatch({ type: 'START_RESIZE' });
    }, []);

    const handleResizeStop: ResizeCallback = useCallback(
      (_, __, ref, delta) => {
        dispatch({ type: 'STOP_RESIZE' });

        const currentWidth = ref.offsetWidth;

        // 清除之前的动画
        if (animationTimeoutRef.current) {
          clearTimeout(animationTimeoutRef.current);
        }

        // 根据拖拽后的宽度决定是折叠还是展开
        if (expandable) {
          const shouldCollapse = currentWidth <= minWidth || currentWidth < collapseThreshold;
          const shouldExpand =
            !isExpand && currentWidth > minWidth && currentWidth >= collapseThreshold;

          if (shouldCollapse || shouldExpand) {
            // 立即设置动画状态
            dispatch({ type: 'START_ANIMATION' });

            if (shouldCollapse) {
              setIsExpand(false);
              dispatch({ payload: minWidth, type: 'SET_WIDTH' });
            } else {
              setIsExpand(true);
              dispatch({ payload: currentWidth, type: 'SET_EXPANDED_WIDTH' });
              dispatch({ payload: currentWidth, type: 'SET_WIDTH' });
            }

            animationTimeoutRef.current = setTimeout(() => {
              dispatch({ type: 'STOP_ANIMATION' });
            }, ANIMATION_DURATION);
          } else if (isExpand) {
            // 展开状态下正常拖拽，记住宽度
            dispatch({ payload: currentWidth, type: 'SET_EXPANDED_WIDTH' });
            dispatch({ payload: currentWidth, type: 'SET_WIDTH' });
          }
        } else {
          // 如果不可折叠，仅更新宽度
          dispatch({ payload: currentWidth, type: 'SET_EXPANDED_WIDTH' });
          dispatch({ payload: currentWidth, type: 'SET_WIDTH' });
        }

        onWidthChange?.(delta, currentWidth);
      },
      [expandable, minWidth, collapseThreshold, isExpand, onWidthChange, setIsExpand],
    );

    // Arrow icon based on placement and expand state
    const ArrowIcon = useMemo(() => {
      if (placement === 'left') {
        // 左侧：展开时箭头向左（折叠方向），折叠时箭头向右（展开方向）
        return ChevronLeft;
      }
      // 右侧：展开时箭头向右（折叠方向），折叠时箭头向左（展开方向）
      return ChevronRight;
    }, [placement]);

    // Memoize handle styles to prevent recreation
    const handleRootStyle = useMemo<CSSProperties>(
      () => ({
        display: 'flex',
        opacity: !isExpand && showHandleWhenCollapsed ? 1 : isHovering ? 1 : 0,
        transition: 'opacity 0.25s ease',
      }),
      [isExpand, showHandleWhenCollapsed, isHovering],
    );

    const handleCenterStyle = useMemo<CSSProperties>(
      () => ({
        ...customStyles?.handle,
        cursor: 'pointer',
      }),
      [customStyles?.handle],
    );

    const handleIconWrapperStyle = useMemo<CSSProperties>(
      () => ({
        marginLeft: placement === 'right' ? 4 : 0,
        marginRight: placement === 'left' ? 4 : 0,
        transform: isExpand ? 'rotate(0deg)' : 'rotate(180deg)',
        transition: `transform ${COLLAPSE_ANIMATION_DELAY} ease`,
      }),
      [placement, isExpand],
    );

    // Toggle handle with smooth transitions
    const handle = useMemo(
      () =>
        showHandle &&
        expandable && (
          <div
            className={cx(
              styles.toggleRoot,
              placement === 'left' ? styles.toggleLeft : styles.toggleRight,
            )}
            style={handleRootStyle}
          >
            <Center className={classNames?.handle} onClick={toggleExpand} style={handleCenterStyle}>
              <div style={handleIconWrapperStyle}>
                <Icon className={styles.handlerIcon} icon={ArrowIcon} size={16} />
              </div>
            </Center>
          </div>
        ),
      [
        showHandle,
        expandable,
        styles.toggleRoot,
        styles.toggleLeft,
        styles.toggleRight,
        styles.handlerIcon,
        placement,
        handleRootStyle,
        classNames?.handle,
        toggleExpand,
        handleCenterStyle,
        handleIconWrapperStyle,
        ArrowIcon,
        cx,
      ],
    );

    // Size configuration - 使用内部宽度状态
    const sizeConfig = useMemo(() => {
      return {
        maxWidth: maxWidth,
        minWidth: minWidth,
        size: { height: '100%', width: state.internalWidth },
      };
    }, [state.internalWidth, minWidth, maxWidth]);

    // Resize enable configuration - 始终允许拖拽
    const resizeEnable = useMemo(() => {
      if (!resizable) {
        return RESIZE_DISABLED;
      }
      return {
        bottom: false,
        bottomLeft: false,
        bottomRight: false,
        left: placement === 'right',
        right: placement === 'left',
        top: false,
        topLeft: false,
        topRight: false,
      };
    }, [resizable, placement]);

    // Memoize handle classes to prevent recreation
    const handleClasses = useMemo(
      () => ({
        [placement === 'left' ? 'right' : 'left']: cx(
          styles.resizeHandle,
          showHandleHighlight && styles.resizeHandleHighlight,
          placement === 'left' ? styles.resizeHandleLeft : styles.resizeHandleRight,
        ),
      }),
      [placement, styles, showHandleHighlight, cx],
    );

    // Memoize container style to prevent recreation
    const containerStyle = useMemo<CSSProperties>(
      () => ({
        ...customStyles?.container,
        ...rest.style,
        // 拖拽时不要动画，点击 handle 时有流畅的弹性动画
        transition: state.isResizing
          ? 'none'
          : state.isAnimating
            ? `width ${ANIMATION_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1)`
            : 'none',
      }),
      [customStyles?.container, rest.style, state.isResizing, state.isAnimating],
    );

    // Memoize class names
    const containerClassName = useMemo(
      () => cx(styles.container, classNames?.container, className),
      [cx, styles.container, classNames?.container, className],
    );

    const contentClassName = useMemo(
      () =>
        cx(
          showBorder ? styles.contentContainer : styles.contentContainerNoBorder,
          styles.menuOverride,
          classNames?.content,
        ),
      [
        cx,
        styles.contentContainer,
        styles.contentContainerNoBorder,
        styles.menuOverride,
        classNames?.content,
        showBorder,
      ],
    );

    const headerClassName = useMemo(
      () => cx(styles.header, classNames?.header),
      [cx, styles.header, classNames?.header],
    );

    const bodyClassName = useMemo(
      () => cx(styles.body, classNames?.body),
      [cx, styles.body, classNames?.body],
    );

    const footerClassName = useMemo(
      () => cx(styles.footer, classNames?.footer),
      [cx, styles.footer, classNames?.footer],
    );

    // Cleanup timeouts on unmount
    useEffect(() => {
      return () => {
        if (animationTimeoutRef.current) {
          clearTimeout(animationTimeoutRef.current);
        }
        if (collapseTimeoutRef.current) {
          clearTimeout(collapseTimeoutRef.current);
        }
      };
    }, []);

    return (
      <aside ref={ref}>
        <Resizable
          {...sizeConfig}
          className={containerClassName}
          enable={resizeEnable}
          handleClasses={handleClasses}
          onResize={handleResize}
          onResizeStart={handleResizeStart}
          onResizeStop={handleResizeStop}
          style={containerStyle}
        >
          {handle}
          <Flexbox
            className={contentClassName}
            style={{
              ...cssVariables,
              ...customStyles?.content,
            }}
          >
            {currentHeader && (
              <div className={headerClassName} style={customStyles?.header}>
                {currentHeader}
              </div>
            )}
            <div className={bodyClassName} style={customStyles?.body}>
              {currentBody}
            </div>
            {currentFooter && (
              <div className={footerClassName} style={customStyles?.footer}>
                {currentFooter}
              </div>
            )}
          </Flexbox>
        </Resizable>
      </aside>
    );
  },
);

DraggableSideNav.displayName = 'DraggableSideNav';

export default DraggableSideNav;
