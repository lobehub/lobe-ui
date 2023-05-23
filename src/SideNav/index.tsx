import { DivProps } from '@/types';
import { Space } from 'antd';
import { memo, ReactNode } from 'react';
import { useStyles } from './style';

export interface SideNavProps extends DivProps {
  /**
   * @description Avatar to be displayed at the top of the sidenav
   */
  avatar?: ReactNode;
  /**
   * @description Actions to be displayed below the avatar
   */
  topActions?: ReactNode;
  /**
   * @description Actions to be displayed at the bottom of the sidenav
   */
  bottomActions: ReactNode;
}

const SideNav = memo<SideNavProps>(({ className, avatar, topActions, bottomActions, ...props }) => {
  const { styles, cx } = useStyles();
  return (
    <div className={cx(styles, className)} {...props}>
      <Space size={16} direction="vertical" align="center">
        {avatar}
        <Space size={8} direction="vertical" align="center">
          {topActions}
        </Space>
      </Space>
      <Space size={4} direction="vertical" align="center">
        {bottomActions}
      </Space>
    </div>
  );
});

export default SideNav;
