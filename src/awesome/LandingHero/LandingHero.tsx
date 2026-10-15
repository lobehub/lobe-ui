'use client';

import './style.css';

import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import { memo } from 'react';

import { LandingActions } from '@/awesome/landingActions';
import { styleProps } from '@/styles/stylex/props';

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
        {...styleProps([styles.root, split && styles.rootSplit], className, style)}
        data-layout={split ? 'split' : 'center'}
        {...rest}
      >
        <div {...stylex.props(styles.content)}>
          <div {...stylex.props(styles.main, split && styles.mainSplit)}>
            <div {...stylex.props(styles.intro, split && styles.introSplit)}>
              {badge && (
                <div
                  className={clsx(stylex.props(styles.badge).className, 'lobe-landing-hero-badge')}
                >
                  {badge}
                </div>
              )}
              <h1 {...stylex.props(styles.title, split && styles.titleSplit)}>
                {title}
                {accent && (
                  <>
                    {' '}
                    <span {...stylex.props(styles.accent)}>{accent}</span>
                  </>
                )}
              </h1>
              {description && <p {...stylex.props(styles.description)}>{description}</p>}
              {actions && actions.length > 0 && (
                <LandingActions
                  actions={actions}
                  renderLink={renderLink}
                  xstyle={[styles.actions, split && styles.actionsSplit]}
                  onNavigate={onNavigate}
                />
              )}
            </div>
            {aside && (
              <div
                className={clsx(stylex.props(styles.aside).className, 'lobe-landing-hero-aside')}
              >
                {aside}
              </div>
            )}
          </div>
          {children && <div {...stylex.props(styles.extra)}>{children}</div>}
        </div>
      </section>
    );
  },
);

LandingHero.displayName = 'LandingHero';

export default LandingHero;
