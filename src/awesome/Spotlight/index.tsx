'use client';

import { memo } from 'react';

import { DivProps } from '@/types';

import { useStyles } from './style';
import { useMouseOffset } from './useMouseOffset';

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

Spotlight.displayName = 'Spotlight';

export default Spotlight;
