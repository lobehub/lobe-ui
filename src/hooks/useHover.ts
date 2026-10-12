import { type RefObject, useEffect, useState } from 'react';

export const useHover = (ref: RefObject<Element | null>): boolean => {
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const enter = () => setHovering(true);
    const leave = () => setHovering(false);
    element.addEventListener('mouseenter', enter);
    element.addEventListener('mouseleave', leave);
    return () => {
      element.removeEventListener('mouseenter', enter);
      element.removeEventListener('mouseleave', leave);
    };
  }, [ref]);

  return hovering;
};
