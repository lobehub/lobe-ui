'use client';

import type { FC } from 'react';

import { cx } from '@/styles';
import type { DivProps } from '@/types';

import { styles } from './style';

export type TabProps = DivProps;

const Tab: FC<TabProps> = ({ children, className, ...rest }) => {
  return (
    <div className={cx(styles.body, className)} {...rest}>
      <div>{children}</div>
    </div>
  );
};

Tab.displayName = 'MdxTab';

export default Tab;
