'use client';

import { cssVar, cx } from 'antd-style';
import { Check, X } from 'lucide-react';
import { memo, useMemo } from 'react';

import Icon from '@/Icon';

import { styles, trackHeight } from './style';
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
          className={cx(styles.circleRoot, className)}
          ref={ref}
          style={style}
          {...progressAria}
          {...rest}
        >
          <svg
            className={styles.circleSvg}
            height={diameter}
            viewBox={`0 0 ${diameter} ${diameter}`}
            width={diameter}
          >
            <circle
              className={styles.circleTrack}
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
          {showInfo && (
            <span
              className={styles.circleInfo}
              style={{ fontSize: diameter <= 20 ? 10 : diameter <= 40 ? 12 : 16 }}
            >
              {info}
            </span>
          )}
        </div>
      );
    }

    const heightStyle = typeof size === 'number' ? { height: size } : undefined;
    const heightClass = (family: 'line' | 'block') =>
      typeof size === 'number' ? undefined : trackHeight({ family, size });

    if (variant === 'segments') {
      const filled = Math.round((segments * clamped) / 100);

      return (
        <div
          className={cx(styles.rowRoot, className)}
          ref={ref}
          style={style}
          {...progressAria}
          {...rest}
        >
          <div className={cx(styles.segments, heightClass('block'))} style={heightStyle}>
            {Array.from({ length: segments }, (_, index) => (
              <span
                className={cx(styles.segment, index < filled && styles.segmentOn)}
                key={index}
                style={index < filled ? { background: barColor } : undefined}
              />
            ))}
          </div>
          {showInfo && <span className={styles.rowInfo}>{info}</span>}
        </div>
      );
    }

    if (variant === 'inset') {
      return (
        <div
          className={cx(styles.rowRoot, className)}
          ref={ref}
          style={style}
          {...progressAria}
          {...rest}
        >
          <div
            className={cx(styles.rowTrack, styles.insetTrack, heightClass('block'))}
            style={heightStyle}
          >
            <div className={styles.insetBarWrapper}>
              <div className={styles.bar} style={{ background: barColor, width: `${clamped}%` }}>
                <span className={styles.insetCap} />
              </div>
            </div>
          </div>
          {showInfo && <span className={styles.rowInfo}>{info}</span>}
        </div>
      );
    }

    return (
      <div
        className={cx(styles.lineRoot, className)}
        ref={ref}
        style={style}
        {...progressAria}
        {...rest}
      >
        {(label || showInfo) && (
          <div className={styles.lineMeta}>
            <span>{label}</span>
            {showInfo && <span className={styles.lineValue}>{info}</span>}
          </div>
        )}
        <div className={cx(styles.lineTrack, heightClass('line'))} style={heightStyle}>
          <div
            style={{ background: barColor, width: `${clamped}%` }}
            className={cx(
              styles.bar,
              variant === 'line' && status === 'active' && styles.barActive,
            )}
          />
        </div>
      </div>
    );
  },
);

Progress.displayName = 'Progress';

export default Progress;
