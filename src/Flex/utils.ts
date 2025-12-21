import type { FlexDirection } from './type';

export const getPrefix = (prefixCls?: string) => {
  if (prefixCls) return prefixCls;
  return 'lobe';
};

export const getFlexDirection = (direction?: FlexDirection, isHorizontal?: boolean) => {
  if (isHorizontal) return 'row';

  switch (direction) {
    case 'horizontal': {
      return 'row';
    }
    case 'horizontal-reverse': {
      return 'row-reverse';
    }
    case 'vertical':
    default: {
      return 'column';
    }
    case 'vertical-reverse': {
      return 'column-reverse';
    }
  }
};

export const isSpaceDistribution = (distribution?: string) => {
  if (!distribution) return;
  return ['space-between', 'space-around', 'space-evenly'].includes(distribution);
};

export const isHorizontal = (direction?: FlexDirection, isHorizontal?: boolean) =>
  getFlexDirection(direction, isHorizontal) === 'row';

export const isVertical = (direction?: FlexDirection, isHorizontal?: boolean) =>
  getFlexDirection(direction, isHorizontal) === 'column';

export const getCssValue = (value: string | number | undefined) =>
  typeof value === 'number' ? `${value}px` : value;
