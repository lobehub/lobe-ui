'use client';

import { type FC } from 'react';

import { cx } from '@/styles';

import { styles } from './style';
import type { SafeAreaProps } from './type';

const SafeArea: FC<SafeAreaProps> = ({ position, className, ...rest }) => {
  return <div className={cx(styles.container, styles[position], className)} {...rest} />;
};

SafeArea.displayName = 'SafeArea';

export default SafeArea;
