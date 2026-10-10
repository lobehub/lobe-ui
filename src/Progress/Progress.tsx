'use client';

import * as stylex from '@stylexjs/stylex';
import { Check, X } from 'lucide-react';
import { memo, useMemo } from 'react';

import Icon from '@/Icon';
import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { styleProps } from '@/styles/stylex/props';

import { styles } from './style';
import type { ProgressProps } from './type';

const circleDiameterMap: Record<'small' | 'middle' | 'large', number> = {
  large: 72,
  middle: 40,
  small: 20,
};
const blockHeightMap: Record<'small' | 'middle' | 'large', number> = {
  large: 12,
  middle: 8,
  small: 4,
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

const statusColor = {
  active: cssVar.colorInfo,
  exception: cssVar.colorError,
  success: cssVar.colorSuccess,
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
    const barColor =
      strokeColor ?? (status === 'normal' ? cssVar.colorPrimary : statusColor[status]);

    const info = useMemo(() => {
      if (status === 'success') return <Icon icon={Check} size={14} style={{ color: barColor }} />;
      if (status === 'exception') return <Icon icon={X} size={14} style={{ color: barColor }} />;
      return format ? format(clamped) : `${clamped}%`;
    }, [status, format, clamped, barColor]);

    const ariaValueText = useMemo(() => {
      if (!format) return undefined;
      const value = format(clamped);
      return typeof value === 'string' || typeof value === 'number' ? String(value) : undefined;
    }, [format, clamped]);

    const progressAria = {
      'aria-valuemax': 100,
      'aria-valuemin': 0,
      'aria-valuenow': clamped,
      'aria-valuetext': ariaValueText,
      'role': 'progressbar' as const,
    };

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
        <div
          ref={ref}
          {...styleProps([styles.circleRoot], className, style)}
          {...progressAria}
          {...rest}
        >
          <svg
            {...stylex.props(styles.circleSvg)}
            height={diameter}
            viewBox={`0 0 ${diameter} ${diameter}`}
            width={diameter}
          >
            <circle
              {...stylex.props(styles.circleTrack)}
              cx={diameter / 2}
              cy={diameter / 2}
              r={radius}
              strokeWidth={stroke}
            />
            <circle
              cx={diameter / 2}
              cy={diameter / 2}
              fill="none"
              r={radius}
              stroke={barColor}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              strokeWidth={stroke}
              style={{ transition: 'stroke-dashoffset 0.3s' }}
            />
          </svg>
          {showInfo && diameter >= 40 && (
            <span
              {...styleProps([styles.circleInfo], undefined, {
                fontSize: Math.round(diameter * 0.15 + 6),
              })}
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

    if (variant === 'segments') {
      const filled = Math.round((segments * clamped) / 100);

      return (
        <div
          ref={ref}
          {...styleProps([styles.rowRoot], className, style)}
          {...progressAria}
          {...rest}
        >
          <div {...styleProps([styles.segments, heightStyle('block')], undefined, sizeStyle)}>
            {Array.from({ length: segments }, (_, index) => (
              <span
                key={index}
                {...styleProps(
                  [styles.segment, index < filled && styles.segmentOn],
                  undefined,
                  index < filled ? { background: barColor } : undefined,
                )}
              />
            ))}
          </div>
          {showInfo && <span {...stylex.props(styles.rowInfo)}>{info}</span>}
        </div>
      );
    }

    if (variant === 'inset') {
      return (
        <div
          ref={ref}
          {...styleProps([styles.rowRoot], className, style)}
          {...progressAria}
          {...rest}
        >
          <div {...styleProps([styles.split, heightStyle('block')], undefined, sizeStyle)}>
            {clamped > 0 && (
              <span
                {...styleProps(
                  [styles.splitFill, status === 'active' && styles.barActive],
                  undefined,
                  {
                    backgroundColor: barColor,
                    minWidth: typeof size === 'number' ? size : blockHeightMap[size],
                    width: clamped === 100 ? '100%' : `calc((100% - 3px) * ${clamped / 100})`,
                  },
                )}
              />
            )}
            {clamped < 100 && <span {...stylex.props(styles.splitRest)} />}
          </div>
          {showInfo && <span {...stylex.props(styles.rowInfo)}>{info}</span>}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        {...styleProps([styles.lineRoot], className, style)}
        {...progressAria}
        {...rest}
      >
        {(label || showInfo) && (
          <div {...stylex.props(styles.lineMeta)}>
            <span>{label}</span>
            {showInfo && <span {...stylex.props(styles.lineValue)}>{info}</span>}
          </div>
        )}
        <div {...styleProps([styles.lineTrack, heightStyle('line')], undefined, sizeStyle)}>
          <div
            {...styleProps(
              [styles.bar, variant === 'line' && status === 'active' && styles.barActive],
              undefined,
              { backgroundColor: barColor, width: `${clamped}%` },
            )}
          />
        </div>
      </div>
    );
  },
);

Progress.displayName = 'Progress';

export default Progress;
