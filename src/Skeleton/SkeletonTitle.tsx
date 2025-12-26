'use client';

import { useTheme } from 'antd-style';
import { type FC } from 'react';

import SkeletonBlock from './SkeletonBlock';
import type { SkeletonTitleProps } from './type';

const DEFAULT_FONT_SIZE = 18;

const SkeletonTitle: FC<SkeletonTitleProps> = ({
  active,
  fontSize,
  lineHeight,
  height,
  width = '60%',
  style,
  className,
  ...rest
}) => {
  const theme = useTheme();
  const baseFontSize = fontSize ?? theme.fontSize ?? DEFAULT_FONT_SIZE;
  const resolvedLineHeight = lineHeight ?? 1.6;
  const computedHeight = height ? height : Math.round(baseFontSize * resolvedLineHeight);
  const marginBlock = computedHeight - baseFontSize;

  return (
    <SkeletonBlock
      active={active}
      className={className}
      height={Math.round(baseFontSize + marginBlock * 0.5)}
      style={{
        marginBlock: Math.round((marginBlock * 0.5) / 2),
        ...style,
      }}
      width={width}
      {...rest}
    />
  );
};

SkeletonTitle.displayName = 'SkeletonTitle';

export default SkeletonTitle;
