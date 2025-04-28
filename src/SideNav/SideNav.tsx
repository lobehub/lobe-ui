'use client';

import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useStyles } from './style';
import type { SideNavProps } from './type';

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
      <Flexbox align="center" direction="vertical" gap={12}>
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
