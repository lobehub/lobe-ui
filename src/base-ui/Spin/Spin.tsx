'use client';

import { cx } from 'antd-style';
import { LoaderCircle } from 'lucide-react';
import { memo, useMemo } from 'react';

import Icon from '@/Icon';

import NetworkGlyph from './NetworkGlyph';
import { styles } from './style';
import type { SpinProps, SpinSize } from './type';

const sizeMap: Record<'small' | 'middle' | 'large', number> = {
  large: 32,
  middle: 20,
  small: 14,
};

const resolveSize = (size: SpinSize) => (typeof size === 'number' ? size : sizeMap[size]);

const Spin = memo<SpinProps>(
  ({
    children,
    className,
    indicator,
    percent,
    ref,
    size = 'middle',
    spinning = true,
    style,
    tip,
    variant = 'default',
    ...rest
  }) => {
    const px = useMemo(() => resolveSize(size), [size]);

    const glyph = useMemo(() => {
      if (indicator) return indicator;

      if (variant === 'network') return <NetworkGlyph px={px} />;

      if (typeof percent === 'number') {
        const clamped = Math.min(100, Math.max(0, percent));
        const circumference = 2 * Math.PI * 9;
        const offset = circumference * (1 - clamped / 100);

        return (
          <svg className={cx(styles.glyph, styles.ring)} height={px} viewBox="0 0 24 24" width={px}>
            <circle
              className={styles.ringTrack}
              cx={12}
              cy={12}
              fill="none"
              r={9}
              strokeWidth={2.5}
            />
            <circle
              className={styles.ringProgress}
              cx={12}
              cy={12}
              fill="none"
              r={9}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              strokeWidth={2.5}
            />
          </svg>
        );
      }

      return <Icon spin className={styles.glyph} icon={LoaderCircle} size={px} />;
    }, [indicator, variant, percent, px]);

    if (!spinning) return children ?? null;

    if (!children) {
      return (
        <div
          aria-busy
          aria-live="polite"
          className={cx(styles.root, className)}
          ref={ref}
          role="status"
          style={style}
          {...rest}
        >
          <span aria-hidden className={styles.glyphBox}>
            {glyph}
          </span>
        </div>
      );
    }

    return (
      <div className={cx(styles.wrapper, className)} ref={ref} style={style} {...rest}>
        {children}
        <div aria-busy aria-live="polite" className={styles.overlay} role="status">
          <span aria-hidden className={styles.glyphBox}>
            {glyph}
          </span>
          {tip && <span className={styles.tip}>{tip}</span>}
        </div>
      </div>
    );
  },
);

Spin.displayName = 'Spin';

export default Spin;
