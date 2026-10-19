'use client';

import './style.css';

import clsx from 'clsx';

import { Flexbox } from '@/Flex';
import { styleProps } from '@/styles/stylex/props';
import Text from '@/Text';

import { dashboardPageHeaderClasses } from './stable';
import { styles } from './style';
import type { PageHeaderProps } from './type';

function PageHeader({ action, children, className, description, mark, title }: PageHeaderProps) {
  const extra = action ?? children;
  return (
    <div {...styleProps(styles.root, clsx(dashboardPageHeaderClasses(), className))}>
      <Flexbox
        align={mark ? 'flex-start' : undefined}
        className={dashboardPageHeaderClasses('main')}
        gap={12}
        horizontal={Boolean(mark)}
      >
        {mark}
        <Flexbox className={dashboardPageHeaderClasses('copy')} gap={8}>
          <Text as="h1" className={dashboardPageHeaderClasses('title')} weight="bold">
            {title}
          </Text>
          {description ? (
            <Text className={dashboardPageHeaderClasses('description')}>{description}</Text>
          ) : null}
        </Flexbox>
      </Flexbox>
      {extra ? (
        <div
          {...styleProps(
            styles.actions,
            clsx(dashboardPageHeaderClasses('actions'), 'lobe-page-header-actions'),
          )}
        >
          {extra}
        </div>
      ) : null}
    </div>
  );
}

PageHeader.displayName = 'PageHeader';

export default PageHeader;
