'use client';

import { memo } from 'react';

import { Flexbox } from '@/Flex';

import { useStyles } from './style';
import type { GridProps } from './type';

const Grid = memo<GridProps>(
  ({ className, gap = '1em', rows = 3, children, maxItemWidth = 240, ref, ...rest }) => {
    const { cx, styles } = useStyles({ gap, maxItemWidth, rows });
    return (
      <Flexbox className={cx(styles, className)} gap={gap as any} ref={ref} {...rest}>
        {children}
      </Flexbox>
    );
  },
);

Grid.displayName = 'Grid';

export default Grid;
