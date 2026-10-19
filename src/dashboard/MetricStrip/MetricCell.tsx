'use client';

import * as stylex from '@stylexjs/stylex';

import Icon from '@/Icon';
import Skeleton from '@/Skeleton';
import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { useSurfaceLink } from '../Surface/link';
import type { SurfaceRenderLink } from '../Surface/type';
import { styles } from './style';
import type { MetricItem } from './type';

const deltaStyles = {
  down: styles.deltaDown,
  flat: styles.deltaFlat,
  up: styles.deltaUp,
} as const;

type MetricElement =
  | 'action'
  | 'cell'
  | 'chart'
  | 'delta'
  | 'foot'
  | 'head'
  | 'hint'
  | 'label'
  | 'mark'
  | 'skeleton'
  | 'value';

export type MetricClasses = (element: MetricElement) => string;

const MetricBody = ({
  classes,
  item,
  loading,
}: {
  classes: MetricClasses;
  item: MetricItem;
  loading?: boolean;
}) => (
  <>
    <div {...styleProps(styles.head, classes('head'))}>
      <div {...stylex.props(styles.headCopy)}>
        <div {...styleProps(styles.label, classes('label'))}>{item.label}</div>
      </div>
      {item.action ? (
        <div {...styleProps(styles.headAction, classes('action'))}>{item.action}</div>
      ) : null}
      {item.mark ? (
        <span aria-hidden {...styleProps(styles.mark, classes('mark'))}>
          <Icon icon={item.mark} size={14} />
        </span>
      ) : null}
    </div>
    {loading ? (
      <Skeleton className={classes('skeleton')} height={28} radius={6} width={88} />
    ) : (
      <div
        {...styleProps(
          [
            styles.value,
            item.valueTone === 'danger' && styles.valueDanger,
            item.valueTone === 'warning' && styles.valueWarning,
          ],
          classes('value'),
        )}
        {...toDataAttributes({ tone: item.valueTone })}
      >
        {item.value}
      </div>
    )}
    {!loading && (item.delta || item.hint) ? (
      <div {...styleProps(styles.foot, classes('foot'))}>
        {item.delta ? (
          <span
            {...styleProps([styles.delta, deltaStyles[item.direction ?? 'flat']], classes('delta'))}
            {...toDataAttributes({ direction: item.direction ?? 'flat' })}
          >
            {item.delta}
          </span>
        ) : null}
        {item.hint ? <span {...styleProps(styles.hint, classes('hint'))}>{item.hint}</span> : null}
      </div>
    ) : null}
    {!loading && item.chart ? (
      <div {...styleProps(styles.chart, classes('chart'))}>{item.chart}</div>
    ) : null}
  </>
);

export interface MetricCellProps {
  classes: MetricClasses;
  item: MetricItem;
  loading?: boolean;
  renderLink?: SurfaceRenderLink;
  /** Draw the joined-strip divider on the trailing and bottom edges. */
  seam?: boolean;
}

/** One metric: label row, figure, delta and hint. Shared by MetricStrip and StatCard. */
const MetricCell = ({ classes, item, loading, renderLink, seam = false }: MetricCellProps) => {
  const link = useSurfaceLink(renderLink);
  const body = <MetricBody classes={classes} item={item} loading={item.loading ?? loading} />;
  const cell = [styles.cell, seam && styles.cellSeam];

  if (item.href) {
    return (
      <div {...stylex.props(styles.slot)}>
        {link({
          children: body,
          className: styleProps([cell, styles.link], classes('cell')).className,
          href: item.href,
        })}
      </div>
    );
  }
  if (item.onClick) {
    return (
      <button
        type="button"
        onClick={item.onClick}
        {...styleProps([cell, styles.press], classes('cell'))}
      >
        {body}
      </button>
    );
  }
  return <div {...styleProps(cell, classes('cell'))}>{body}</div>;
};

export default MetricCell;
