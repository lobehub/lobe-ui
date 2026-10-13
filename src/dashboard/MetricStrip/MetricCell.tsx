'use client';

import { cx } from 'antd-style';

import Skeleton from '@/base-ui/Skeleton';
import Icon from '@/Icon';

import { useSurfaceLink } from '../Surface/link';
import type { SurfaceRenderLink } from '../Surface/type';
import { styles } from './style';
import type { MetricItem } from './type';

const deltaClass = {
  down: styles.deltaDown,
  flat: styles.deltaFlat,
  up: styles.deltaUp,
} as const;

const MetricBody = ({ item, loading }: { item: MetricItem; loading?: boolean }) => (
  <>
    <div className={styles.head}>
      <div className={styles.headCopy}>
        <div className={styles.label}>{item.label}</div>
      </div>
      {item.action ? <div className={styles.headAction}>{item.action}</div> : null}
      {item.mark ? (
        <span aria-hidden className={styles.mark}>
          <Icon icon={item.mark} size={14} />
        </span>
      ) : null}
    </div>
    {loading ? (
      <Skeleton height={28} radius={6} width={88} />
    ) : (
      <div
        className={cx(
          styles.value,
          item.valueTone === 'danger' && styles.valueDanger,
          item.valueTone === 'warning' && styles.valueWarning,
        )}
      >
        {item.value}
      </div>
    )}
    {!loading && (item.delta || item.hint) ? (
      <div className={styles.foot}>
        {item.delta ? (
          <span className={cx(styles.delta, deltaClass[item.direction ?? 'flat'])}>
            {item.delta}
          </span>
        ) : null}
        {item.hint ? <span className={styles.hint}>{item.hint}</span> : null}
      </div>
    ) : null}
    {!loading && item.chart ? <div className={styles.chart}>{item.chart}</div> : null}
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
  const cell = cx(styles.cell, seam && styles.cellSeam);

  if (item.href) {
    return (
      <div className={styles.slot}>
        {link({ children: body, className: cx(cell, styles.link), href: item.href })}
      </div>
    );
  }
  if (item.onClick) {
    return (
      <button className={cx(cell, styles.press)} type="button" onClick={item.onClick}>
        {body}
      </button>
    );
  }
  return <div className={cell}>{body}</div>;
};

export default MetricCell;
