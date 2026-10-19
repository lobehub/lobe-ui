'use client';

import clsx from 'clsx';
import { memo } from 'react';

import { SkeletonImpl } from '@/Skeleton/Skeleton';
import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { formatStatisticValue } from './formatValue';
import { statisticClasses } from './stable';
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
    style,
    suffix,
    title,
    value,
    ...rest
  }) => {
    return (
      <div
        ref={ref}
        {...toDataAttributes({ loading })}
        {...rest}
        {...styleProps(styles.root, clsx(statisticClasses(), className), style)}
      >
        {title != null && (
          <div
            {...styleProps(
              styles.title,
              clsx(statisticClasses('title'), classNames?.title),
              customStyles?.title,
            )}
          >
            {title}
          </div>
        )}
        {loading ? (
          <SkeletonImpl className={statisticClasses('skeleton')} xstyle={styles.skeleton} />
        ) : (
          <div
            {...styleProps(
              styles.value,
              clsx(statisticClasses('value'), classNames?.value),
              customStyles?.value,
            )}
          >
            {prefix != null && (
              <span {...styleProps(styles.affix, statisticClasses('prefix'))}>{prefix}</span>
            )}
            <span className={statisticClasses('number')}>
              {formatter ? formatter(value) : formatStatisticValue(value, precision)}
            </span>
            {suffix != null && (
              <span {...styleProps(styles.affix, statisticClasses('suffix'))}>{suffix}</span>
            )}
          </div>
        )}
      </div>
    );
  },
);

Statistic.displayName = 'Statistic';

export default Statistic;
