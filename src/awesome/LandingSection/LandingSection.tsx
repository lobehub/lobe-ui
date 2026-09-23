'use client';

import { cx } from 'antd-style';
import { memo } from 'react';

import { LandingActions } from '@/awesome/landingActions';
import Tag from '@/base-ui/Tag';

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

    return (
      <section
        aria-labelledby={title ? headingId : undefined}
        className={cx(styles.root, className)}
        data-divider={divider}
        id={id}
        {...rest}
      >
        {hasHeader && (
          <div className={styles.header} data-align={align}>
            <div className={styles.heading}>
              {eyebrow && (
                <Tag className={styles.eyebrow} color={eyebrowColor} shape={'round'}>
                  {eyebrow}
                </Tag>
              )}
              {title && (
                <h2 className={styles.title} id={headingId}>
                  {title}
                </h2>
              )}
              {description && <p className={styles.description}>{description}</p>}
            </div>
            {hasAside && (
              <div className={styles.extra}>
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
        {children && <div className={hasHeader ? styles.body : undefined}>{children}</div>}
      </section>
    );
  },
);

LandingSection.displayName = 'LandingSection';

export default LandingSection;
