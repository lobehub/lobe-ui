'use client';

import { memo } from 'react';

import { useStyles } from '../style';
import type { LayoutSidebarInnerProps } from '../type';

export const LayoutSidebarInner = memo<LayoutSidebarInnerProps>(
  ({ headerHeight, children, className, ...rest }) => {
    const { cx, styles } = useStyles(headerHeight);
    return (
      <div className={cx(styles.asideInner, className)} {...rest}>
        {children}
      </div>
    );
  },
);

LayoutSidebarInner.displayName = 'LayoutSidebarInner';

export default LayoutSidebarInner;
