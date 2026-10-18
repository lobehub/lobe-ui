'use client';

import clsx from 'clsx';

import { styleProps } from '@/styles/stylex/props';

import { dashboardChartGridClasses } from './stable';
import { styles } from './style';
import type { ChartGridProps } from './type';

/** Peer charts and ranked lists, two-up, one column below 640px. Not for label/value rows. */
const ChartGrid = ({ children, className }: ChartGridProps) => (
  <div {...styleProps(styles.frame, dashboardChartGridClasses())}>
    <div {...styleProps(styles.root, clsx(dashboardChartGridClasses('grid'), className))}>
      {children}
    </div>
  </div>
);

ChartGrid.displayName = 'ChartGrid';

export default ChartGrid;
