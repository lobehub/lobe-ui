'use client';

import clsx from 'clsx';
import { type FC } from 'react';

import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { styleProps } from '@/styles/stylex/props';

import { SkeletonImpl } from './Skeleton';
import { skeletonTextClasses } from './stable';
import { styles } from './style';
import type { SkeletonTextProps } from './type';

const SkeletonText: FC<SkeletonTextProps> = ({
  rows = 1,
  fontSize,
  lineHeight,
  gap,
  width,
  className,
  style,
  ...rest
}) => {
  const rowCount = Math.max(rows, 1);
  const customMetrics = fontSize !== undefined || lineHeight !== undefined;
  const base = fontSize === undefined ? cssVar.fontSize : `${fontSize}px`;
  const leading = lineHeight ?? 1.6;
  const rowHeight = customMetrics
    ? `round(calc(${base} * ${1 + (leading - 1) * 0.5}), 1px)`
    : undefined;
  const halfLeading =
    customMetrics && gap === undefined
      ? `round(calc(${base} * ${(leading - 1) * 0.25}), 1px)`
      : undefined;
  const widths = Array.isArray(width) ? width : undefined;

  const rowWidth = (index: number) => {
    if (widths) return widths[index] ?? widths.at(-1) ?? '100%';
    if (width !== undefined) return width as number | string;
    return undefined;
  };

  return (
    <div {...styleProps(styles.text, clsx(skeletonTextClasses(), className), { gap, ...style })}>
      {Array.from({ length: rowCount }).map((_, index) => (
        <SkeletonImpl
          className={skeletonTextClasses('row')}
          height={rowHeight}
          key={index}
          style={halfLeading === undefined ? undefined : { marginBlock: halfLeading }}
          width={rowWidth(index)}
          xstyle={[
            styles.row,
            gap !== undefined && styles.rowFlush,
            width === undefined && index === rowCount - 1 && rowCount > 1 && styles.rowShort,
          ]}
          {...rest}
        />
      ))}
    </div>
  );
};

SkeletonText.displayName = 'SkeletonText';

export default SkeletonText;
