'use client';

import { memo } from 'react';

import { useStyles } from '../style';
import type { LayoutSidebarProps } from '../type';

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
