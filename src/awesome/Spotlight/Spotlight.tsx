'use client';

import { memo } from 'react';

import { useStyles } from './style';
import type { SpotlightProps } from './type';
import { useMouseOffset } from './useMouseOffset';

const Spotlight = memo<SpotlightProps>(({ className, size = 64, ...properties }) => {
  const [offset, outside, reference] = useMouseOffset();
  const { styles, cx } = useStyles({ offset, outside, size });

  return <div className={cx(styles, className)} ref={reference} {...properties} />;
});

Spotlight.displayName = 'Spotlight';

export default Spotlight;
