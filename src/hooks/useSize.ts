import { type RefObject, useLayoutEffect, useState } from 'react';

export interface ElementSize {
  height: number;
  width: number;
}

export const useSize = (ref: RefObject<Element | null>): ElementSize | undefined => {
  const [size, setSize] = useState<ElementSize>();

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    setSize({ height: element.clientHeight, width: element.clientWidth });

    const observer = new ResizeObserver((entries) => {
      for (const { target } of entries) {
        setSize({ height: target.clientHeight, width: target.clientWidth });
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return size;
};
