'use client';

import { useHover } from 'ahooks';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Resizable } from 're-resizable';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Center, Flexbox } from 'react-layout-kit';
import useControlledState from 'use-merge-value';

import Icon from '@/Icon';

import { useStyles } from './style';
import type { DraggableSideNavProps } from './type';

const DEFAULT_MIN_WIDTH = 64; // 最小宽度即折叠宽度
const DEFAULT_COLLAPSED = false;
const DEFAULT_EXPANDED_WIDTH = 280;

const DraggableSideNav = memo<DraggableSideNavProps>(
  ({
    children,
    header,
    footer,
    className,
    classNames,
    defaultCollapsed = DEFAULT_COLLAPSED,
    collapsed,
    onCollapsedChange,
    onSizeChange,
    onSizeDragging,
    defaultSize,
    size,
    minWidth = DEFAULT_MIN_WIDTH,
    maxWidth,
    resizable = true,
    styles: customStyles,
    showHandle = true,
    showHandleWhenCollapsed = false,
    placement = 'left',
    ...rest
  }) => {
    const { styles, cx } = useStyles();
    const ref = useRef<HTMLDivElement>(null);
    const isHovering = useHover(ref);

    const [isCollapsed, setIsCollapsed] = useControlledState(defaultCollapsed, {
      onChange: onCollapsedChange,
      value: collapsed,
    });

    const [isResizing, setIsResizing] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // 内部宽度状态，用于平滑动画
    const [internalWidth, setInternalWidth] = useState<number>(
      isCollapsed ? minWidth : (defaultSize?.width as number) || DEFAULT_EXPANDED_WIDTH,
    );

    // 记住展开时的宽度
    const [expandedWidth, setExpandedWidth] = useState<number>(
      (defaultSize?.width as number) || DEFAULT_EXPANDED_WIDTH,
    );

    // 计算折叠阈值：展开最小宽度和折叠宽度的中间值
    const collapseThreshold = useMemo(() => {
      return minWidth + (expandedWidth - minWidth) / 3;
    }, [minWidth, expandedWidth]);

    // Toggle collapse state
    const toggleCollapse = () => {
      setIsAnimating(true);
      setIsCollapsed(!isCollapsed);

      // 动画完成后重置状态
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    };

    // 处理折叠状态变化时的宽度动画
    useEffect(() => {
      if (isAnimating) {
        // 使用 requestAnimationFrame 确保动画平滑
        requestAnimationFrame(() => {
          if (isCollapsed) {
            setInternalWidth(minWidth);
          } else {
            setInternalWidth(expandedWidth);
          }
        });
      }
    }, [isCollapsed, isAnimating, minWidth, expandedWidth]);

    // 处理外部 size prop 变化
    useEffect(() => {
      if (size?.width && !isResizing && !isAnimating) {
        const width = typeof size.width === 'string' ? parseInt(size.width) : size.width;
        setInternalWidth(width);
        if (!isCollapsed) {
          setExpandedWidth(width);
        }
      }
    }, [size?.width, isResizing, isAnimating, isCollapsed]);

    // 计算当前的 children（支持函数和静态值）
    const currentChildren = useMemo(() => {
      return typeof children === 'function' ? children(isCollapsed) : children;
    }, [children, isCollapsed]);

    // 计算当前的 header（支持函数和静态值）
    const currentHeader = useMemo(() => {
      return typeof header === 'function' ? header(isCollapsed) : header;
    }, [header, isCollapsed]);

    // 计算当前的 footer（支持函数和静态值）
    const currentFooter = useMemo(() => {
      return typeof footer === 'function' ? footer(isCollapsed) : footer;
    }, [footer, isCollapsed]);

    // Handle resize
    const handleResize = (_: unknown, _direction: unknown, reference_: HTMLElement, delta: any) => {
      const currentWidth = reference_.offsetWidth;
      setInternalWidth(currentWidth);

      onSizeDragging?.(delta, {
        height: reference_.style.height,
        width: reference_.style.width,
      });
    };

    const handleResizeStart = () => {
      setIsResizing(true);
    };

    const handleResizeStop = (
      _: unknown,
      _direction: unknown,
      reference_: HTMLElement,
      delta: any,
    ) => {
      setIsResizing(false);

      const currentWidth = reference_.offsetWidth;

      // 根据拖拽后的宽度决定是折叠还是展开
      if (currentWidth <= minWidth) {
        // 拖拽到最小宽度，保持折叠
        setIsAnimating(true);
        setIsCollapsed(true);
        setInternalWidth(minWidth);
        setTimeout(() => setIsAnimating(false), 300);
      } else if (currentWidth < collapseThreshold) {
        // 拖拽到阈值以下，自动折叠
        setIsAnimating(true);
        setIsCollapsed(true);
        setInternalWidth(minWidth);
        setTimeout(() => setIsAnimating(false), 300);
      } else if (isCollapsed && currentWidth > minWidth) {
        // 从折叠状态拖拽出来，自动展开
        setIsAnimating(true);
        setIsCollapsed(false);
        setExpandedWidth(currentWidth);
        setInternalWidth(currentWidth);
        setTimeout(() => setIsAnimating(false), 300);
      } else if (!isCollapsed) {
        // 展开状态下正常拖拽，记住宽度
        setExpandedWidth(currentWidth);
        setInternalWidth(currentWidth);
      }

      onSizeChange?.(delta, {
        height: reference_.style.height,
        width: reference_.style.width,
      });
    };

    // Arrow icon based on placement and collapse state
    const ArrowIcon = useMemo(() => {
      if (placement === 'left') {
        // 左侧：折叠时箭头向右（展开方向），展开时箭头向左（折叠方向）
        return ChevronLeft;
      }
      // 右侧：折叠时箭头向左（展开方向），展开时箭头向右（折叠方向）
      return ChevronRight;
    }, [placement]);

    // Toggle handle (aligned with DraggablePanel)
    const handle = showHandle && (
      <Center
        className={cx(
          styles.toggleRoot,
          placement === 'left' ? styles.toggleLeft : styles.toggleRight,
        )}
        style={{
          opacity: isCollapsed && showHandleWhenCollapsed ? 1 : isHovering ? 1 : 0,
        }}
      >
        <Center
          className={classNames?.handle}
          onClick={toggleCollapse}
          style={customStyles?.handle}
        >
          <Icon
            className={styles.handlerIcon}
            icon={ArrowIcon}
            size={16}
            style={{ transform: `rotate(${isCollapsed ? 180 : 0}deg)` }}
          />
        </Center>
      </Center>
    );

    // Size configuration - 使用内部宽度状态
    const sizeConfig = useMemo(() => {
      return {
        maxWidth: maxWidth,
        minWidth: minWidth,
        size: { height: '100%', width: internalWidth },
      };
    }, [internalWidth, minWidth, maxWidth]);

    // Resize enable configuration - 始终允许拖拽
    const resizeEnable = useMemo(() => {
      if (!resizable) {
        return {
          bottom: false,
          bottomLeft: false,
          bottomRight: false,
          left: false,
          right: false,
          top: false,
          topLeft: false,
          topRight: false,
        };
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

    return (
      <div ref={ref}>
        <Resizable
          {...sizeConfig}
          className={cx(styles.container, classNames?.container, className)}
          enable={resizeEnable}
          handleClasses={{
            [placement === 'left' ? 'right' : 'left']: cx(
              styles.resizeHandle,
              placement === 'left' ? styles.resizeHandleLeft : styles.resizeHandleRight,
            ),
          }}
          onResize={handleResize}
          onResizeStart={handleResizeStart}
          onResizeStop={handleResizeStop}
          style={{
            ...customStyles?.container,
            ...rest.style,
            // 拖拽时不要动画，点击 handle 时有动画
            transition: isResizing
              ? 'none'
              : isAnimating
                ? 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                : 'none',
          }}
        >
          {handle}
          <Flexbox
            className={cx(styles.contentContainer, classNames?.content)}
            style={customStyles?.content}
          >
            {currentHeader && (
              <div className={cx(styles.header, classNames?.header)} style={customStyles?.header}>
                {currentHeader}
              </div>
            )}
            <div className={cx(styles.body, classNames?.body)} style={customStyles?.body}>
              {currentChildren}
            </div>
            {currentFooter && (
              <div className={cx(styles.footer, classNames?.footer)} style={customStyles?.footer}>
                {currentFooter}
              </div>
            )}
          </Flexbox>
        </Resizable>
      </div>
    );
  },
);

DraggableSideNav.displayName = 'DraggableSideNav';

export default DraggableSideNav;
