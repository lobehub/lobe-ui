'use client';

import { cssVar, cx } from 'antd-style';
import { Star } from 'lucide-react';
import { type KeyboardEvent, memo, useState } from 'react';
import useControlledState from 'use-merge-value';

import { styles } from './style';
import type { RateProps } from './type';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const formatValue = (value: number) => String(Math.round(value * 100) / 100);

const Rate = memo<RateProps>(
  ({
    allowHalf = false,
    character,
    className,
    color = cssVar.colorWarning,
    count = 5,
    defaultValue = 0,
    disabled = false,
    gap,
    onChange,
    onKeyDown,
    onPointerLeave,
    readOnly = false,
    size = 20,
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
    const icon = character ?? <Star fill="currentColor" size={size} />;

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
        className={cx(styles.root, className)}
        style={{ gap: gap ?? size / 2, ...style }}
        onKeyDown={handleKeyDown}
        onPointerLeave={(event) => {
          onPointerLeave?.(event);
          setHoverValue(null);
        }}
        {...a11yProps}
        {...rest}
      >
        {Array.from({ length: count }, (_, index) => {
          const fill = clamp(displayValue - index, 0, 1);
          const targets = allowHalf ? [index + 0.5, index + 1] : [index + 1];

          return (
            <span
              aria-hidden="true"
              className={styles.star}
              data-index={index}
              key={index}
              style={{ fontSize: size, height: size }}
            >
              <span className={cx(styles.icon, styles.empty)} style={{ minWidth: size }}>
                {icon}
              </span>
              <span className={styles.fill} style={{ color, width: `${fill * 100}%` }}>
                <span className={styles.icon} style={{ minWidth: size }}>
                  {icon}
                </span>
              </span>
              {interactive &&
                targets.map((target) => (
                  <span
                    className={styles.half}
                    data-half={target % 1 === 0 && allowHalf ? 'end' : 'start'}
                    data-value={target}
                    key={target}
                    style={allowHalf ? undefined : { width: '100%' }}
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
