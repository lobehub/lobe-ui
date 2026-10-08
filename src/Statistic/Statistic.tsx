'use client';

import * as stylex from '@stylexjs/stylex';
import { memo } from 'react';

import Skeleton from '@/Skeleton';
import { styleProps } from '@/styles/stylex/props';

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
    style,
    suffix,
    title,
    value,
    ...rest
  }) => {
    return (
      <div ref={ref} {...rest} {...styleProps(styles.root, className, style)}>
        {title != null && (
          <div {...styleProps(styles.title, classNames?.title, customStyles?.title)}>{title}</div>
        )}
        {loading ? (
          <Skeleton height={30} width={96} />
        ) : (
          <div {...styleProps(styles.value, classNames?.value, customStyles?.value)}>
            {prefix != null && <span {...stylex.props(styles.affix)}>{prefix}</span>}
            <span>{formatter ? formatter(value) : formatStatisticValue(value, precision)}</span>
            {suffix != null && <span {...stylex.props(styles.affix)}>{suffix}</span>}
          </div>
        )}
      </div>
    );
  },
);

Statistic.displayName = 'Statistic';

export default Statistic;
