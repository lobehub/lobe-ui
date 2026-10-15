import { isNumber } from 'es-toolkit/compat';

import type { ActionIconSize } from './type';

export const actionIconOutdent = {
  large: 10,
  middle: 8,
  small: 5,
} as const;

const toCss = (value: number | string) => (isNumber(value) ? `${value}px` : value);

export const calcSize = (iconSize?: ActionIconSize) => {
  let blockSize: number | string;
  let borderRadius: number | string;

  if (isNumber(iconSize)) {
    const blockSize = iconSize * 1.8;
    return {
      blockSize,
      borderRadius: Math.floor(blockSize / 6),
    };
  }

  switch (iconSize) {
    case 'large': {
      blockSize = 44;
      borderRadius = 8;
      break;
    }
    case 'middle': {
      blockSize = 36;
      borderRadius = 6;
      break;
    }
    case 'small': {
      blockSize = 24;
      borderRadius = 4;
      break;
    }
    default: {
      if (iconSize) {
        blockSize = iconSize?.blockSize || 36;
        borderRadius = iconSize?.borderRadius || 6;
      } else {
        blockSize = '1.8em';
        borderRadius = '0.3em';
      }

      break;
    }
  }

  return {
    blockSize,
    borderRadius,
  };
};

export const calcOutdent = (iconSize?: ActionIconSize) => {
  if (isNumber(iconSize)) {
    return `${iconSize * 0.4}px`;
  }

  switch (iconSize) {
    case 'large': {
      return `${actionIconOutdent.large}px`;
    }
    case 'middle': {
      return `${actionIconOutdent.middle}px`;
    }
    case 'small': {
      return `${actionIconOutdent.small}px`;
    }
    default: {
      if (iconSize) {
        const { blockSize } = calcSize(iconSize);
        const glyph = iconSize.size ?? 24;
        if (isNumber(blockSize) && isNumber(glyph)) {
          return `${Math.max(0, (blockSize - glyph) / 2)}px`;
        }
        return `calc((${toCss(blockSize)} - ${toCss(glyph)}) / 2)`;
      }
      return '0.4em';
    }
  }
};
