import { Tabs, TabsProps } from 'antd';
import { memo } from 'react';

import { useStyles } from './style';

export interface TabsNavProps {
  /**
   * @description Additional className to apply to the component
   */
  className?: string;
  /**
   * @description Callback function that is triggered when a tab is changed
   */
  onChange?: (activeKey: string) => void;
  /**
   * @description An array of objects representing the tabs to be rendered
   */
  items?: TabsProps['items'];
  /**
   * @description The key of the active tab
   */
  activeKey?: TabsProps['activeKey'];
}

const TabsNav = memo<TabsNavProps>(({ className, ...props }) => {
  const { styles, cx } = useStyles();
  return <Tabs className={cx(styles.tabs, className)} {...props} />;
});

export default TabsNav;
