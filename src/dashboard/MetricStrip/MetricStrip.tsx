'use client';

import { cx } from 'antd-style';

import { useSurfaceCardClassName } from '../Surface/link';
import { styles as surfaceStyles } from '../Surface/style';
import Surface from '../Surface/Surface';
import MetricCell from './MetricCell';
import { styles } from './style';
import type { MetricStripProps } from './type';

/**
 * Peer metrics. `joined` shares one card divided into cells; `split` gives each item its own card,
 * identical to StatCard.
 */
const MetricStrip = ({ items, loading, renderLink, variant = 'joined' }: MetricStripProps) => {
  const cardClassName = useSurfaceCardClassName();

  if (variant === 'split') {
    return (
      <div className={styles.split}>
        {items.map((item, index) => (
          <div className={cx(styles.card, cardClassName, surfaceStyles.clip)} key={index}>
            <MetricCell item={item} loading={loading} renderLink={renderLink} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <Surface className={surfaceStyles.clip}>
      <div className={styles.frame}>
        <div className={styles.grid}>
          {items.map((item, index) => (
            <MetricCell seam item={item} key={index} loading={loading} renderLink={renderLink} />
          ))}
        </div>
      </div>
    </Surface>
  );
};

MetricStrip.displayName = 'MetricStrip';

export default MetricStrip;
