'use client';

import clsx from 'clsx';
import { memo } from 'react';

import { LandingActions } from '@/awesome/landingActions';
import { styleProps } from '@/styles/stylex/props';
import Tag from '@/Tag';

import { awesomeLandingSectionClasses } from './stable';
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
        {...styleProps(
          [styles.root, divider && styles.rootDivider],
          clsx(awesomeLandingSectionClasses(), className),
        )}
        {...rest}
      >
        {hasHeader && (
          <div
            data-align={align}
            {...styleProps(
              [styles.header, isStart && styles.headerStart],
              awesomeLandingSectionClasses('header'),
            )}
          >
            <div
              {...styleProps(
                [styles.heading, isStart && styles.headingStart],
                awesomeLandingSectionClasses('heading'),
              )}
            >
              {eyebrow && (
                <Tag
                  {...styleProps(styles.eyebrow, awesomeLandingSectionClasses('eyebrow'))}
                  color={eyebrowColor}
                  shape={'round'}
                >
                  {eyebrow}
                </Tag>
              )}
              {title && (
                <h2
                  id={headingId}
                  {...styleProps(styles.title, awesomeLandingSectionClasses('title'))}
                >
                  {title}
                </h2>
              )}
              {description && (
                <p {...styleProps(styles.description, awesomeLandingSectionClasses('description'))}>
                  {description}
                </p>
              )}
            </div>
            {hasAside && (
              <div
                {...styleProps(
                  [styles.extra, isStart && styles.extraStart],
                  awesomeLandingSectionClasses('extra'),
                )}
              >
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
        {children && (
          <div {...styleProps(hasHeader && styles.body, awesomeLandingSectionClasses('body'))}>
            {children}
          </div>
        )}
      </section>
    );
  },
);

LandingSection.displayName = 'LandingSection';

export default LandingSection;
