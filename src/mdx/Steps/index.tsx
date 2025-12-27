'use client';

import { cx } from 'antd-style';
import { FC } from 'react';

import { DivProps } from '@/types';

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
