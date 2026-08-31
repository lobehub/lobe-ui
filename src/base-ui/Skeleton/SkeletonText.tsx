'use client';

import { cssVar, cx } from 'antd-style';
import { type FC } from 'react';

import Skeleton from './Skeleton';
import { styles } from './style';
import type { SkeletonTextProps } from './type';

const SkeletonText: FC<SkeletonTextProps> = ({
  rows = 1,
  fontSize,
  lineHeight = 1.6,
  gap,
  width,
  className,
  style,
  ...rest
}) => {
  const rowCount = Math.max(rows, 1);
  const base = fontSize === undefined ? cssVar.fontSize : `${fontSize}px`;
  const rowHeight = `round(calc(${base} * ${1 + (lineHeight - 1) * 0.5}), 1px)`;
  const halfLeading =
    gap === undefined ? `round(calc(${base} * ${(lineHeight - 1) * 0.25}), 1px)` : undefined;
  const widths = Array.isArray(width) ? width : undefined;

  const rowWidth = (index: number) => {
    if (widths) return widths[index] ?? widths.at(-1) ?? '100%';
    if (width !== undefined) return width as number | string;
    return index === rowCount - 1 && rowCount > 1 ? '66%' : '100%';
  };

  return (
    <div className={cx(styles.text, className)} style={{ gap, ...style }}>
      {Array.from({ length: rowCount }).map((_, index) => (
        <Skeleton
          height={rowHeight}
          key={index}
          style={{ marginBlock: halfLeading }}
          width={rowWidth(index)}
          {...rest}
        />
      ))}
    </div>
  );
};

SkeletonText.displayName = 'SkeletonText';

export default SkeletonText;
