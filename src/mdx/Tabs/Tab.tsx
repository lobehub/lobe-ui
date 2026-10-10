'use client';

import * as stylex from '@stylexjs/stylex';
import type { FC } from 'react';

import { styleProps } from '@/styles/stylex/props';
import type { DivProps } from '@/types';

import { styles } from './style';

export type TabProps = DivProps;

const Tab: FC<TabProps> = ({ children, className, ...rest }) => {
  return (
    <div {...styleProps(styles.body, className)} {...rest}>
      <div {...stylex.props(styles.inner)}>{children}</div>
    </div>
  );
};

Tab.displayName = 'MdxTab';

export default Tab;
