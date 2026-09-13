'use client';

import { cx } from 'antd-style';
import { memo, type ReactNode } from 'react';

import { pillSize, statusColor, styles } from './style';
import type { BadgeProps } from './type';

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
    const isStatusMode = Boolean(status) || (Boolean(text) && children == null);

    if (isStatusMode) {
      const dotColor = color ?? statusColor[status ?? 'default'];

      return (
        <span className={cx(styles.statusRoot, className)} ref={ref} style={style} {...rest}>
          <span
            className={cx(styles.statusDot, status === 'processing' && styles.statusDotProcessing)}
            style={{ background: dotColor, color: dotColor }}
          />
          {text && <span className={styles.statusText}>{text}</span>}
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
      ...style,
    };

    if (children == null) {
      if (!renderPill) return null;

      return (
        <span
          className={cx(pillSize({ size }), dot && styles.pillDot, className)}
          ref={ref}
          style={pillStyle}
          {...rest}
        >
          {!dot && content}
        </span>
      );
    }

    return (
      <span className={cx(styles.wrapper, className)} ref={ref} style={style} {...rest}>
        {children}
        {renderPill && (
          <span
            className={cx(pillSize({ size }), styles.pillAbsolute, dot && styles.pillDot)}
            style={pillStyle}
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
