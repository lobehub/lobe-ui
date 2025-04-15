'use client';

import { memo } from 'react';

import { useStyles } from './style';
import { SafeAreaProps } from './type';

const SafeArea = memo<SafeAreaProps>(({ position, className, ...rest }) => {
  const { styles, cx } = useStyles();
  return <div className={cx(styles.container, styles[position], className)} {...rest} />;
});

SafeArea.displayName = 'SafeArea';

export default SafeArea;
