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
const DEFAULT_EXPAND = true;
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
  enabled?: boolean;
  expand: boolean;
  fade: boolean;
  id: string;
}>(({ blur, children, enabled, expand, fade, id }) => {
  if (!enabled) return children;

  const variants = getAnimationVariants(fade, blur);

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        animate="enter"
        exit="exit"
        initial="exit"
        key={`${id}-${expand ? 'expanded' : 'collapsed'}`}
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
    styles: customStyles,
    width,
    ...rest
  }) => {
    const { styles, cx } = useStyles({ showBorder });
    const ref = useRef<HTMLDivElement>(null);
    const isHovering = useHover(ref);

    // Expand state management
    const [isExpand, setIsExpand] = useControlledState(defaultExpand, {
      onChange: onExpandChange,
      value: expand,
    });

    const [isResizing, setIsResizing] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Compute default expanded width
    const computedDefaultExpandedWidth = defaultWidth || DEFAULT_EXPANDED_WIDTH;

    // 内部宽度状态，用于平滑动画
    const [internalWidth, setInternalWidth] = useState<number>(
      isExpand ? (width ?? computedDefaultExpandedWidth) : minWidth,
    );

    // 记住展开时的宽度
    const [expandedWidth, setExpandedWidth] = useState<number>(
      width ?? computedDefaultExpandedWidth,
    );

    // 用于渲染的 expand 状态 - 延迟切换以匹配动画时机
    const [renderExpand, setRenderExpand] = useState(isExpand);

    // 计算折叠阈值：展开最小宽度和折叠宽度的中间值
    const collapseThreshold = useMemo(() => {
      return minWidth + (expandedWidth - minWidth) / 3;
    }, [minWidth, expandedWidth]);

    // Toggle expand state with smooth animation
    const toggleExpand = () => {
      if (!expandable) return;

      setIsAnimating(true);
      setIsExpand(!isExpand);

      // 动画完成后重置状态 - 与宽度动画时长一致
      setTimeout(() => {
        setIsAnimating(false);
      }, 400);
    };

    // 用于跟踪上一次的 expand 状态，以检测外部变化
    const prevExpandRef = useRef(isExpand);

    // 监听外部 expand prop 变化，触发动画
    useEffect(() => {
      // 检测到 expand 状态变化，且不在拖拽和动画中
      if (prevExpandRef.current !== isExpand && !isResizing && !isAnimating) {
        setIsAnimating(true);
        setTimeout(() => {
          setIsAnimating(false);
        }, 400);
      }
      prevExpandRef.current = isExpand;
    }, [isExpand, isResizing, isAnimating]);

    // 处理展开/折叠状态变化时的宽度动画和内容切换时机
    useEffect(() => {
      if (isAnimating) {
        // 使用 requestAnimationFrame 确保动画平滑
        requestAnimationFrame(() => {
          if (isExpand) {
            // 展开动画：立即切换内容（先切换内容，再开始宽度动画）
            setRenderExpand(true);
            setInternalWidth(expandedWidth);
          } else {
            // 折叠动画：延迟切换内容，在动画接近结束时才切换（300ms，略早于动画结束）
            setInternalWidth(minWidth);
            setTimeout(() => {
              setRenderExpand(false);
            }, 300);
          }
        });
      }
    }, [isExpand, isAnimating, minWidth, expandedWidth]);

    // 同步非动画期间的 renderExpand 状态（如拖拽）
    useEffect(() => {
      if (!isAnimating && !isResizing) {
        setRenderExpand(isExpand);
      }
    }, [isExpand, isAnimating, isResizing]);

    // 处理外部 width prop 变化
    useEffect(() => {
      if (width !== undefined && !isResizing && !isAnimating) {
        setInternalWidth(width);
        if (isExpand) {
          setExpandedWidth(width);
        }
      }
    }, [width, isResizing, isAnimating, isExpand]);

    // 计算当前的 children（支持函数和静态值）- 使用 renderExpand
    const currentChildren = useMemo(() => {
      return typeof children === 'function' ? children(renderExpand) : children;
    }, [children, renderExpand]);

    // 计算当前的 header（支持函数和静态值）- 使用 renderExpand
    const currentHeader = useMemo(() => {
      return typeof header === 'function' ? header(renderExpand) : header;
    }, [header, renderExpand]);

    // 计算当前的 footer（支持函数和静态值）- 使用 renderExpand
    const currentFooter = useMemo(() => {
      return typeof footer === 'function' ? footer(renderExpand) : footer;
    }, [footer, renderExpand]);

    // Handle resize
    const handleResize = (_: unknown, _direction: unknown, reference_: HTMLElement, delta: any) => {
      const currentWidth = reference_.offsetWidth;
      setInternalWidth(currentWidth);

      onWidthDragging?.(delta, currentWidth);
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
      if (expandable) {
        if (currentWidth <= minWidth) {
          // 拖拽到最小宽度，保持折叠
          setIsAnimating(true);
          setIsExpand(false);
          setInternalWidth(minWidth);
          setTimeout(() => setIsAnimating(false), 400);
        } else if (currentWidth < collapseThreshold) {
          // 拖拽到阈值以下，自动折叠
          setIsAnimating(true);
          setIsExpand(false);
          setInternalWidth(minWidth);
          setTimeout(() => setIsAnimating(false), 400);
        } else if (!isExpand && currentWidth > minWidth) {
          // 从折叠状态拖拽出来，自动展开
          setIsAnimating(true);
          setIsExpand(true);
          setExpandedWidth(currentWidth);
          setInternalWidth(currentWidth);
          setTimeout(() => setIsAnimating(false), 400);
        } else if (isExpand) {
          // 展开状态下正常拖拽，记住宽度
          setExpandedWidth(currentWidth);
          setInternalWidth(currentWidth);
        }
      } else {
        // 如果不可折叠，仅更新宽度
        setExpandedWidth(currentWidth);
        setInternalWidth(currentWidth);
      }

      onWidthChange?.(delta, currentWidth);
    };

    // Arrow icon based on placement and expand state
    const ArrowIcon = useMemo(() => {
      if (placement === 'left') {
        // 左侧：展开时箭头向左（折叠方向），折叠时箭头向右（展开方向）
        return ChevronLeft;
      }
      // 右侧：展开时箭头向右（折叠方向），折叠时箭头向左（展开方向）
      return ChevronRight;
    }, [placement]);

    // Toggle handle with smooth transitions
    const handle = showHandle && expandable && (
      <motion.div
        animate={{
          opacity: !isExpand && showHandleWhenCollapsed ? 1 : isHovering ? 1 : 0,
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
          onClick={toggleExpand}
          style={{
            ...customStyles?.handle,
            cursor: 'pointer',
            transition: 'transform 0.2s ease-out',
          }}
        >
          <motion.div
            animate={{ rotate: isExpand ? 0 : 180 }}
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
                {animation === false || animation === undefined ? (
                  currentHeader
                ) : (
                  <AnimationWrapper
                    blur={animation.blur ?? false}
                    enabled={animation.header}
                    expand={renderExpand}
                    fade={animation.fade ?? true}
                    id="header"
                  >
                    {currentHeader}
                  </AnimationWrapper>
                )}
              </div>
            )}
            <div className={cx(styles.body, classNames?.body)} style={customStyles?.body}>
              {animation === false || animation === undefined ? (
                currentChildren
              ) : (
                <AnimationWrapper
                  blur={animation.blur ?? false}
                  enabled={animation.body}
                  expand={renderExpand}
                  fade={animation.fade ?? true}
                  id="body"
                >
                  {currentChildren}
                </AnimationWrapper>
              )}
            </div>
            {currentFooter && (
              <div className={cx(styles.footer, classNames?.footer)} style={customStyles?.footer}>
                {animation === false || animation === undefined ? (
                  currentFooter
                ) : (
                  <AnimationWrapper
                    blur={animation.blur ?? false}
                    enabled={animation.footer}
                    expand={renderExpand}
                    fade={animation.fade ?? true}
                    id="footer"
                  >
                    {currentFooter}
                  </AnimationWrapper>
                )}
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
