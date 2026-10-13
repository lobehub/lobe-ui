'use client';

import { cx } from 'antd-style';

import Skeleton from '@/base-ui/Skeleton';

import { useSurfaceLink } from '../Surface/link';
import { styles as surfaceStyles } from '../Surface/style';
import Surface from '../Surface/Surface';
import { styles } from './style';
import type { MetricItem, MetricStripProps } from './type';

const deltaClass = {
  down: styles.deltaDown,
  flat: styles.deltaFlat,
  up: styles.deltaUp,
} as const;

const MetricBody = ({ item, loading }: { item: MetricItem; loading?: boolean }) => (
  <>
    <div className={styles.label}>{item.label}</div>
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
  </>
);

/** One card, divided into metrics. Peer numbers share a surface instead of a row of equal cards. */
const MetricStrip = ({ items, loading, renderLink }: MetricStripProps) => {
  const link = useSurfaceLink(renderLink);

  return (
    <Surface className={surfaceStyles.clip}>
      <div className={styles.frame}>
        <div className={styles.grid}>
          {items.map((item, index) => {
            const body = <MetricBody item={item} loading={item.loading ?? loading} />;
            if (item.href) {
              return (
                <div className={styles.slot} key={`${index}:${item.href}`}>
                  {link({
                    children: body,
                    className: cx(styles.cell, styles.link),
                    href: item.href,
                  })}
                </div>
              );
            }
            if (item.onClick) {
              return (
                <button
                  className={cx(styles.cell, styles.press)}
                  key={index}
                  type="button"
                  onClick={item.onClick}
                >
                  {body}
                </button>
              );
            }
            return (
              <div className={styles.cell} key={index}>
                {body}
              </div>
            );
          })}
        </div>
      </div>
    </Surface>
  );
};

MetricStrip.displayName = 'MetricStrip';

export default MetricStrip;
