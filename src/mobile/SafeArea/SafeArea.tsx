'use client';

import { cx } from 'antd-style';
import { type FC } from 'react';

import { styles } from './style';
import { SafeAreaProps } from './type';

const SafeArea: FC<SafeAreaProps> = ({ position, className, ...rest }) => {
  return <div className={cx(styles.container, styles[position], className)} {...rest} />;
};

SafeArea.displayName = 'SafeArea';

export default SafeArea;
