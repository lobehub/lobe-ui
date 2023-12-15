import { Tabs, TabsProps } from 'antd';
import { memo } from 'react';

import { useStyles } from './style';

export interface TabsNavProps {
  /**
   * @description The key of the active tab
   */
  activeKey?: TabsProps['activeKey'];
  /**
   * @description Additional className to apply to the component
   */
  className?: string;
  /**
   * @description An array of objects representing the tabs to be rendered
   */
  items?: TabsProps['items'];
  /**
   * @description Callback function that is triggered when a tab is changed
   */
  onChange?: (activeKey: string) => void;
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
