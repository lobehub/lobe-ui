import { Space } from 'antd';
import { ReactNode, memo } from 'react';

import { DivProps } from '@/types';

import { useStyles } from './style';

export interface SideNavProps extends DivProps {
  /**
   * @description Avatar to be displayed at the top of the sidenav
   */
  avatar?: ReactNode;
  /**
   * @description Actions to be displayed at the bottom of the sidenav
   */
  bottomActions: ReactNode;
  /**
   * @description Actions to be displayed below the avatar
   */
  topActions?: ReactNode;
}

const SideNav = memo<SideNavProps>(({ className, avatar, topActions, bottomActions, ...props }) => {
  const { styles, cx } = useStyles();

  return (
    <div className={cx(styles, className)} {...props}>
      <Space align="center" direction="vertical" size={16}>
        {avatar}
        <Space align="center" direction="vertical" size={8}>
          {topActions}
        </Space>
      </Space>
      <Space align="center" direction="vertical" size={4}>
        {bottomActions}
      </Space>
    </div>
  );
});

export default SideNav;
