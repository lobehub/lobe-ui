'use client';

import { useHover } from 'ahooks';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Resizable } from 're-resizable';
import { type ReactNode, memo, useEffect, useMemo, useRef, useState } from 'react';
import { Center, Flexbox } from 'react-layout-kit';
import useControlledState from 'use-merge-value';

import Icon from '@/Icon';

import { useStyles } from './style';
import type { DraggableSideNavProps } from './type';

const DEFAULT_MIN_WIDTH = 64; // 最小宽度即折叠宽度
const DEFAULT_COLLAPSED = false;
const DEFAULT_EXPANDED_WIDTH = 280;

// Animation variants generator based on fade and blur settings
const getAnimationVariants = (fade: boolean, blur: boolean) => {
  const enterProps: any = {
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  };
  const exitProps: any = {
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1] as const,
    },
  };

  if (fade) {
    enterProps.opacity = 1;
    exitProps.opacity = 0;
  }

  if (blur) {
    enterProps.filter = 'blur(0px)';
    exitProps.filter = 'blur(4px)';
  }

  return { enter: enterProps, exit: exitProps };
};

// Wrapper component for content animation
const AnimationWrapper = memo<{
  blur: boolean;
  children: ReactNode;
  collapsed: boolean;
  enabled?: boolean;
  fade: boolean;
  id: string;
}>(({ blur, children, collapsed, enabled, fade, id }) => {
  if (!enabled) return children;

  const variants = getAnimationVariants(fade, blur);

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        animate="enter"
        exit="exit"
        initial="exit"
        key={`${id}-${collapsed ? 'collapsed' : 'expanded'}`}
        variants={variants}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
});

AnimationWrapper.displayName = 'AnimationWrapper';

const DraggableSideNav = memo<DraggableSideNavProps>(
  ({
    animation,
    children,
    className,
    classNames,
    collapsed,
    defaultCollapsed = DEFAULT_COLLAPSED,
    defaultSize,
    footer,
    header,
    maxWidth,
    minWidth = DEFAULT_MIN_WIDTH,
    onCollapsedChange,
    onSizeChange,
    onSizeDragging,
    placement = 'left',
    resizable = true,
    showBorder = true,
    showHandle = true,
    showHandleWhenCollapsed = false,
    showHandleHighlight = false,
    size,
    styles: customStyles,
    ...rest
  }) => {
    const { styles, cx } = useStyles({ showBorder });
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

    // 用于渲染的 collapsed 状态 - 延迟切换以匹配动画时机
    const [renderCollapsed, setRenderCollapsed] = useState(isCollapsed);

    // 计算折叠阈值：展开最小宽度和折叠宽度的中间值
    const collapseThreshold = useMemo(() => {
      return minWidth + (expandedWidth - minWidth) / 3;
    }, [minWidth, expandedWidth]);

    // Toggle collapse state with smooth animation
    const toggleCollapse = () => {
      setIsAnimating(true);
      setIsCollapsed(!isCollapsed);

      // 动画完成后重置状态 - 与宽度动画时长一致
      setTimeout(() => {
        setIsAnimating(false);
      }, 400);
    };

    // 处理折叠状态变化时的宽度动画和内容切换时机
    useEffect(() => {
      if (isAnimating) {
        // 使用 requestAnimationFrame 确保动画平滑
        requestAnimationFrame(() => {
          if (isCollapsed) {
            setInternalWidth(minWidth);
            // 折叠动画：延迟切换内容，在动画接近结束时才切换（300ms，略早于动画结束）
            setTimeout(() => {
              setRenderCollapsed(true);
            }, 300);
          } else {
            // 展开动画：立即切换内容（先切换内容，再开始宽度动画）
            setRenderCollapsed(false);
            setInternalWidth(expandedWidth);
          }
        });
      }
    }, [isCollapsed, isAnimating, minWidth, expandedWidth]);

    // 同步非动画期间的 renderCollapsed 状态（如拖拽）
    useEffect(() => {
      if (!isAnimating && !isResizing) {
        setRenderCollapsed(isCollapsed);
      }
    }, [isCollapsed, isAnimating, isResizing]);

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

    // 计算当前的 children（支持函数和静态值）- 使用 renderCollapsed 而不是 isCollapsed
    const currentChildren = useMemo(() => {
      return typeof children === 'function' ? children(renderCollapsed) : children;
    }, [children, renderCollapsed]);

    // 计算当前的 header（支持函数和静态值）- 使用 renderCollapsed 而不是 isCollapsed
    const currentHeader = useMemo(() => {
      return typeof header === 'function' ? header(renderCollapsed) : header;
    }, [header, renderCollapsed]);

    // 计算当前的 footer（支持函数和静态值）- 使用 renderCollapsed 而不是 isCollapsed
    const currentFooter = useMemo(() => {
      return typeof footer === 'function' ? footer(renderCollapsed) : footer;
    }, [footer, renderCollapsed]);

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
        setTimeout(() => setIsAnimating(false), 400);
      } else if (currentWidth < collapseThreshold) {
        // 拖拽到阈值以下，自动折叠
        setIsAnimating(true);
        setIsCollapsed(true);
        setInternalWidth(minWidth);
        setTimeout(() => setIsAnimating(false), 400);
      } else if (isCollapsed && currentWidth > minWidth) {
        // 从折叠状态拖拽出来，自动展开
        setIsAnimating(true);
        setIsCollapsed(false);
        setExpandedWidth(currentWidth);
        setInternalWidth(currentWidth);
        setTimeout(() => setIsAnimating(false), 400);
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

    // Toggle handle with smooth transitions
    const handle = showHandle && (
      <motion.div
        animate={{
          opacity: isCollapsed && showHandleWhenCollapsed ? 1 : isHovering ? 1 : 0,
          scale: isHovering ? 1.05 : 1,
        }}
        className={cx(
          styles.toggleRoot,
          placement === 'left' ? styles.toggleLeft : styles.toggleRight,
        )}
        style={{ display: 'flex' }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <Center
          className={classNames?.handle}
          onClick={toggleCollapse}
          style={{
            ...customStyles?.handle,
            cursor: 'pointer',
            transition: 'transform 0.2s ease-out',
          }}
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <Icon className={styles.handlerIcon} icon={ArrowIcon} size={16} />
          </motion.div>
        </Center>
      </motion.div>
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
      <aside ref={ref}>
        <Resizable
          {...sizeConfig}
          className={cx(styles.container, classNames?.container, className)}
          enable={resizeEnable}
          handleClasses={{
            [placement === 'left' ? 'right' : 'left']: cx(
              styles.resizeHandle,
              showHandleHighlight && styles.resizeHandleHighlight,
              placement === 'left' ? styles.resizeHandleLeft : styles.resizeHandleRight,
            ),
          }}
          onResize={handleResize}
          onResizeStart={handleResizeStart}
          onResizeStop={handleResizeStop}
          style={{
            ...customStyles?.container,
            ...rest.style,
            // 拖拽时不要动画，点击 handle 时有流畅的弹性动画
            transition: isResizing
              ? 'none'
              : isAnimating
                ? 'width 0.4s cubic-bezier(0.22, 1, 0.36, 1)'
                : 'none',
          }}
        >
          {handle}
          <Flexbox
            className={cx(styles.contentContainer, styles.menuOverride, classNames?.content)}
            style={customStyles?.content}
          >
            {currentHeader && (
              <div className={cx(styles.header, classNames?.header)} style={customStyles?.header}>
                <AnimationWrapper
                  blur={animation?.blur ?? false}
                  collapsed={renderCollapsed}
                  enabled={animation?.header}
                  fade={animation?.fade ?? true}
                  id="header"
                >
                  {currentHeader}
                </AnimationWrapper>
              </div>
            )}
            <div className={cx(styles.body, classNames?.body)} style={customStyles?.body}>
              <AnimationWrapper
                blur={animation?.blur ?? false}
                collapsed={renderCollapsed}
                enabled={animation?.body}
                fade={animation?.fade ?? true}
                id="body"
              >
                {currentChildren}
              </AnimationWrapper>
            </div>
            {currentFooter && (
              <div className={cx(styles.footer, classNames?.footer)} style={customStyles?.footer}>
                <AnimationWrapper
                  blur={animation?.blur ?? false}
                  collapsed={renderCollapsed}
                  enabled={animation?.footer}
                  fade={animation?.fade ?? true}
                  id="footer"
                >
                  {currentFooter}
                </AnimationWrapper>
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
