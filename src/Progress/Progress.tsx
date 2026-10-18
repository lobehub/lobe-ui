'use client';

import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import { Check, X } from 'lucide-react';
import { memo, useMemo } from 'react';

import Icon from '@/Icon';
import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { progressClasses } from './stable';
import { styles } from './style';
import type { ProgressProps } from './type';

const circleDiameterMap: Record<'small' | 'middle' | 'large', number> = {
  large: 72,
  middle: 40,
  small: 20,
};
const circleStrokeMap: Record<'small' | 'middle' | 'large', number> = {
  large: 4,
  middle: 3,
  small: 2,
};

const trackHeightStyles = {
  block: { large: styles.blockLg, middle: styles.blockMd, small: styles.blockSm },
  line: { large: styles.lineLg, middle: styles.lineMd, small: styles.lineSm },
};

const fillStyles = {
  active: styles.fillActive,
  exception: styles.fillException,
  normal: styles.fillNormal,
  success: styles.fillSuccess,
};

const statusColor = {
  active: cssVar.colorInfo,
  exception: cssVar.colorError,
  normal: cssVar.colorPrimary,
  success: cssVar.colorSuccess,
};

const fillMinStyles = {
  large: styles.fillMinLg,
  middle: styles.fillMinMd,
  small: styles.fillMinSm,
};
const circleInfoStyles = {
  large: styles.circleInfoLg,
  middle: styles.circleInfoMd,
  small: undefined,
};

const Progress = memo<ProgressProps>(
  ({
    className,
    format,
    label,
    percent,
    ref,
    segments = 20,
    showInfo = true,
    size = 'middle',
    status = 'normal',
    strokeColor,
    style,
    type = 'line',
    variant = 'line',
    ...rest
  }) => {
    const clamped = Math.min(100, Math.max(0, percent));
    const fillStyle = strokeColor ? undefined : fillStyles[status];
    const fillColor = strokeColor ? { backgroundColor: strokeColor } : undefined;

    const info = useMemo(() => {
      const iconColor = strokeColor ? { color: strokeColor } : undefined;
      if (status === 'success')
        return (
          <Icon
            className={styleProps(!strokeColor && styles.iconSuccess).className}
            icon={Check}
            size={14}
            style={iconColor}
          />
        );
      if (status === 'exception')
        return (
          <Icon
            className={styleProps(!strokeColor && styles.iconException).className}
            icon={X}
            size={14}
            style={iconColor}
          />
        );
      return format ? format(clamped) : `${clamped}%`;
    }, [status, format, clamped, strokeColor]);

    const ariaValueText = useMemo(() => {
      if (!format) return undefined;
      const value = format(clamped);
      return typeof value === 'string' || typeof value === 'number' ? String(value) : undefined;
    }, [format, clamped]);

    const rootProps = {
      ...toDataAttributes({
        size: typeof size === 'string' ? size : undefined,
        status,
        type,
        variant: type === 'circle' ? undefined : variant,
      }),
      'aria-valuemax': 100,
      'aria-valuemin': 0,
      'aria-valuenow': clamped,
      'aria-valuetext': ariaValueText,
      'ref': ref,
      'role': 'progressbar' as const,
      ...rest,
    };
    const rootClassName = clsx(progressClasses(), className);

    if (type === 'circle') {
      const isPreset = typeof size === 'string';
      const diameter = isPreset
        ? circleDiameterMap[size as 'small' | 'middle' | 'large']
        : (size as number);
      const stroke = isPreset
        ? circleStrokeMap[size as 'small' | 'middle' | 'large']
        : Math.max(2, Math.round((diameter * 3) / 40));
      const radius = diameter / 2 - stroke;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference * (1 - clamped / 100);

      return (
        <div {...styleProps([styles.circleRoot], rootClassName, style)} {...rootProps}>
          <svg
            {...stylex.props(styles.circleSvg)}
            height={diameter}
            viewBox={`0 0 ${diameter} ${diameter}`}
            width={diameter}
          >
            <circle
              {...styleProps(styles.circleTrack, progressClasses('track'))}
              cx={diameter / 2}
              cy={diameter / 2}
              r={radius}
              strokeWidth={stroke}
            />
            <circle
              {...styleProps(styles.circleBar, progressClasses('bar'))}
              cx={diameter / 2}
              cy={diameter / 2}
              fill="none"
              r={radius}
              stroke={strokeColor ?? statusColor[status]}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              strokeWidth={stroke}
            />
          </svg>
          {showInfo && diameter >= 40 && (
            <span
              {...styleProps(
                [styles.circleInfo, isPreset && circleInfoStyles[size as 'large' | 'middle']],
                progressClasses('info'),
                isPreset ? undefined : { fontSize: Math.round(diameter * 0.15 + 6) },
              )}
            >
              {info}
            </span>
          )}
        </div>
      );
    }

    const sizeStyle = typeof size === 'number' ? { height: size } : undefined;
    const heightStyle = (family: 'line' | 'block') =>
      typeof size === 'number' ? undefined : trackHeightStyles[family][size];
    const infoNode = showInfo && (
      <span {...styleProps(styles.rowInfo, progressClasses('info'))}>{info}</span>
    );

    if (variant === 'segments') {
      const filled = Math.round((segments * clamped) / 100);

      return (
        <div {...styleProps([styles.rowRoot], rootClassName, style)} {...rootProps}>
          <div
            {...styleProps(
              [styles.segments, heightStyle('block')],
              progressClasses('track'),
              sizeStyle,
            )}
          >
            {Array.from({ length: segments }, (_, index) => (
              <span
                key={index}
                {...toDataAttributes({ filled: index < filled })}
                {...styleProps(
                  [styles.segment, index < filled && fillStyle],
                  progressClasses('segment'),
                  index < filled ? fillColor : undefined,
                )}
              />
            ))}
          </div>
          {infoNode}
        </div>
      );
    }

    if (variant === 'inset') {
      return (
        <div {...styleProps([styles.rowRoot], rootClassName, style)} {...rootProps}>
          <div
            {...styleProps(
              [styles.split, heightStyle('block')],
              progressClasses('track'),
              sizeStyle,
            )}
          >
            {clamped > 0 && (
              <span
                {...styleProps(
                  [
                    styles.splitFill,
                    fillStyle,
                    typeof size === 'string' && fillMinStyles[size],
                    status === 'active' && styles.barActive,
                  ],
                  progressClasses('bar'),
                  {
                    ...fillColor,
                    minWidth: typeof size === 'number' ? size : undefined,
                    width: clamped === 100 ? '100%' : `calc((100% - 3px) * ${clamped / 100})`,
                  },
                )}
              />
            )}
            {clamped < 100 && <span {...styleProps(styles.splitRest, progressClasses('rest'))} />}
          </div>
          {infoNode}
        </div>
      );
    }

    return (
      <div {...styleProps([styles.lineRoot], rootClassName, style)} {...rootProps}>
        {(label || showInfo) && (
          <div {...styleProps(styles.lineMeta, progressClasses('meta'))}>
            <span className={progressClasses('label')}>{label}</span>
            {showInfo && (
              <span {...styleProps(styles.lineValue, progressClasses('info'))}>{info}</span>
            )}
          </div>
        )}
        <div
          {...styleProps(
            [styles.lineTrack, heightStyle('line')],
            progressClasses('track'),
            sizeStyle,
          )}
        >
          <div
            {...styleProps(
              [
                styles.bar,
                fillStyle,
                variant === 'line' && status === 'active' && styles.barActive,
              ],
              progressClasses('bar'),
              { ...fillColor, width: `${clamped}%` },
            )}
          />
        </div>
      </div>
    );
  },
);

Progress.displayName = 'Progress';

export default Progress;
