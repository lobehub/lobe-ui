'use client';

import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import { Star } from 'lucide-react';
import { type CSSProperties, type KeyboardEvent, memo, useState } from 'react';

import { useControlledState } from '@/hooks/useControlledState';
import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { rateClasses } from './stable';
import { styles } from './style';
import type { RateProps } from './type';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const formatValue = (value: number) => String(Math.round(value * 100) / 100);

const Rate = memo<RateProps>(
  ({
    allowHalf = false,
    character,
    className,
    color,
    count = 5,
    defaultValue = 0,
    disabled = false,
    gap,
    onChange,
    onKeyDown,
    onPointerLeave,
    readOnly = false,
    size,
    style,
    value,
    ...rest
  }) => {
    const [mergedValue, setMergedValue] = useControlledState(defaultValue, { onChange, value });
    const [hoverValue, setHoverValue] = useState<number | null>(null);

    const interactive = !readOnly && !disabled;
    const step = allowHalf ? 0.5 : 1;
    const displayValue = clamp(hoverValue ?? mergedValue, 0, count);
    const label = `${formatValue(clamp(mergedValue, 0, count))} out of ${count}`;
    const icon = character ?? <Star fill="currentColor" size="1em" />;

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (!interactive || event.defaultPrevented) return;

      const next = {
        ArrowDown: mergedValue - step,
        ArrowLeft: mergedValue - step,
        ArrowRight: mergedValue + step,
        ArrowUp: mergedValue + step,
        End: count,
        Home: 0,
      }[event.key];
      if (next === undefined) return;

      event.preventDefault();
      setMergedValue(clamp(Math.round(next / step) * step, 0, count));
    };

    const a11yProps = readOnly
      ? { 'aria-label': label, 'role': 'img' }
      : {
          'aria-disabled': disabled || undefined,
          'aria-valuemax': count,
          'aria-valuemin': 0,
          'aria-valuenow': mergedValue,
          'aria-valuetext': label,
          'role': 'slider',
          'tabIndex': disabled ? -1 : 0,
        };

    return (
      <div
        onKeyDown={handleKeyDown}
        onPointerLeave={(event) => {
          onPointerLeave?.(event);
          setHoverValue(null);
        }}
        {...a11yProps}
        {...rest}
        {...toDataAttributes({ allowHalf })}
        {...styleProps(styles.root, clsx(rateClasses(), className), {
          ...(size !== undefined && { '--lobe-rate-size': `${size}px` }),
          ...(color !== undefined && { '--lobe-rate-color': color }),
          ...(gap !== undefined && { gap }),
          ...style,
        } as CSSProperties)}
      >
        {Array.from({ length: count }, (_, index) => {
          const fill = clamp(displayValue - index, 0, 1);
          const targets = allowHalf ? [index + 0.5, index + 1] : [index + 1];

          return (
            <span
              aria-hidden="true"
              data-index={index}
              key={index}
              {...styleProps(
                [styles.star, interactive && styles.starInteractive],
                rateClasses('star'),
              )}
            >
              <span {...styleProps([styles.icon, styles.empty], rateClasses('empty'))}>{icon}</span>
              <span {...styleProps(styles.fill, rateClasses('fill'), { width: `${fill * 100}%` })}>
                <span {...stylex.props(styles.icon)}>{icon}</span>
              </span>
              {interactive &&
                targets.map((target) => (
                  <span
                    {...stylex.props(styles.half, !allowHalf && styles.halfFull)}
                    data-half={target % 1 === 0 && allowHalf ? 'end' : 'start'}
                    data-value={target}
                    key={target}
                    onClick={() => setMergedValue(target)}
                    onPointerEnter={() => setHoverValue(target)}
                  />
                ))}
            </span>
          );
        })}
      </div>
    );
  },
);

Rate.displayName = 'Rate';

export default Rate;
