import { memo, useEffect, useRef, useState } from 'react';

import { DivProps } from '@/types';

import { useStyles } from './style';

const useMouseOffset = (): any => {
  const [offset, setOffset] = useState<{ x: number; y: number }>();
  const [outside, setOutside] = useState(true);
  const reference = useRef<HTMLDivElement>();

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

export interface SpotlightProps extends DivProps {
  /**
   * @description The size of the spotlight circle
   * @default 64
   */
  size?: number;
}

const Spotlight = memo<SpotlightProps>(({ className, size = 64, ...properties }) => {
  const [offset, outside, reference] = useMouseOffset();
  const { styles, cx } = useStyles({ offset, outside, size });

  return <div className={cx(styles, className)} ref={reference} {...properties} />;
});

export default Spotlight;
