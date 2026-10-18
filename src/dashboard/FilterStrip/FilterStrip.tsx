'use client';

import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';

import Skeleton from '@/Skeleton';
import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { styles as surfaceStyles } from '../Surface/style';
import Surface from '../Surface/Surface';
import { dashboardFilterStripClasses } from './stable';
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
  className,
  emptyText = '--',
  formatCount = formatInteger,
  items,
  label,
  onChange,
  value,
}: FilterStripProps) => (
  <Surface
    className={clsx(
      dashboardFilterStripClasses(),
      stylex.props(surfaceStyles.clip).className,
      className,
    )}
  >
    <div
      aria-label={label}
      role="radiogroup"
      {...styleProps(styles.frame, dashboardFilterStripClasses('frame'))}
    >
      <div {...styleProps(styles.grid, dashboardFilterStripClasses('grid'))}>
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
              {...styleProps(
                [styles.cell, active && styles.cellActive],
                dashboardFilterStripClasses('cell'),
              )}
              {...toDataAttributes({ active, tone: item.tone })}
            >
              <span
                {...styleProps(
                  [styles.label, active && styles.labelActive],
                  dashboardFilterStripClasses('label'),
                )}
              >
                {item.label}
              </span>
              <span
                {...styleProps(
                  [styles.count, emphasize && countStyles[item.tone!]],
                  dashboardFilterStripClasses('count'),
                )}
              >
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
