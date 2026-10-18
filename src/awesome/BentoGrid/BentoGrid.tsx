'use client';

import clsx from 'clsx';
import { type CSSProperties, memo } from 'react';

import { styleProps } from '@/styles/stylex/props';

import { awesomeBentoGridClasses } from './stable';
import { styles } from './style';
import type { BentoGridProps } from './type';

const BentoGrid = memo<BentoGridProps>(({ className, columns, rowHeight, style, ...rest }) => (
  <div
    {...styleProps(styles.grid, clsx(awesomeBentoGridClasses(), className), {
      ...(columns === undefined ? undefined : { '--bento-columns': columns }),
      ...(rowHeight === undefined ? undefined : { '--bento-row-height': `${rowHeight}px` }),
      ...style,
    } as CSSProperties)}
    {...rest}
  />
));

BentoGrid.displayName = 'BentoGrid';

export default BentoGrid;
