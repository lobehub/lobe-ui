import { useEffect, useState } from 'react';

type ScrollTargetValue = Element | Document | null | undefined;

export type ScrollTarget =
  ScrollTargetValue | (() => ScrollTargetValue) | { current: ScrollTargetValue };

export interface ScrollPosition {
  left: number;
  top: number;
}

const resolveTarget = (target: ScrollTarget): ScrollTargetValue => {
  if (typeof target === 'function') return target();
  if (target && 'current' in target) return target.current;
  return target;
};

const readPosition = (element: Element | Document): ScrollPosition => {
  const scroller =
    element instanceof Document ? (element.scrollingElement ?? element.documentElement) : element;
  return { left: scroller.scrollLeft, top: scroller.scrollTop };
};

export const useScroll = (target: ScrollTarget): ScrollPosition | undefined => {
  const [position, setPosition] = useState<ScrollPosition>();

  useEffect(() => {
    const element = resolveTarget(target);
    if (!element) return;
    const update = () => {
      const next = readPosition(element);
      setPosition((prev) =>
        prev && prev.left === next.left && prev.top === next.top ? prev : next,
      );
    };
    update();
    element.addEventListener('scroll', update, { passive: true });
    return () => element.removeEventListener('scroll', update);
  }, [target]);

  return position;
};
