import type { EngineColumn, FixedInfo } from './types';

export interface StickyOffsets {
  end: number[];
  start: number[];
  widths: readonly number[];
}

export const getStickyOffsets = (
  widths: readonly number[],
  leaves: readonly Pick<EngineColumn, 'fixed'>[],
): StickyOffsets => {
  const count = leaves.length;
  const collect = (from: number, to: number, step: number) => {
    const offsets: number[] = [];
    let total = 0;
    for (let index = from; index !== to; index += step) {
      offsets.push(total);
      if (leaves[index].fixed) total += widths[index] || 0;
    }
    return offsets;
  };
  return { end: collect(count - 1, -1, -1).reverse(), start: collect(0, count, 1), widths };
};

const isStart = (column?: Pick<EngineColumn, 'fixed'>) => column?.fixed === 'start';
const isEnd = (column?: Pick<EngineColumn, 'fixed'>) => column?.fixed === 'end';

export const getFixedInfo = (
  colStart: number,
  colEnd: number,
  leaves: readonly Pick<EngineColumn, 'fixed'>[],
  offsets: StickyOffsets,
): FixedInfo => {
  const count = leaves.length;
  const info: FixedInfo = {
    offsetFixedEndShadow: 0,
    offsetFixedStartShadow: 0,
    shadowEnd: false,
    shadowStart: false,
    zIndex: 0,
    zIndexReverse: 0,
  };

  if (isStart(leaves[colStart]) && isStart(leaves[colEnd])) {
    info.fixStart = offsets.start[colStart];
    info.shadowStart = !isStart(leaves[colEnd + 1]);
    info.zIndex = count * 2 - colStart;
    info.zIndexReverse = count + colStart;
  } else if (isEnd(leaves[colEnd]) && isEnd(leaves[colStart])) {
    info.fixEnd = offsets.end[colEnd];
    info.shadowEnd = !isEnd(leaves[colStart - 1]);
    info.zIndex = colEnd;
    info.zIndexReverse = count - colEnd;
  }

  if (info.shadowStart) {
    for (let index = 0; index < colStart; index += 1) {
      if (!isStart(leaves[index])) info.offsetFixedStartShadow += offsets.widths[index] || 0;
    }
  }
  if (info.shadowEnd) {
    for (let index = count - 1; index > colEnd; index -= 1) {
      if (!isEnd(leaves[index])) info.offsetFixedEndShadow += offsets.widths[index] || 0;
    }
  }
  return info;
};
