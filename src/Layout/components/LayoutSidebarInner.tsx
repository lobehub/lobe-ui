'use client';

import clsx from 'clsx';
import { memo } from 'react';

import { styleProps } from '@/styles/stylex/props';

import { layoutClasses } from '../stable';
import { styles } from '../style';
import type { LayoutSidebarInnerProps } from '../type';

export const LayoutSidebarInner = memo<LayoutSidebarInnerProps>(
  ({ headerHeight, children, className, ...rest }) => {
    // headerHeight is part of the interface but not used in this component
    void headerHeight;
    return (
      <div
        className={
          styleProps(styles.asideInner, clsx(layoutClasses('sidebar-inner'), className)).className
        }
        {...rest}
      >
        {children}
      </div>
    );
  },
);

LayoutSidebarInner.displayName = 'LayoutSidebarInner';

export default LayoutSidebarInner;
