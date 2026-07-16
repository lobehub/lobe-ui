'use client';

import { cx, useThemeMode } from 'antd-style';
import { Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { memo } from 'react';

import Icon from '@/Icon';
import Text from '@/Text';

import { styles, variants } from './style';
import type { StatisticCardProps } from './type';

const formatValue = (value: ReactNode, precision?: number): ReactNode => {
  if (value === undefined || value === null) return '--';
  if (typeof value === 'number' && precision !== undefined) return value.toFixed(precision);
  return value;
};

export const StatisticCard = memo<StatisticCardProps>(
  ({
    className,
    classNames,
    description,
    extra,
    loading,
    precision,
    prefix,
    ref,
    style,
    styles: customStyles,
    suffix,
    title,
    value,
    variant = 'borderless',
    ...rest
  }) => {
    const { isDarkMode } = useThemeMode();

    const showHeader = Boolean(title || extra || loading);

    return (
      <div
        className={cx(variants({ isDarkMode, variant }), classNames?.root, className)}
        ref={ref}
        style={{ ...style, ...customStyles?.root }}
        {...rest}
      >
        {showHeader && (
          <div className={cx(styles.header, classNames?.header)} style={customStyles?.header}>
            <div className={cx(styles.title, classNames?.title)} style={customStyles?.title}>
              {typeof title === 'string' ? (
                <Text
                  as={'h2'}
                  ellipsis={{ rows: 1, tooltip: true }}
                  style={{
                    color: 'inherit',
                    fontSize: 'inherit',
                    fontWeight: 'inherit',
                    lineHeight: 'inherit',
                    margin: 0,
                    overflow: 'hidden',
                  }}
                >
                  {title}
                </Text>
              ) : (
                title
              )}
            </div>
            {(loading || extra) && (
              <div className={cx(styles.extra, classNames?.extra)} style={customStyles?.extra}>
                {loading ? <Icon spin icon={Loader2} size={16} /> : extra}
              </div>
            )}
          </div>
        )}
        <div className={cx(styles.content, classNames?.content)} style={customStyles?.content}>
          <div className={cx(styles.value, classNames?.value)} style={customStyles?.value}>
            {prefix}
            <span>{formatValue(value, precision)}</span>
            {suffix}
          </div>
          {description && (
            <div
              className={cx(styles.description, classNames?.description)}
              style={customStyles?.description}
            >
              {description}
            </div>
          )}
        </div>
      </div>
    );
  },
);

StatisticCard.displayName = 'StatisticCard';
