'use client';

import { cx } from 'antd-style';
import { memo } from 'react';

import { LandingActions } from '@/awesome/landingActions';

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
    title,
    ...rest
  }) => (
    <section
      className={cx(styles.root, className)}
      data-layout={aside ? 'split' : 'center'}
      {...rest}
    >
      <div className={styles.content}>
        <div className={styles.main}>
          <div className={styles.intro}>
            {badge && <div className={styles.badge}>{badge}</div>}
            <h1 className={styles.title}>
              {title}
              {accent && (
                <>
                  {' '}
                  <span className={styles.accent}>{accent}</span>
                </>
              )}
            </h1>
            {description && <p className={styles.description}>{description}</p>}
            {actions && actions.length > 0 && (
              <LandingActions
                actions={actions}
                className={styles.actions}
                renderLink={renderLink}
                onNavigate={onNavigate}
              />
            )}
          </div>
          {aside && <div className={styles.aside}>{aside}</div>}
        </div>
        {children && <div className={styles.extra}>{children}</div>}
      </div>
    </section>
  ),
);

LandingHero.displayName = 'LandingHero';

export default LandingHero;
