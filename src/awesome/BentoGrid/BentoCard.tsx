'use client';

import './style.css';

import clsx from 'clsx';
import { type CSSProperties, memo } from 'react';

import { renderLandingLink } from '@/awesome/landingLink';
import { styleProps } from '@/styles/stylex/props';

import { awesomeBentoCardClasses } from './stable';
import { styles } from './style';
import type { BentoCardProps } from './type';

const BentoCard = memo<BentoCardProps>(
  ({ children, className, colSpan, hint, href, renderLink, rowSpan, style, title, ...rest }) => (
    <div
      data-wide={(colSpan ?? 1) > 2}
      {...styleProps(styles.card, clsx(awesomeBentoCardClasses(), className), {
        ...(colSpan === undefined ? undefined : { '--bento-col-span': colSpan }),
        ...(rowSpan === undefined ? undefined : { '--bento-row-span': rowSpan }),
        ...style,
      } as CSSProperties)}
      {...rest}
    >
      {(title || hint) && (
        <div {...styleProps(styles.header, awesomeBentoCardClasses('header'))}>
          {title &&
            (href ? (
              renderLandingLink(renderLink, {
                children: title,
                className: styleProps(styles.title, awesomeBentoCardClasses('title')).className,
                href,
              })
            ) : (
              <span {...styleProps(styles.title, awesomeBentoCardClasses('title'))}>{title}</span>
            ))}
          {hint && (
            <span {...styleProps(styles.hint, awesomeBentoCardClasses('hint'))}>{hint}</span>
          )}
        </div>
      )}
      <div
        {...styleProps(styles.body, clsx(awesomeBentoCardClasses('body'), 'lobe-bento-card-body'))}
      >
        {children}
      </div>
    </div>
  ),
);

BentoCard.displayName = 'BentoCard';

export default BentoCard;
