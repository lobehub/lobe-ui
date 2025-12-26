'use client';

import { cx, useTheme } from 'antd-style';
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
  const theme = useTheme();
  const defaultSize = size ?? DEFAULT_SIZE;
  const finalWidth = width ?? defaultSize;
  const finalHeight = height ?? defaultSize;
  const borderRadius = shape === 'circle' ? '50%' : `${theme.borderRadius}px`;

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
