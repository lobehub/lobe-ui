'use client';

import * as stylex from '@stylexjs/stylex';

import Icon from '@/Icon';
import Skeleton from '@/Skeleton';

import { useSurfaceLink } from '../Surface/link';
import type { SurfaceRenderLink } from '../Surface/type';
import { styles } from './style';
import type { MetricItem } from './type';

const deltaStyles = {
  down: styles.deltaDown,
  flat: styles.deltaFlat,
  up: styles.deltaUp,
} as const;

const MetricBody = ({ item, loading }: { item: MetricItem; loading?: boolean }) => (
  <>
    <div {...stylex.props(styles.head)}>
      <div {...stylex.props(styles.headCopy)}>
        <div {...stylex.props(styles.label)}>{item.label}</div>
      </div>
      {item.action ? <div {...stylex.props(styles.headAction)}>{item.action}</div> : null}
      {item.mark ? (
        <span aria-hidden {...stylex.props(styles.mark)}>
          <Icon icon={item.mark} size={14} />
        </span>
      ) : null}
    </div>
    {loading ? (
      <Skeleton height={28} radius={6} width={88} />
    ) : (
      <div
        {...stylex.props(
          styles.value,
          item.valueTone === 'danger' && styles.valueDanger,
          item.valueTone === 'warning' && styles.valueWarning,
        )}
      >
        {item.value}
      </div>
    )}
    {!loading && (item.delta || item.hint) ? (
      <div {...stylex.props(styles.foot)}>
        {item.delta ? (
          <span {...stylex.props(styles.delta, deltaStyles[item.direction ?? 'flat'])}>
            {item.delta}
          </span>
        ) : null}
        {item.hint ? <span {...stylex.props(styles.hint)}>{item.hint}</span> : null}
      </div>
    ) : null}
    {!loading && item.chart ? <div {...stylex.props(styles.chart)}>{item.chart}</div> : null}
  </>
);

export interface MetricCellProps {
  item: MetricItem;
  loading?: boolean;
  renderLink?: SurfaceRenderLink;
  /** Draw the joined-strip divider on the trailing and bottom edges. */
  seam?: boolean;
}

/** One metric: label row, figure, delta and hint. Shared by MetricStrip and StatCard. */
const MetricCell = ({ item, loading, renderLink, seam = false }: MetricCellProps) => {
  const link = useSurfaceLink(renderLink);
  const body = <MetricBody item={item} loading={item.loading ?? loading} />;
  const cell = [styles.cell, seam && styles.cellSeam];

  if (item.href) {
    return (
      <div {...stylex.props(styles.slot)}>
        {link({
          children: body,
          className: stylex.props(cell, styles.link).className,
          href: item.href,
        })}
      </div>
    );
  }
  if (item.onClick) {
    return (
      <button type="button" onClick={item.onClick} {...stylex.props(cell, styles.press)}>
        {body}
      </button>
    );
  }
  return <div {...stylex.props(cell)}>{body}</div>;
};

export default MetricCell;
