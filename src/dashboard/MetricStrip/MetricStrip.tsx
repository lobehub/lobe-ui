'use client';

import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import type { CSSProperties } from 'react';

import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { useSurfaceCardStyles } from '../Surface/link';
import { styles as surfaceStyles } from '../Surface/style';
import Surface from '../Surface/Surface';
import A2uiMetricStrip from './A2uiMetricStrip';
import MetricCell from './MetricCell';
import { dashboardMetricStripClasses } from './stable';
import { styles } from './style';
import type { MetricStripProps } from './type';

/**
 * Peer metrics. `joined` shares one card divided into cells; `split` gives each item its own card,
 * identical to StatCard; `a2ui` is the A2UI playground StatGroup.
 */
const MetricStrip = ({ variant = 'joined', ...props }: MetricStripProps) =>
  variant === 'a2ui' ? (
    <A2uiMetricStrip {...props} />
  ) : (
    <DefaultMetricStrip {...props} variant={variant} />
  );

const DefaultMetricStrip = ({
  className,
  columns,
  items,
  loading,
  renderLink,
  size = 'default',
  variant = 'joined',
}: MetricStripProps) => {
  const cardStyles = useSurfaceCardStyles();
  const fixed = columns !== undefined && columns > 0;
  const columnStyle = fixed
    ? ({ '--metric-columns': Math.floor(columns) } as CSSProperties)
    : undefined;
  const dataAttributes = toDataAttributes({ size: size === 'default' ? undefined : size, variant });

  if (variant === 'split') {
    return (
      <div
        {...styleProps(
          [styles.split, fixed && styles.columnsFixed],
          clsx(dashboardMetricStripClasses(), className),
          columnStyle,
        )}
        {...dataAttributes}
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
              size={size}
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
      {...dataAttributes}
    >
      <div {...styleProps(styles.frame, dashboardMetricStripClasses('frame'))}>
        <div
          {...styleProps(
            [styles.grid, fixed && styles.columnsFixed],
            dashboardMetricStripClasses('grid'),
            columnStyle,
          )}
        >
          {items.map((item, index) => (
            <MetricCell
              seam
              classes={dashboardMetricStripClasses}
              item={item}
              key={index}
              loading={loading}
              renderLink={renderLink}
              size={size}
            />
          ))}
        </div>
      </div>
    </Surface>
  );
};

MetricStrip.displayName = 'MetricStrip';

export default MetricStrip;
