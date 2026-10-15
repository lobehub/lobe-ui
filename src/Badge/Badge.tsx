'use client';

import * as stylex from '@stylexjs/stylex';
import { memo, type ReactNode } from 'react';

import { styleProps } from '@/styles/stylex/props';

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
        <span ref={ref} {...styleProps([styles.statusRoot], className, style)} {...rest}>
          <span
            {...styleProps(
              [styles.statusDot, status === 'processing' && styles.statusDotProcessing],
              undefined,
              { background: dotColor, color: dotColor },
            )}
          />
          {text && <span {...stylex.props(styles.statusText)}>{text}</span>}
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
          {...styleProps([styles.pill, pillSizeStyles[size], dot && styles.pillDot], className, {
            ...pillStyle,
            ...style,
          })}
          {...rest}
        >
          {!dot && content}
        </span>
      );
    }

    return (
      <span ref={ref} {...styleProps([styles.wrapper], className, style)} {...rest}>
        {children}
        {renderPill && (
          <span
            {...styleProps(
              [styles.pill, pillSizeStyles[size], styles.pillAbsolute, dot && styles.pillDot],
              undefined,
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
