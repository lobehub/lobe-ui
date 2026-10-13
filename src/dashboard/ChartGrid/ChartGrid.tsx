'use client';

import { cx } from 'antd-style';

import { styles } from './style';
import type { ChartGridProps } from './type';

/** Peer charts and ranked lists, two-up, one column below 640px. Not for label/value rows. */
const ChartGrid = ({ children, className }: ChartGridProps) => (
  <div className={styles.frame}>
    <div className={cx(styles.root, className)}>{children}</div>
  </div>
);

ChartGrid.displayName = 'ChartGrid';

export default ChartGrid;
