import { ReactNode, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

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

const SideNav = memo<SideNavProps>(({ className, avatar, topActions, bottomActions, ...rest }) => {
  const { styles, cx } = useStyles();

  return (
    <div className={cx(styles, className)} {...rest}>
      <Flexbox align="center" direction="vertical" gap={16}>
        {avatar}
        <Flexbox align="center" direction="vertical" gap={8}>
          {topActions}
        </Flexbox>
      </Flexbox>
      <Flexbox align="center" direction="vertical" gap={4}>
        {bottomActions}
      </Flexbox>
    </div>
  );
});

export default SideNav;
