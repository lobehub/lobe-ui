'use client';

import './style.css';

import clsx from 'clsx';
import type { FC } from 'react';

import { styleProps } from '@/styles/stylex/props';
import type { DivProps } from '@/types';

import { mdxStepsClasses } from './stable';
import { styles } from './style';

const Steps: FC<DivProps> = ({ children, className, ...rest }) => {
  return (
    <div {...styleProps(styles.container, clsx(mdxStepsClasses(), className))} {...rest}>
      {children}
    </div>
  );
};

Steps.displayName = 'MdxSteps';

export default Steps;
