'use client';

import './style.css';

import clsx from 'clsx';
import type { FC } from 'react';

import { styleProps } from '@/styles/stylex/props';
import type { DivProps } from '@/types';

import { styles } from './style';

const Steps: FC<DivProps> = ({ children, className, ...rest }) => {
  return (
    <div {...styleProps(styles.container, clsx('lobe-mdx-steps', className))} {...rest}>
      {children}
    </div>
  );
};

Steps.displayName = 'MdxSteps';

export default Steps;
