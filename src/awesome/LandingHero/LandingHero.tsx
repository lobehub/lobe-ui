'use client';

import './style.css';

import clsx from 'clsx';
import { memo } from 'react';

import { LandingActions } from '@/awesome/landingActions';
import { styleProps } from '@/styles/stylex/props';

import { awesomeLandingHeroClasses } from './stable';
import { styles } from './style';
import type { LandingHeroProps } from './type';

const LandingHero = memo<LandingHeroProps>(
  ({
    accent,
    actions,
    aside,
    badge,
    children,
    className,
    description,
    onNavigate,
    renderLink,
    style,
    title,
    ...rest
  }) => {
    const split = !!aside;

    return (
      <section
        {...styleProps(
          [styles.root, split && styles.rootSplit],
          clsx(awesomeLandingHeroClasses(), className),
          style,
        )}
        data-layout={split ? 'split' : 'center'}
        {...rest}
      >
        <div {...styleProps(styles.content, awesomeLandingHeroClasses('content'))}>
          <div
            {...styleProps(
              [styles.main, split && styles.mainSplit],
              awesomeLandingHeroClasses('main'),
            )}
          >
            <div
              {...styleProps(
                [styles.intro, split && styles.introSplit],
                awesomeLandingHeroClasses('intro'),
              )}
            >
              {badge && (
                <div
                  className={clsx(
                    styleProps(styles.badge, awesomeLandingHeroClasses('badge')).className,
                    'lobe-landing-hero-badge',
                  )}
                >
                  {badge}
                </div>
              )}
              <h1
                {...styleProps(
                  [styles.title, split && styles.titleSplit],
                  awesomeLandingHeroClasses('title'),
                )}
              >
                {title}
                {accent && (
                  <>
                    {' '}
                    <span {...styleProps(styles.accent, awesomeLandingHeroClasses('accent'))}>
                      {accent}
                    </span>
                  </>
                )}
              </h1>
              {description && (
                <p {...styleProps(styles.description, awesomeLandingHeroClasses('description'))}>
                  {description}
                </p>
              )}
              {actions && actions.length > 0 && (
                <LandingActions
                  actions={actions}
                  className={awesomeLandingHeroClasses('actions')}
                  renderLink={renderLink}
                  xstyle={[styles.actions, split && styles.actionsSplit]}
                  onNavigate={onNavigate}
                />
              )}
            </div>
            {aside && (
              <div
                className={clsx(
                  styleProps(styles.aside, awesomeLandingHeroClasses('aside')).className,
                  'lobe-landing-hero-aside',
                )}
              >
                {aside}
              </div>
            )}
          </div>
          {children && (
            <div {...styleProps(styles.extra, awesomeLandingHeroClasses('extra'))}>{children}</div>
          )}
        </div>
      </section>
    );
  },
);

LandingHero.displayName = 'LandingHero';

export default LandingHero;
