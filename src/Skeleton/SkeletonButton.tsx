'use client';

import { useTheme } from 'antd-style';
import { type FC } from 'react';

import SkeletonBlock from './SkeletonBlock';
import type { SkeletonButtonProps } from './type';

const HEIGHT_MAP: Record<'large' | 'small' | 'default', number> = {
  default: 36,
  large: 46,
  small: 28,
};

const SkeletonButton: FC<SkeletonButtonProps> = ({
  active,
  block = false,
  shape = 'default',
  size = 'default',
  width,
  height,
  style,
  className,
  ...rest
}) => {
  const theme = useTheme();
  const resolvedSize = size ?? 'default';
  const baseHeight = height ?? HEIGHT_MAP[resolvedSize];
  const defaultWidth = block ? '100%' : shape === 'circle' ? baseHeight : 80;
  const finalWidth = width ?? defaultWidth;

  const RADIUS_MAP: Record<'large' | 'small' | 'default', number> = {
    default: theme.borderRadius,
    large: theme.borderRadiusLG,
    small: theme.borderRadiusSM,
  };

  const borderRadius =
    shape === 'circle'
      ? '50%'
      : shape === 'round'
        ? `${theme.borderRadius * 2}px`
        : RADIUS_MAP[resolvedSize];

  return (
    <SkeletonBlock
      active={active}
      className={className}
      height={baseHeight}
      style={{ borderRadius, ...style }}
      width={finalWidth}
      {...rest}
    />
  );
};

SkeletonButton.displayName = 'SkeletonButton';

export default SkeletonButton;
