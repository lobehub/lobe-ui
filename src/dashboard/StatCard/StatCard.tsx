'use client';

import clsx from 'clsx';

import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import MetricCell from '../MetricStrip/MetricCell';
import { styles as metricStyles } from '../MetricStrip/style';
import { useSurfaceCardStyles } from '../Surface/link';
import { styles as surfaceStyles } from '../Surface/style';
import { dashboardStatCardClasses } from './stable';
import type { StatCardProps } from './type';

/** One metric in its own card: the same item as a `split` MetricStrip. */
function StatCard({
  action,
  chart,
  className,
  delta,
  direction = 'flat',
  hint,
  href,
  label,
  loading,
  mark,
  onClick,
  renderLink,
  value,
  valueTone,
}: StatCardProps) {
  const cardStyles = useSurfaceCardStyles();

  return (
    <div
      {...styleProps(
        [metricStyles.card, cardStyles, surfaceStyles.clip],
        clsx(dashboardStatCardClasses(), className),
      )}
      {...toDataAttributes({ direction, tone: valueTone })}
    >
      <MetricCell
        classes={dashboardStatCardClasses}
        renderLink={renderLink}
        item={{
          action,
          chart,
          delta,
          direction,
          hint,
          href,
          label,
          loading,
          mark,
          onClick,
          value,
          valueTone,
        }}
      />
    </div>
  );
}

StatCard.displayName = 'StatCard';

export default StatCard;
