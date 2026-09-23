'use client';

import { cx } from 'antd-style';
import { type CSSProperties, memo } from 'react';

import { styles } from './style';
import type { BentoGridProps } from './type';

const BentoGrid = memo<BentoGridProps>(
  ({ className, columns = 4, rowHeight = 120, style, ...rest }) => (
    <div
      className={cx(styles.grid, className)}
      style={
        {
          '--bento-columns': columns,
          '--bento-row-height': `${rowHeight}px`,
          ...style,
        } as CSSProperties
      }
      {...rest}
    />
  ),
);

BentoGrid.displayName = 'BentoGrid';

export default BentoGrid;
