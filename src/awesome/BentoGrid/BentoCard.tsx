'use client';

import { cx } from 'antd-style';
import { type CSSProperties, memo } from 'react';

import { renderLandingLink } from '@/awesome/landingLink';

import { styles } from './style';
import type { BentoCardProps } from './type';

const BentoCard = memo<BentoCardProps>(
  ({
    children,
    className,
    colSpan = 1,
    hint,
    href,
    renderLink,
    rowSpan = 1,
    style,
    title,
    ...rest
  }) => (
    <div
      className={cx(styles.card, className)}
      data-wide={colSpan > 2}
      style={
        { '--bento-col-span': colSpan, '--bento-row-span': rowSpan, ...style } as CSSProperties
      }
      {...rest}
    >
      {(title || hint) && (
        <div className={styles.header}>
          {title &&
            (href ? (
              renderLandingLink(renderLink, { children: title, className: styles.title, href })
            ) : (
              <span className={styles.title}>{title}</span>
            ))}
          {hint && <span className={styles.hint}>{hint}</span>}
        </div>
      )}
      <div className={styles.body}>{children}</div>
    </div>
  ),
);

BentoCard.displayName = 'BentoCard';

export default BentoCard;
