'use client';

import { type FC } from 'react';

import { styleProps } from '@/styles/stylex/props';

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
    className={styleProps(styles.avatar, className).className}
    height={height ?? size}
    radius={shape === 'circle' ? '50%' : undefined}
    width={width ?? size}
    {...rest}
  />
);

SkeletonAvatar.displayName = 'SkeletonAvatar';

export default SkeletonAvatar;
