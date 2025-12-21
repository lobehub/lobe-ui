'use client';

import { memo } from 'react';

import { Flexbox } from '@/Flex';

import SkeletonBlock from './SkeletonBlock';
import type { SkeletonParagraphProps } from './type';

const DEFAULT_ROWS = 3;

const SkeletonParagraph = memo<SkeletonParagraphProps>(
  ({
    active,
    rows = DEFAULT_ROWS,
    gap,
    width,
    height,
    fontSize,
    lineHeight,
    style,
    className,
    ...rest
  }) => {
    const rowGap = gap;
    const rowCount = Math.max(rows, 1);
    const baseFontSize = fontSize ?? 14;
    const resolvedLineHeight = lineHeight ?? 1.6;
    const computedHeight = height ? height : Math.round(baseFontSize * resolvedLineHeight);
    const marginBlock = computedHeight - baseFontSize;
    const widthList = Array.isArray(width) ? width : null;

    const getRowWidth = (index: number): string | number => {
      if (widthList) return widthList[index] ?? widthList.at(-1) ?? '100%';
      if (width !== undefined) return width as string | number;
      if (index === rowCount - 1) return '66%';
      return '100%';
    };

    const containerStyle = { gap: rowGap, ...style };

    return (
      <Flexbox
        className={className}
        gap={gap || marginBlock}
        style={containerStyle}
        width={'100%'}
        {...rest}
      >
        {Array.from({ length: rowCount }).map((_, index) => (
          <SkeletonBlock
            active={active}
            height={baseFontSize}
            key={index}
            width={getRowWidth(index)}
          />
        ))}
      </Flexbox>
    );
  },
);

SkeletonParagraph.displayName = 'SkeletonParagraph';

export default SkeletonParagraph;
