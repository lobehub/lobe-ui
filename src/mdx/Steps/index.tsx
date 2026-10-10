'use client';

import type { FC } from 'react';

import { cx } from '@/styles';
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
