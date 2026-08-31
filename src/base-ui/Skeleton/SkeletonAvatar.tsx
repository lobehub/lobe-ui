'use client';

import { cx } from 'antd-style';
import { type FC } from 'react';

import Skeleton from './Skeleton';
import { styles } from './style';
import type { SkeletonAvatarProps } from './type';

const DEFAULT_SIZE = 40;

const SkeletonAvatar: FC<SkeletonAvatarProps> = ({
  shape = 'square',
  size = DEFAULT_SIZE,
  width,
  height,
  className,
  ...rest
}) => (
  <Skeleton
    className={cx(styles.avatar, className)}
    height={height ?? size}
    radius={shape === 'circle' ? '50%' : undefined}
    width={width ?? size}
    {...rest}
  />
);

SkeletonAvatar.displayName = 'SkeletonAvatar';

export default SkeletonAvatar;
