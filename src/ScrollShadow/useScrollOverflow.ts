import { type RefObject, useEffect, useRef, useState } from 'react';

interface ScrollState {
  bottom: boolean;
  left: boolean;
  right: boolean;
  top: boolean;
}

const initialScrollState: ScrollState = {
  bottom: false,
  left: false,
  right: false,
  top: false,
};

const isSameScrollState = (a: ScrollState, b: ScrollState) =>
  a.bottom === b.bottom && a.left === b.left && a.right === b.right && a.top === b.top;

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
  const [scrollState, setScrollState] = useState(initialScrollState);
  const scrollStateRef = useRef(initialScrollState);

  useEffect(() => {
    const element = domRef.current;
    if (!element || !isEnabled) return;

    const checkScroll = () => {
      const newState = { ...initialScrollState };

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

      if (isSameScrollState(scrollStateRef.current, newState)) return;

      scrollStateRef.current = newState;
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
  }, [domRef, offset, orientation, isEnabled, ...updateDeps]);

  return scrollState;
};
