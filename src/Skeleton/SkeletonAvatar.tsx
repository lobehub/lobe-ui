'use client';

import clsx from 'clsx';
import { type FC } from 'react';

import { toDataAttributes } from '@/utils/bem';

import { SkeletonImpl } from './Skeleton';
import { skeletonAvatarClasses } from './stable';
import { styles } from './style';
import type { SkeletonAvatarProps } from './type';

const SkeletonAvatar: FC<SkeletonAvatarProps> = ({
  shape = 'square',
  size,
  width,
  height,
  className,
  ...rest
}) => (
  <SkeletonImpl
    className={clsx(skeletonAvatarClasses(), className)}
    height={height ?? size}
    width={width ?? size}
    xstyle={[styles.avatar, shape === 'circle' && styles.avatarCircle]}
    {...toDataAttributes({ shape })}
    {...rest}
  />
);

SkeletonAvatar.displayName = 'SkeletonAvatar';

export default SkeletonAvatar;
