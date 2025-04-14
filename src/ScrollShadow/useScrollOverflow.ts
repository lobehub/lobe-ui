import { RefObject, useEffect, useState } from 'react';

interface UseScrollOverflowProps {
  domRef: RefObject<HTMLElement | null>;
  isEnabled?: boolean;
  offset?: number;
  onVisibilityChange?: (visibility: {
    bottom?: boolean;
    left?: boolean;
    right?: boolean;
    top?: boolean;
  }) => void;
  orientation?: 'vertical' | 'horizontal';
  updateDeps?: any[];
}

export const useScrollOverflow = ({
  domRef,
  offset = 0,
  orientation = 'vertical',
  isEnabled = true,
  onVisibilityChange,
  updateDeps = [],
}: UseScrollOverflowProps) => {
  const [scrollState, setScrollState] = useState({
    bottom: false,
    left: false,
    right: false,
    top: false,
  });

  useEffect(() => {
    const element = domRef.current;
    if (!element || !isEnabled) return;

    const checkScroll = () => {
      const newState = { ...scrollState };

      if (orientation === 'vertical') {
        const hasVerticalScroll = element.scrollHeight > element.clientHeight;

        if (hasVerticalScroll) {
          newState.top = element.scrollTop > offset;
          newState.bottom =
            element.scrollTop + element.clientHeight < element.scrollHeight - offset;
        } else {
          newState.top = false;
          newState.bottom = false;
        }
      } else {
        const hasHorizontalScroll = element.scrollWidth > element.clientWidth;

        if (hasHorizontalScroll) {
          newState.left = element.scrollLeft > offset;
          newState.right = element.scrollLeft + element.clientWidth < element.scrollWidth - offset;
        } else {
          newState.left = false;
          newState.right = false;
        }
      }

      setScrollState(newState);
      onVisibilityChange?.(newState);
    };

    // 初始检查
    checkScroll();

    // 监听滚动事件
    element.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    // 观察内容变化
    const resizeObserver = new ResizeObserver(checkScroll);
    resizeObserver.observe(element);

    return () => {
      element.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
      resizeObserver.disconnect();
    };
  }, [domRef, offset, orientation, isEnabled, onVisibilityChange, ...updateDeps]);

  return scrollState;
};
