import { memo, useEffect, useRef, useState } from 'react';

import { DivProps } from '@/types';

import { useStyles } from './style';

const useMouseOffset = (): any => {
  const [offset, setOffset] = useState<{ x: number; y: number }>();
  const [outside, setOutside] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.parentElement) {
      const el = ref.current.parentElement;

      // debounce?
      const onMouseMove = (e: MouseEvent) => {
        const bound = el.getBoundingClientRect();
        setOffset({ x: e.clientX - bound.x, y: e.clientY - bound.y });
        setOutside(false);
      };

      const onMouseLeave = () => {
        setOutside(true);
      };
      el.addEventListener('mousemove', onMouseMove);
      el.addEventListener('mouseleave', onMouseLeave);
      return () => {
        el.removeEventListener('mousemove', onMouseMove);
        el.removeEventListener('mouseleave', onMouseLeave);
      };
    }
  }, []);

  return [offset, outside, ref] as const;
};

export interface SpotlightProps extends DivProps {
  size?: number;
}

const Spotlight = memo<SpotlightProps>(({ className, size = 64, ...props }) => {
  const [offset, outside, ref] = useMouseOffset();
  const { styles, cx } = useStyles({ offset, outside, size });

  return <div className={cx(styles, className)} ref={ref} {...props} />;
});

export default Spotlight;
