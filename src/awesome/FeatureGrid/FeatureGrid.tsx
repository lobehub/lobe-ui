'use client';

import * as stylex from '@stylexjs/stylex';
import { type CSSProperties, Fragment, memo } from 'react';

import { renderLandingLink } from '@/awesome/landingLink';
import Icon from '@/Icon';
import { styleProps } from '@/styles/stylex/props';

import { styles } from './style';
import type { FeatureGridProps } from './type';

const FeatureGrid = memo<FeatureGridProps>(
  ({ className, columns = 3, items, renderLink, style, ...rest }) => (
    <div
      {...styleProps(styles.grid, className, {
        '--feature-grid-columns': columns,
        ...style,
      } as CSSProperties)}
      {...rest}
    >
      {items.map(({ description, href, icon, title }, index) => {
        const content = (
          <>
            {icon && (
              <span {...stylex.props(styles.icon)}>
                <Icon icon={icon} size={16} />
              </span>
            )}
            <h3 {...stylex.props(styles.title)}>{title}</h3>
            <p {...stylex.props(styles.description)}>{description}</p>
          </>
        );

        return (
          <Fragment key={typeof title === 'string' ? title : index}>
            {href ? (
              renderLandingLink(renderLink, {
                children: content,
                className: stylex.props(styles.item).className,
                href,
              })
            ) : (
              <div {...stylex.props(styles.item)}>{content}</div>
            )}
          </Fragment>
        );
      })}
    </div>
  ),
);

FeatureGrid.displayName = 'FeatureGrid';

export default FeatureGrid;
