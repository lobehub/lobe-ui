'use client';

import { cx } from 'antd-style';
import { memo } from 'react';

import { styles } from './style';
import type { StatisticProps } from './type';

export const Statistic = memo<StatisticProps>(({ className, ref, title, value, ...rest }) => {
  return (
    <div className={cx(styles.statistic, className)} ref={ref} {...rest}>
      <span className={styles.statisticValue}>{value}</span>
      <span className={styles.statisticTitle}>{title}</span>
    </div>
  );
});

Statistic.displayName = 'Statistic';
