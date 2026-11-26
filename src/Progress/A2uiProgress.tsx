'use client';

import clsx from 'clsx';
import type { ReactNode } from 'react';

import progressMessages from '@/i18n/resources/en/progress';
import { useTranslation } from '@/i18n/useTranslation';
import { a2uiStyles } from '@/internal/a2ui/styles';
import { styleProps } from '@/styles/stylex/props';

import { styles, toneColor } from './a2uiStyle';
import { progressClasses } from './stable';
import type { ProgressProps } from './type';

type A2uiProgressProps = Omit<ProgressProps, 'percent' | 'segments' | 'variant'> & {
  clamped: number;
  info: ReactNode;
  rootProps: Record<string, unknown>;
};

/**
 * `variant="a2ui"`: the A2UI playground `Progress` (line) and `RadialProgress` (circle card).
 * Adapted from CopilotKit a2ui-playground (MIT), renderers/data.tsx.
 */
const A2uiProgress = ({
  caption,
  className,
  clamped,
  info,
  label,
  rootProps,
  showInfo = true,
  size,
  status = 'normal',
  strokeColor,
  style,
  type,
}: A2uiProgressProps) => {
  const { t } = useTranslation(progressMessages);
  const color = strokeColor ?? toneColor[status];
  const rootClassName = clsx(progressClasses(), className);

  if (type === 'circle') {
    const diameter = typeof size === 'number' ? size : 76;
    const stroke = typeof size === 'number' ? Math.max(2, Math.round((diameter * 7) / 76)) : 7;
    const radius = (diameter - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const sideCaption =
      caption ??
      t('progress.a2uiCaption')
        .replace('{value}', String(Math.round(clamped)))
        .replace('{total}', '100');

    return (
      <div
        {...styleProps([a2uiStyles.base, a2uiStyles.card, styles.card], rootClassName, style)}
        {...rootProps}
      >
        <div
          {...styleProps(styles.ring, progressClasses('track'), {
            height: diameter,
            width: diameter,
          })}
        >
          <svg
            aria-hidden="true"
            {...styleProps(styles.ringSvg)}
            height={diameter}
            viewBox={`0 0 ${diameter} ${diameter}`}
            width={diameter}
          >
            <circle
              {...styleProps(styles.ringTrack)}
              cx={diameter / 2}
              cy={diameter / 2}
              r={radius}
              strokeWidth={stroke}
            />
            <circle
              {...styleProps(styles.ringBar, progressClasses('bar'), {
                filter: `drop-shadow(0 0 6px color-mix(in oklch, ${color} 35%, transparent))`,
              })}
              cx={diameter / 2}
              cy={diameter / 2}
              r={radius}
              stroke={color}
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - clamped / 100)}
              strokeLinecap="round"
              strokeWidth={stroke}
            />
          </svg>
          {showInfo && (
            <div {...styleProps(styles.ringCenter)}>
              <span {...styleProps(styles.ringValue, progressClasses('info'))}>{info}</span>
            </div>
          )}
        </div>
        {(label != null || sideCaption) && (
          <div {...styleProps(styles.side, progressClasses('meta'))}>
            {label != null && (
              <span {...styleProps(styles.sideLabel, progressClasses('label'))}>{label}</span>
            )}
            {sideCaption != null && sideCaption !== false && (
              <span {...styleProps(styles.sideCaption, progressClasses('caption'))}>
                {sideCaption}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div {...styleProps([a2uiStyles.base, styles.lineRoot], rootClassName, style)} {...rootProps}>
      {(label != null || showInfo) && (
        <div {...styleProps(styles.meta, progressClasses('meta'))}>
          <span {...styleProps(styles.label, progressClasses('label'))}>{label}</span>
          {showInfo && <span {...styleProps(styles.value, progressClasses('info'))}>{info}</span>}
        </div>
      )}
      <div
        {...styleProps(
          styles.track,
          progressClasses('track'),
          typeof size === 'number' ? { height: size } : undefined,
        )}
      >
        <div
          {...styleProps(styles.bar, progressClasses('bar'), {
            backgroundColor: color,
            width: `${clamped}%`,
          })}
        />
      </div>
      {caption != null && caption !== false && (
        <span {...styleProps(styles.caption, progressClasses('caption'))}>{caption}</span>
      )}
    </div>
  );
};

export default A2uiProgress;
