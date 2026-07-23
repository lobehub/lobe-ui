import type { Size } from 're-resizable';

import type { DraggablePanelProps } from './type';

interface IsBelowCollapseThresholdOptions {
  axis: 'height' | 'width';
  collapseThreshold?: number;
  size: Size;
}

export const isBelowCollapseThreshold = ({
  axis,
  collapseThreshold,
  size,
}: IsBelowCollapseThresholdOptions): boolean => {
  if (collapseThreshold === undefined) return false;

  const currentSize = size[axis];
  if (currentSize === undefined) return false;

  const numericSize =
    typeof currentSize === 'number' ? currentSize : Number.parseFloat(currentSize);

  return Number.isFinite(numericSize) && numericSize <= Math.max(collapseThreshold, 0);
};

export const reversePlacement = (placement: DraggablePanelProps['placement']) => {
  switch (placement) {
    case 'bottom': {
      return 'top';
    }
    case 'top': {
      return 'bottom';
    }
    case 'right': {
      return 'left';
    }
    case 'left': {
      return 'right';
    }
  }
};
