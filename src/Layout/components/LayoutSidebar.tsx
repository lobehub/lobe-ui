'use client';

import { memo } from 'react';

import { DivProps } from '@/types';

import { useStyles } from '../style';

export interface LayoutSidebarProps extends DivProps {
  headerHeight?: number;
}
export const LayoutSidebar = memo<LayoutSidebarProps>(
  ({ headerHeight, children, className, style, ...rest }) => {
    const { cx, styles } = useStyles(headerHeight);
    return (
      <aside
        className={cx(styles.aside, className)}
        style={{ top: headerHeight, ...style }}
        {...rest}
      >
        {children}
      </aside>
    );
  },
);

LayoutSidebar.displayName = 'LayoutSidebar';

export default LayoutSidebar;
