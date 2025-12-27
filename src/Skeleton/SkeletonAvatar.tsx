'use client';

import { cssVar, cx } from 'antd-style';
import { type FC } from 'react';

import SkeletonBlock from './SkeletonBlock';
import { styles } from './style';
import type { SkeletonAvatarProps } from './type';

const DEFAULT_SIZE = 40;

const SkeletonAvatar: FC<SkeletonAvatarProps> = ({
  active,
  shape = 'square',
  size,
  width,
  height,
  style,
  className,
  ...rest
}) => {
  const defaultSize = size ?? DEFAULT_SIZE;
  const finalWidth = width ?? defaultSize;
  const finalHeight = height ?? defaultSize;
  const borderRadius = shape === 'circle' ? '50%' : cssVar.borderRadius;

  return (
    <SkeletonBlock
      active={active}
      className={cx(styles.avatar, className)}
      height={finalHeight}
      style={{ borderRadius, ...style }}
      width={finalWidth}
      {...rest}
    />
  );
};

SkeletonAvatar.displayName = 'SkeletonAvatar';

export default SkeletonAvatar;
