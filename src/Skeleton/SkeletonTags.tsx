'use client';

import { useTheme } from 'antd-style';
import { type FC } from 'react';

import { Flexbox } from '@/Flex';

import SkeletonBlock from './SkeletonBlock';
import type { SkeletonTagsProps } from './type';

const DEFAULT_COUNT = 1;

const HEIGHT_MAP: Record<'small' | 'middle' | 'large', number> = {
  large: 28,
  middle: 22,
  small: 20,
};

const DEFAULT_WIDTH_MAP: Record<'small' | 'middle' | 'large', number> = {
  large: 64,
  middle: 48,
  small: 36,
};

const SkeletonTags: FC<SkeletonTagsProps> = ({
  active,
  className,
  count = DEFAULT_COUNT,
  gap,
  height,
  size = 'middle',
  style,
  width,
  ...rest
}) => {
  const theme = useTheme();
  const resolvedGap = gap ?? theme.paddingXS ?? 4;
  const resolvedCount = Math.max(count, 1);
  const resolvedHeight = height ?? HEIGHT_MAP[size];
  const widthList = Array.isArray(width) ? width : null;
  const defaultWidth = DEFAULT_WIDTH_MAP[size];

  const RADIUS_MAP: Record<'large' | 'small' | 'middle', number> = {
    large: theme.borderRadius,
    middle: theme.borderRadiusSM,
    small: theme.borderRadiusXS,
  };

  const getWidth = (index: number) => {
    if (widthList) return widthList[index] ?? widthList.at(-1) ?? defaultWidth;
    if (width !== undefined) return width as string | number;
    return defaultWidth;
  };

  return (
    <Flexbox className={className} horizontal style={{ gap: resolvedGap, ...style }} {...rest}>
      {Array.from({ length: resolvedCount }).map((_, index) => (
        <SkeletonBlock
          active={active}
          height={resolvedHeight}
          key={index}
          style={{
            borderRadius: RADIUS_MAP[size],
          }}
          width={getWidth(index)}
        />
      ))}
    </Flexbox>
  );
};

SkeletonTags.displayName = 'SkeletonTags';

export default SkeletonTags;
