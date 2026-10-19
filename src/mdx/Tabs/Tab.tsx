'use client';

import clsx from 'clsx';
import type { FC } from 'react';

import { styleProps } from '@/styles/stylex/props';
import type { DivProps } from '@/types';

import { mdxTabsClasses } from './stable';
import { styles } from './style';

export type TabProps = DivProps;

const Tab: FC<TabProps> = ({ children, className, ...rest }) => {
  return (
    <div {...styleProps(styles.body, clsx(mdxTabsClasses('panel'), className))} {...rest}>
      <div {...styleProps(styles.inner, mdxTabsClasses('content'))}>{children}</div>
    </div>
  );
};

Tab.displayName = 'MdxTab';

export default Tab;
