'use client';

import { forwardRef } from 'react';
import { Flexbox, type FlexboxProps } from 'react-layout-kit';

import { useStyles } from './style';

export interface GridProps extends Omit<FlexboxProps, 'gap'> {
  gap?: string | number;
  maxItemWidth?: string | number;
  rows?: number;
}

const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ className, gap = '1em', rows = 3, children, maxItemWidth = 240, ...rest }, ref) => {
    const { cx, styles } = useStyles({ gap, maxItemWidth, rows });
    return (
      <Flexbox className={cx(styles, className)} gap={gap as any} ref={ref} {...rest}>
        {children}
      </Flexbox>
    );
  },
);

export default Grid;
