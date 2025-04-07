'use client';

import { memo } from 'react';

import { DivProps } from '@/types';

import { useStyles } from '../style';

export interface LayoutSidebarInnerProps extends DivProps {
  headerHeight?: number;
}
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
