'use client';

import { FC } from 'react';

import { DivProps } from '@/types';

import { useStyles } from './style';

const Steps: FC<DivProps> = ({ children, className, ...rest }) => {
  const { cx, styles } = useStyles();

  return (
    <div className={cx(styles.container, className)} {...rest}>
      {children}
    </div>
  );
};

Steps.displayName = 'MdxSteps';

export default Steps;
