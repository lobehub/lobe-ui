import { type ReactNode, type RefObject, useEffect, useState } from 'react';

interface EllipsisConfig {
  rows?: number;
  tooltipWhenOverflow?: boolean;
}

export const useTextOverflow = <T extends HTMLElement = HTMLElement>(
  textRef: RefObject<T | null>,
  ellipsis: boolean | EllipsisConfig | undefined,
  children: ReactNode,
) => {
  const [isOverflow, setIsOverflow] = useState(false);

  const tooltipWhenOverflow = typeof ellipsis === 'object' && ellipsis.tooltipWhenOverflow;

  useEffect(() => {
    if (!tooltipWhenOverflow) return;

    const checkOverflow = () => {
      const element = textRef.current;
      if (!element) return;

      const rows = typeof ellipsis === 'object' ? ellipsis.rows : undefined;
      if (rows && rows > 1) {
        setIsOverflow(element.scrollHeight > element.clientHeight);
      } else {
        setIsOverflow(element.scrollWidth > element.clientWidth);
      }
    };

    checkOverflow();

    const resizeObserver = new ResizeObserver(checkOverflow);
    if (textRef.current) {
      resizeObserver.observe(textRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [tooltipWhenOverflow, ellipsis, children, textRef]);

  return isOverflow;
};
