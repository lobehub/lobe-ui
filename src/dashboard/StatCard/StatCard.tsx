'use client';

import { cx } from 'antd-style';

import MetricCell from '../MetricStrip/MetricCell';
import { styles as metricStyles } from '../MetricStrip/style';
import { useSurfaceCardClassName } from '../Surface/link';
import { styles as surfaceStyles } from '../Surface/style';
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
  const cardClassName = useSurfaceCardClassName();

  return (
    <div className={cx(metricStyles.card, cardClassName, surfaceStyles.clip, className)}>
      <MetricCell
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
