'use client';

import { createStyles } from 'antd-style';
import { isString } from 'lodash-es';
import { forwardRef } from 'react';
import { Flexbox, type FlexboxProps } from 'react-layout-kit';

export const useStyles = createStyles(
  (
    { css },
    {
      rows,
      maxItemWidth,
      gap,
    }: { gap: string | number; maxItemWidth: string | number; rows: number },
  ) => {
    return {
      container: css`
        --rows: ${rows};
        --max-item-width: ${isString(maxItemWidth) ? maxItemWidth : `${maxItemWidth}px`};
        --gap: ${isString(gap) ? gap : `${gap}px`};

        display: grid !important;
        grid-template-columns: repeat(
          auto-fill,
          minmax(
            max(var(--max-item-width), calc((100% - var(--gap) * (var(--rows) - 1)) / var(--rows))),
            1fr
          )
        );
      `,
    };
  },
);

export interface GridProps extends Omit<FlexboxProps, 'gap'> {
  gap?: string | number;
  maxItemWidth?: string | number;
  rows?: number;
}

const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ className, gap = '1em', rows = 3, children, maxItemWidth = 240, ...rest }, ref) => {
    const { cx, styles } = useStyles({ gap, maxItemWidth, rows });
    return (
      <Flexbox className={cx(styles.container, className)} gap={gap as any} ref={ref} {...rest}>
        {children}
      </Flexbox>
    );
  },
);

export default Grid;
