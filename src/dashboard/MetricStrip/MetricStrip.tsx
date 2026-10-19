'use client';

import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';

import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { useSurfaceCardStyles } from '../Surface/link';
import { styles as surfaceStyles } from '../Surface/style';
import Surface from '../Surface/Surface';
import MetricCell from './MetricCell';
import { dashboardMetricStripClasses } from './stable';
import { styles } from './style';
import type { MetricStripProps } from './type';

/**
 * Peer metrics. `joined` shares one card divided into cells; `split` gives each item its own card,
 * identical to StatCard.
 */
const MetricStrip = ({
  className,
  items,
  loading,
  renderLink,
  variant = 'joined',
}: MetricStripProps) => {
  const cardStyles = useSurfaceCardStyles();

  if (variant === 'split') {
    return (
      <div
        {...styleProps(styles.split, clsx(dashboardMetricStripClasses(), className))}
        {...toDataAttributes({ variant })}
      >
        {items.map((item, index) => (
          <div
            key={index}
            {...styleProps(
              [styles.card, cardStyles, surfaceStyles.clip],
              dashboardMetricStripClasses('card'),
            )}
          >
            <MetricCell
              classes={dashboardMetricStripClasses}
              item={item}
              loading={loading}
              renderLink={renderLink}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <Surface
      className={clsx(
        dashboardMetricStripClasses(),
        stylex.props(surfaceStyles.clip).className,
        className,
      )}
      {...toDataAttributes({ variant })}
    >
      <div {...styleProps(styles.frame, dashboardMetricStripClasses('frame'))}>
        <div {...styleProps(styles.grid, dashboardMetricStripClasses('grid'))}>
          {items.map((item, index) => (
            <MetricCell
              seam
              classes={dashboardMetricStripClasses}
              item={item}
              key={index}
              loading={loading}
              renderLink={renderLink}
            />
          ))}
        </div>
      </div>
    </Surface>
  );
};

MetricStrip.displayName = 'MetricStrip';

export default MetricStrip;
