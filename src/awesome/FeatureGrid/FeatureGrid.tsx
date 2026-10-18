'use client';

import clsx from 'clsx';
import { type CSSProperties, Fragment, memo } from 'react';

import { renderLandingLink } from '@/awesome/landingLink';
import Icon from '@/Icon';
import { styleProps } from '@/styles/stylex/props';

import { awesomeFeatureGridClasses } from './stable';
import { styles } from './style';
import type { FeatureGridProps } from './type';

const FeatureGrid = memo<FeatureGridProps>(
  ({ className, columns, items, renderLink, style, ...rest }) => (
    <div
      {...styleProps(styles.grid, clsx(awesomeFeatureGridClasses(), className), {
        ...(columns === undefined ? undefined : { '--feature-grid-columns': columns }),
        ...style,
      } as CSSProperties)}
      {...rest}
    >
      {items.map(({ description, href, icon, title }, index) => {
        const content = (
          <>
            {icon && (
              <span {...styleProps(styles.icon, awesomeFeatureGridClasses('icon'))}>
                <Icon icon={icon} size={16} />
              </span>
            )}
            <h3 {...styleProps(styles.title, awesomeFeatureGridClasses('title'))}>{title}</h3>
            <p {...styleProps(styles.description, awesomeFeatureGridClasses('description'))}>
              {description}
            </p>
          </>
        );

        return (
          <Fragment key={typeof title === 'string' ? title : index}>
            {href ? (
              renderLandingLink(renderLink, {
                children: content,
                className: styleProps(styles.item, awesomeFeatureGridClasses('item')).className,
                href,
              })
            ) : (
              <div {...styleProps(styles.item, awesomeFeatureGridClasses('item'))}>{content}</div>
            )}
          </Fragment>
        );
      })}
    </div>
  ),
);

FeatureGrid.displayName = 'FeatureGrid';

export default FeatureGrid;
