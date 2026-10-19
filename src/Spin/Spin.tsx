'use client';

import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import { LoaderCircle } from 'lucide-react';
import { memo, useMemo } from 'react';

import Icon from '@/Icon';
import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import NetworkGlyph from './NetworkGlyph';
import { spinClasses } from './stable';
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
          <svg
            {...stylex.props(styles.glyph, styles.ring)}
            height={px}
            viewBox="0 0 24 24"
            width={px}
          >
            <circle
              {...stylex.props(styles.ringTrack)}
              cx={12}
              cy={12}
              fill="none"
              r={9}
              strokeWidth={2.5}
            />
            <circle
              {...stylex.props(styles.ringProgress)}
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

      return <Icon spin {...stylex.props(styles.glyph)} icon={LoaderCircle} size={px} />;
    }, [indicator, variant, percent, px]);

    if (!spinning) return children ?? null;

    const dataAttributes = toDataAttributes({
      size: typeof size === 'string' ? size : undefined,
      variant,
    });

    if (!children) {
      return (
        <div
          aria-busy
          aria-live="polite"
          ref={ref}
          role="status"
          {...styleProps(styles.root, clsx(spinClasses(), className), style)}
          {...dataAttributes}
          {...rest}
        >
          <span aria-hidden {...styleProps(styles.glyphBox, spinClasses('indicator'))}>
            {glyph}
          </span>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        {...styleProps(styles.wrapper, clsx(spinClasses(), className), style)}
        {...dataAttributes}
        {...rest}
      >
        {children}
        <div
          aria-busy
          aria-live="polite"
          {...styleProps(styles.overlay, spinClasses('overlay'))}
          role="status"
        >
          <span aria-hidden {...styleProps(styles.glyphBox, spinClasses('indicator'))}>
            {glyph}
          </span>
          {tip && <span {...styleProps(styles.tip, spinClasses('tip'))}>{tip}</span>}
        </div>
      </div>
    );
  },
);

Spin.displayName = 'Spin';

export default Spin;
