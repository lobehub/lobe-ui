'use client';

import clsx from 'clsx';

import Icon from '@/Icon';
import { a2uiStyles, a2uiToneSoft, a2uiToneText } from '@/internal/a2ui/styles';
import Skeleton from '@/Skeleton';
import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { A2uiDelta, A2uiKpiValue } from '../MetricStrip/a2ui';
import { a2uiMetricStyles as styles } from '../MetricStrip/a2uiStyle';
import { useSurfaceLink } from '../Surface/link';
import { dashboardStatCardClasses as classes } from './stable';
import type { StatCardProps } from './type';

const TONE = { danger: 'negative', warning: 'warning' } as const;

/** `variant="a2ui"`: adapted from CopilotKit a2ui-playground (MIT), the `Stat` renderer. */
const A2uiStatCard = ({
  action,
  chart,
  className,
  delta,
  direction,
  hint,
  href,
  label,
  loading,
  mark,
  onClick,
  renderLink,
  value,
  valueTone,
}: StatCardProps) => {
  const link = useSurfaceLink(renderLink);
  const tone = valueTone ? TONE[valueTone] : undefined;

  const body = (
    <>
      <div {...styleProps(styles.head, classes('head'))}>
        <span {...styleProps(styles.label, classes('label'))}>{label}</span>
        {action ? <div className={classes('action')}>{action}</div> : null}
        {mark ? (
          <span
            aria-hidden
            {...styleProps(
              [styles.icon, tone ? a2uiToneSoft[tone] : styles.iconDefault],
              classes('mark'),
            )}
          >
            <Icon icon={mark} size={14} />
          </span>
        ) : null}
      </div>
      {loading ? (
        <Skeleton className={classes('skeleton')} height={28} radius={6} width={88} />
      ) : (
        <div {...styleProps(styles.valueRow, classes('foot'))}>
          <A2uiKpiValue
            className={clsx(classes('value'), tone && styleProps(a2uiToneText[tone]).className)}
            max={26}
            value={value}
          />
          <A2uiDelta className={classes('delta')} delta={delta} direction={direction} />
        </div>
      )}
      {!loading && hint ? (
        <span {...styleProps(styles.caption, classes('hint'))}>{hint}</span>
      ) : null}
      {!loading && chart ? (
        <div {...styleProps(styles.chart, classes('chart'))}>{chart}</div>
      ) : null}
    </>
  );

  const rootClassName = styleProps(
    [a2uiStyles.base, a2uiStyles.card, styles.statRoot, !href && onClick && styles.press],
    clsx(classes(), className),
  ).className;
  const data = toDataAttributes({ direction, tone: valueTone, variant: 'a2ui' });

  if (href) return <div {...data}>{link({ children: body, className: rootClassName, href })}</div>;
  if (onClick)
    return (
      <button className={rootClassName} type="button" onClick={onClick} {...data}>
        {body}
      </button>
    );
  return (
    <div className={rootClassName} {...data}>
      {body}
    </div>
  );
};

export default A2uiStatCard;
