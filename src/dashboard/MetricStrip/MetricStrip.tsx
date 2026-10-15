'use client';

import * as stylex from '@stylexjs/stylex';

import { useSurfaceCardStyles } from '../Surface/link';
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
  const cardStyles = useSurfaceCardStyles();

  if (variant === 'split') {
    return (
      <div {...stylex.props(styles.split)}>
        {items.map((item, index) => (
          <div key={index} {...stylex.props(styles.card, cardStyles, surfaceStyles.clip)}>
            <MetricCell item={item} loading={loading} renderLink={renderLink} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <Surface className={stylex.props(surfaceStyles.clip).className}>
      <div {...stylex.props(styles.frame)}>
        <div {...stylex.props(styles.grid)}>
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
