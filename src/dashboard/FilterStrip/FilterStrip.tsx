'use client';

import * as stylex from '@stylexjs/stylex';

import Skeleton from '@/Skeleton';

import { styles as surfaceStyles } from '../Surface/style';
import Surface from '../Surface/Surface';
import { styles } from './style';
import type { FilterStripProps } from './type';

const countStyles = {
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
  <Surface className={stylex.props(surfaceStyles.clip).className}>
    <div aria-label={label} role="radiogroup" {...stylex.props(styles.frame)}>
      <div {...stylex.props(styles.grid)}>
        {items.map((item) => {
          const active = item.key === value;
          const missing = item.count === undefined || item.count === null;
          const emphasize = item.tone && typeof item.count === 'number' && item.count > 0;

          return (
            <button
              aria-checked={active}
              key={item.key}
              role="radio"
              title={item.hint}
              type="button"
              onClick={() => onChange(item.key)}
              {...stylex.props(styles.cell, active && styles.cellActive)}
            >
              <span {...stylex.props(styles.label, active && styles.labelActive)}>
                {item.label}
              </span>
              <span {...stylex.props(styles.count, emphasize && countStyles[item.tone!])}>
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
