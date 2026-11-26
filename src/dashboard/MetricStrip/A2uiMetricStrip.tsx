'use client';

import clsx from 'clsx';

import { a2uiStyles } from '@/internal/a2ui/styles';
import Skeleton from '@/Skeleton';
import { styleProps } from '@/styles/stylex/props';

import { A2uiDelta, A2uiKpiValue } from './a2ui';
import { a2uiMetricStyles as styles } from './a2uiStyle';
import { dashboardMetricStripClasses as classes } from './stable';
import type { MetricStripProps } from './type';

/** `variant="a2ui"`: adapted from CopilotKit a2ui-playground (MIT), the `StatGroup` renderer. */
const A2uiMetricStrip = ({ className, columns, items, loading }: MetricStripProps) => {
  const fixed = columns !== undefined && columns > 0;
  return (
    <div
      {...styleProps(
        [a2uiStyles.base, a2uiStyles.card, styles.groupRoot],
        clsx(classes(), className),
      )}
      data-variant="a2ui"
    >
      <div
        {...styleProps(
          styles.groupGrid,
          classes('grid'),
          fixed
            ? { gridTemplateColumns: `repeat(${Math.floor(columns)}, minmax(0, 1fr))` }
            : undefined,
        )}
      >
        {items.map((item, index) => (
          <div key={index} {...styleProps(styles.groupCell, classes('cell'))}>
            <div {...styleProps(styles.head, classes('head'))}>
              <span {...styleProps(styles.label, classes('label'))}>{item.label}</span>
              {item.action ? <div className={classes('action')}>{item.action}</div> : null}
            </div>
            {(item.loading ?? loading) ? (
              <Skeleton className={classes('skeleton')} height={24} radius={6} width={72} />
            ) : (
              <>
                <A2uiKpiValue className={classes('value')} max={22} value={item.value} />
                <A2uiDelta
                  className={classes('delta')}
                  delta={item.delta}
                  direction={item.direction}
                />
                {item.hint ? (
                  <span {...styleProps(styles.caption, classes('hint'))}>{item.hint}</span>
                ) : null}
                {item.chart ? (
                  <div {...styleProps(styles.chart, classes('chart'))}>{item.chart}</div>
                ) : null}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default A2uiMetricStrip;
