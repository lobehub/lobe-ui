'use client';

import { memo } from 'react';

import { Flexbox } from '@/Flex';
import { styleProps } from '@/styles/stylex/props';

import { styles } from './style';
import type { SideNavProps } from './type';

const SideNav = memo<SideNavProps>(({ className, avatar, topActions, bottomActions, ...rest }) => {
  return (
    <Flexbox
      align={'center'}
      className={styleProps(styles.root, className).className}
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
