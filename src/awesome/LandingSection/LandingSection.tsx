'use client';

import * as stylex from '@stylexjs/stylex';
import { memo } from 'react';

import { LandingActions } from '@/awesome/landingActions';
import { styleProps } from '@/styles/stylex/props';
import Tag from '@/Tag';

import { styles } from './style';
import type { LandingSectionProps } from './type';

const LandingSection = memo<LandingSectionProps>(
  ({
    actions,
    align = 'start',
    children,
    className,
    description,
    divider = true,
    eyebrow,
    eyebrowColor = 'blue',
    extra,
    id,
    onNavigate,
    renderLink,
    title,
    ...rest
  }) => {
    const headingId = id ? `${id}-title` : undefined;
    const hasActions = Boolean(actions?.length);
    const hasAside = hasActions || Boolean(extra);
    const hasHeader = Boolean(eyebrow || title || description || hasAside);
    const isStart = align === 'start';

    return (
      <section
        aria-labelledby={title ? headingId : undefined}
        data-divider={divider}
        id={id}
        {...styleProps([styles.root, divider && styles.rootDivider], className)}
        {...rest}
      >
        {hasHeader && (
          <div data-align={align} {...stylex.props(styles.header, isStart && styles.headerStart)}>
            <div {...stylex.props(styles.heading, isStart && styles.headingStart)}>
              {eyebrow && (
                <Tag {...stylex.props(styles.eyebrow)} color={eyebrowColor} shape={'round'}>
                  {eyebrow}
                </Tag>
              )}
              {title && (
                <h2 id={headingId} {...stylex.props(styles.title)}>
                  {title}
                </h2>
              )}
              {description && <p {...stylex.props(styles.description)}>{description}</p>}
            </div>
            {hasAside && (
              <div {...stylex.props(styles.extra, isStart && styles.extraStart)}>
                {hasActions && (
                  <LandingActions
                    actions={actions!}
                    renderLink={renderLink}
                    size={'small'}
                    onNavigate={onNavigate}
                  />
                )}
                {extra}
              </div>
            )}
          </div>
        )}
        {children && <div {...stylex.props(hasHeader && styles.body)}>{children}</div>}
      </section>
    );
  },
);

LandingSection.displayName = 'LandingSection';

export default LandingSection;
