'use client';

import { memo } from 'react';

import { cx } from '@/styles';

import { styles } from '../style';
import type { LayoutSidebarInnerProps } from '../type';

export const LayoutSidebarInner = memo<LayoutSidebarInnerProps>(
  ({ headerHeight, children, className, ...rest }) => {
    // headerHeight is part of the interface but not used in this component
    void headerHeight;
    return (
      <div className={cx(styles.asideInner, className)} {...rest}>
        {children}
      </div>
    );
  },
);

LayoutSidebarInner.displayName = 'LayoutSidebarInner';

export default LayoutSidebarInner;
