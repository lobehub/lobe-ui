'use client';

import { cx } from 'antd-style';

import Skeleton from '@/base-ui/Skeleton';

import Surface from '../Surface/Surface';
import { styles } from './style';
import type { FilterStripProps } from './type';

const countClass = {
  danger: styles.countDanger,
  warning: styles.countWarning,
} as const;

const integerFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

export const formatInteger = (count: number) => integerFormat.format(count);

/** One surface of selectable counts. Peer filters share a seam instead of a row of equal cards. */
const FilterStrip = ({
  emptyText = '--',
  formatCount = formatInteger,
  items,
  label,
  onChange,
  value,
}: FilterStripProps) => (
  <Surface>
    <div aria-label={label} className={styles.frame} role="radiogroup">
      <div className={styles.grid}>
        {items.map((item) => {
          const active = item.key === value;
          const missing = item.count === undefined || item.count === null;
          const emphasize = item.tone && typeof item.count === 'number' && item.count > 0;

          return (
            <button
              aria-checked={active}
              className={cx(styles.cell, active && styles.cellActive)}
              key={item.key}
              role="radio"
              title={item.hint}
              type="button"
              onClick={() => onChange(item.key)}
            >
              <span className={cx(styles.label, active && styles.labelActive)}>{item.label}</span>
              <span className={cx(styles.count, emphasize && countClass[item.tone!])}>
                {item.loading ? (
                  <Skeleton height={22} radius={6} width={48} />
                ) : missing ? (
                  emptyText
                ) : (
                  formatCount(item.count!)
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  </Surface>
);

FilterStrip.displayName = 'FilterStrip';

export default FilterStrip;
