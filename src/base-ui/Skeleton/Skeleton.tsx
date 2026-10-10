'use client';

import { type FC } from 'react';

import { cx } from '@/styles';

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
    style={{ borderRadius: radius, height, width, ...style }}
    className={cx(
      styles.base,
      animated && styles[animated === true ? 'fade' : animated],
      className,
    )}
    {...rest}
  />
);

Skeleton.displayName = 'Skeleton';

export default Skeleton;
