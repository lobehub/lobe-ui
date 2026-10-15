'use client';

import * as stylex from '@stylexjs/stylex';

import { styleProps } from '@/styles/stylex/props';

import { styles } from './style';
import type { ChartGridProps } from './type';

/** Peer charts and ranked lists, two-up, one column below 640px. Not for label/value rows. */
const ChartGrid = ({ children, className }: ChartGridProps) => (
  <div {...stylex.props(styles.frame)}>
    <div {...styleProps(styles.root, className)}>{children}</div>
  </div>
);

ChartGrid.displayName = 'ChartGrid';

export default ChartGrid;
