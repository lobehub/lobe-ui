'use client';

import { cx } from 'antd-style';
import { type CSSProperties, Fragment, memo } from 'react';

import { renderLandingLink } from '@/awesome/landingLink';
import Icon from '@/Icon';

import { styles } from './style';
import type { FeatureGridProps } from './type';

const FeatureGrid = memo<FeatureGridProps>(
  ({ className, columns = 3, items, renderLink, style, ...rest }) => (
    <div
      className={cx(styles.grid, className)}
      style={{ '--feature-grid-columns': columns, ...style } as CSSProperties}
      {...rest}
    >
      {items.map(({ description, href, icon, title }, index) => {
        const content = (
          <>
            {icon && (
              <span className={styles.icon}>
                <Icon icon={icon} size={16} />
              </span>
            )}
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.description}>{description}</p>
          </>
        );

        return (
          <Fragment key={typeof title === 'string' ? title : index}>
            {href ? (
              renderLandingLink(renderLink, { children: content, className: styles.item, href })
            ) : (
              <div className={styles.item}>{content}</div>
            )}
          </Fragment>
        );
      })}
    </div>
  ),
);

FeatureGrid.displayName = 'FeatureGrid';

export default FeatureGrid;
