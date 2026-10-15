'use client';

import './style.css';

import * as stylex from '@stylexjs/stylex';
import { type CSSProperties, memo } from 'react';

import { renderLandingLink } from '@/awesome/landingLink';
import { styleProps } from '@/styles/stylex/props';

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
      data-wide={colSpan > 2}
      {...styleProps(styles.card, className, {
        '--bento-col-span': colSpan,
        '--bento-row-span': rowSpan,
        ...style,
      } as CSSProperties)}
      {...rest}
    >
      {(title || hint) && (
        <div {...stylex.props(styles.header)}>
          {title &&
            (href ? (
              renderLandingLink(renderLink, {
                children: title,
                className: stylex.props(styles.title).className,
                href,
              })
            ) : (
              <span {...stylex.props(styles.title)}>{title}</span>
            ))}
          {hint && <span {...stylex.props(styles.hint)}>{hint}</span>}
        </div>
      )}
      <div {...styleProps(styles.body, 'lobe-bento-card-body')}>{children}</div>
    </div>
  ),
);

BentoCard.displayName = 'BentoCard';

export default BentoCard;
