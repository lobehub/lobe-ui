'use client';

import { type FC } from 'react';

import { styleProps } from '@/styles/stylex/props';

import { styles } from './style';
import type { SafeAreaProps } from './type';

const SafeArea: FC<SafeAreaProps> = ({ position, className, style, ...rest }) => {
  return <div {...styleProps([styles.container, styles[position]], className, style)} {...rest} />;
};

SafeArea.displayName = 'SafeArea';

export default SafeArea;
