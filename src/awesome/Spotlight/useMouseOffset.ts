import { useEffect, useRef, useState } from 'react';

export const useMouseOffset = (): any => {
  const [offset, setOffset] = useState<{ x: number; y: number }>();
  const [outside, setOutside] = useState(true);
  const reference = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reference.current && reference.current.parentElement) {
      const element = reference.current.parentElement;

      // debounce?
      const onMouseMove = (e: MouseEvent) => {
        const bound = element.getBoundingClientRect();
        setOffset({ x: e.clientX - bound.x, y: e.clientY - bound.y });
        setOutside(false);
      };

      const onMouseLeave = () => {
        setOutside(true);
      };
      element.addEventListener('mousemove', onMouseMove);
      element.addEventListener('mouseleave', onMouseLeave);
      return () => {
        element.removeEventListener('mousemove', onMouseMove);
        element.removeEventListener('mouseleave', onMouseLeave);
      };
    }
  }, []);

  return [offset, outside, reference] as const;
};
