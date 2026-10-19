'use client';

import clsx from 'clsx';

import { styleProps } from '@/styles/stylex/props';

import { dashboardPageToolbarClasses } from './stable';
import { styles } from './style';
import type { PageToolbarProps } from './type';

/** Filters start at the left edge; actions hold the right edge, also after wrapping. */
const PageToolbar = ({ actions, children, className }: PageToolbarProps) => (
  <div {...styleProps(styles.root, clsx(dashboardPageToolbarClasses(), className))}>
    {children ? (
      <div {...styleProps(styles.filters, dashboardPageToolbarClasses('filters'))}>{children}</div>
    ) : null}
    {actions ? (
      <div {...styleProps(styles.actions, dashboardPageToolbarClasses('actions'))}>{actions}</div>
    ) : null}
  </div>
);

PageToolbar.displayName = 'PageToolbar';

export default PageToolbar;
