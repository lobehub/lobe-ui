'use client';

import clsx from 'clsx';
import { type CSSProperties, memo, type ReactNode } from 'react';

import { styleProps } from '@/styles/stylex/props';
import { toDataAttributes } from '@/utils/bem';

import { badgeClasses } from './stable';
import { statusColor, styles } from './style';
import type { BadgeProps } from './type';

const pillSizeStyles = { default: null, small: styles.pillSmall };

const Badge = memo<BadgeProps>(
  ({
    children,
    className,
    color,
    count,
    dot = false,
    offset,
    overflowCount = 99,
    ref,
    showZero = false,
    size = 'default',
    status,
    style,
    text,
    ...rest
  }) => {
    const isStatusMode = children == null && (status !== undefined || text !== undefined);

    if (isStatusMode) {
      const dotColor = color ?? statusColor[status ?? 'default'];

      return (
        <span
          ref={ref}
          {...toDataAttributes({ status: status ?? 'default' })}
          {...styleProps([styles.statusRoot], clsx(badgeClasses(), className), style)}
          {...rest}
        >
          <span
            {...styleProps(
              [styles.statusDot, status === 'processing' && styles.statusDotProcessing],
              badgeClasses('dot'),
              color === undefined
                ? ({ '--lobe-badge-color': dotColor } as CSSProperties)
                : { background: color, color },
            )}
          />
          {text && <span {...styleProps(styles.statusText, badgeClasses('text'))}>{text}</span>}
        </span>
      );
    }

    let content: ReactNode = null;
    let renderPill = dot;

    if (!dot) {
      if (typeof count === 'number') {
        if (count !== 0 || showZero) {
          renderPill = true;
          content = count > overflowCount ? `${overflowCount}+` : count;
        }
      } else if (count != null) {
        renderPill = true;
        content = count;
      }
    }

    const pillStyle = {
      background: color,
      transform: offset ? `translate(${offset[0]}px, ${offset[1]}px)` : undefined,
    };

    if (children == null) {
      if (!renderPill) return null;

      return (
        <span
          ref={ref}
          {...toDataAttributes({ dot, size })}
          {...styleProps(
            [styles.pill, pillSizeStyles[size], dot && styles.pillDot],
            clsx(badgeClasses(), badgeClasses('count'), className),
            {
              ...pillStyle,
              ...style,
            },
          )}
          {...rest}
        >
          {!dot && content}
        </span>
      );
    }

    return (
      <span
        ref={ref}
        {...toDataAttributes({ dot, size })}
        {...styleProps([styles.wrapper], clsx(badgeClasses(), className), style)}
        {...rest}
      >
        {children}
        {renderPill && (
          <span
            {...styleProps(
              [styles.pill, pillSizeStyles[size], styles.pillAbsolute, dot && styles.pillDot],
              badgeClasses('count'),
              pillStyle,
            )}
          >
            {!dot && content}
          </span>
        )}
      </span>
    );
  },
);

Badge.displayName = 'Badge';

export default Badge;
