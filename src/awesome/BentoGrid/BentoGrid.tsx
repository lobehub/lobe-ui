'use client';

import { type CSSProperties, memo } from 'react';

import { styleProps } from '@/styles/stylex/props';

import { styles } from './style';
import type { BentoGridProps } from './type';

const BentoGrid = memo<BentoGridProps>(
  ({ className, columns = 4, rowHeight = 120, style, ...rest }) => (
    <div
      {...styleProps(styles.grid, className, {
        '--bento-columns': columns,
        '--bento-row-height': `${rowHeight}px`,
        ...style,
      } as CSSProperties)}
      {...rest}
    />
  ),
);

BentoGrid.displayName = 'BentoGrid';

export default BentoGrid;
