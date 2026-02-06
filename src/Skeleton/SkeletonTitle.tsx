'use client';

import { cssVar } from 'antd-style';
import { type FC } from 'react';

import SkeletonBlock from './SkeletonBlock';
import type { SkeletonTitleProps } from './type';

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
  const resolvedLineHeight = lineHeight ?? 1.6;
  const baseFontSize = fontSize !== undefined ? `${fontSize}px` : cssVar.fontSize;

  // height = baseFontSize * (1 + (lineHeight - 1) * 0.5)
  const heightMultiplier = 1 + (resolvedLineHeight - 1) * 0.5;
  // marginBlock = baseFontSize * (lineHeight - 1) * 0.25
  const marginMultiplier = (resolvedLineHeight - 1) * 0.25;

  return (
    <SkeletonBlock
      active={active}
      className={className}
      height={height ?? `round(calc(${baseFontSize} * ${heightMultiplier}), 1px)`}
      width={width}
      style={{
        marginBlock: `round(calc(${baseFontSize} * ${marginMultiplier}), 1px)`,
        ...style,
      }}
      {...rest}
    />
  );
};

SkeletonTitle.displayName = 'SkeletonTitle';

export default SkeletonTitle;
