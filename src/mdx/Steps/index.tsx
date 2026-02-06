'use client';

import { cx } from 'antd-style';
import type { FC } from 'react';

import type { DivProps } from '@/types';

import { styles } from './style';

const Steps: FC<DivProps> = ({ children, className, ...rest }) => {
  return (
    <div className={cx(styles.container, className)} {...rest}>
      {children}
    </div>
  );
};

Steps.displayName = 'MdxSteps';

export default Steps;
