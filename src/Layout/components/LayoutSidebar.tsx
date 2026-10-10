'use client';

import { memo } from 'react';

import { styleProps } from '@/styles/stylex/props';

import { styles } from '../style';
import type { LayoutSidebarProps } from '../type';

export const LayoutSidebar = memo<LayoutSidebarProps>(
  ({ headerHeight, children, className, style, ...rest }) => {
    return (
      <aside
        className={styleProps(styles.aside, className).className}
        style={{
          top: `var(--layout-header-height, ${headerHeight}px)`,
          ...style,
        }}
        {...rest}
      >
        {children}
      </aside>
    );
  },
);

LayoutSidebar.displayName = 'LayoutSidebar';

export default LayoutSidebar;
