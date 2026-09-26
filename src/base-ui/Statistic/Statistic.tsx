'use client';

import { cx } from 'antd-style';
import { memo } from 'react';

import Skeleton from '@/base-ui/Skeleton';

import { formatStatisticValue } from './formatValue';
import { styles } from './style';
import type { StatisticProps } from './type';

const Statistic = memo<StatisticProps>(
  ({
    className,
    classNames,
    formatter,
    loading = false,
    precision,
    prefix,
    ref,
    styles: customStyles,
    suffix,
    title,
    value,
    ...rest
  }) => {
    return (
      <div className={cx(styles.root, className)} ref={ref} {...rest}>
        {title != null && (
          <div className={cx(styles.title, classNames?.title)} style={customStyles?.title}>
            {title}
          </div>
        )}
        {loading ? (
          <Skeleton height={30} width={96} />
        ) : (
          <div className={cx(styles.value, classNames?.value)} style={customStyles?.value}>
            {prefix != null && <span className={styles.affix}>{prefix}</span>}
            <span>{formatter ? formatter(value) : formatStatisticValue(value, precision)}</span>
            {suffix != null && <span className={styles.affix}>{suffix}</span>}
          </div>
        )}
      </div>
    );
  },
);

Statistic.displayName = 'Statistic';

export default Statistic;
