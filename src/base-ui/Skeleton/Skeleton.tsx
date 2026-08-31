'use client';

import { cx } from 'antd-style';
import { type FC } from 'react';

import { styles } from './style';
import type { SkeletonProps } from './type';

const Skeleton: FC<SkeletonProps> = ({
  animated = true,
  width = '100%',
  height = '1em',
  radius,
  className,
  style,
  ...rest
}) => (
  <div
    className={cx(styles.base, animated && styles.animated, className)}
    style={{ borderRadius: radius, height, width, ...style }}
    {...rest}
  />
);

Skeleton.displayName = 'Skeleton';

export default Skeleton;
