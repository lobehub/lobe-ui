'use client';

import { Tabs, TabsProps } from 'antd';
import { memo } from 'react';

import { useStyles } from './style';

export interface TabsNavProps extends TabsProps {
  variant?: 'default' | 'compact';
}

const TabsNav = memo<TabsNavProps>(({ className, variant, ...rest }) => {
  const { styles, cx } = useStyles();

  return (
    <Tabs
      className={cx(styles.tabs, variant === 'compact' && styles.compact, className)}
      {...rest}
    />
  );
});

export default TabsNav;
