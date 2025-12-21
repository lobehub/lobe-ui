'use client';

import { type FC } from 'react';

import Block from '@/Block';
import { SkeletonBlockProps } from '@/Skeleton/type';

import { useStyles } from './style';

const SkeletonBlock: FC<SkeletonBlockProps> = ({
  width = '100%',
  height = '1em',
  active,
  style,
  className,
}) => {
  const { cx, styles } = useStyles();
  return (
    <Block
      className={cx(styles.base, active && styles.active, className)}
      height={height}
      style={style}
      variant={'filled'}
      width={width}
    />
  );
};

SkeletonBlock.displayName = 'SkeletonBlock';

export default SkeletonBlock;
