'use client';

import { ReactNode, memo } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';

import { useStyles } from './style';

export interface SideNavProps extends FlexboxProps {
  avatar?: ReactNode;
  bottomActions: ReactNode;
  topActions?: ReactNode;
}

const SideNav = memo<SideNavProps>(({ className, avatar, topActions, bottomActions, ...rest }) => {
  const { styles, cx } = useStyles();

  return (
    <Flexbox
      align={'center'}
      className={cx(styles, className)}
      flex={'none'}
      justify={'space-between'}
      {...rest}
    >
      <Flexbox align="center" direction="vertical" gap={16}>
        {avatar}
        <Flexbox align="center" direction="vertical" gap={8}>
          {topActions}
        </Flexbox>
      </Flexbox>
      <Flexbox align="center" direction="vertical" gap={4}>
        {bottomActions}
      </Flexbox>
    </Flexbox>
  );
});

SideNav.displayName = 'SideNav';

export default SideNav;
