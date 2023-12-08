import { ActionIconSize } from '@/ActionIcon/index';

export const calcSize = (size?: ActionIconSize) => {
  let blockSize: number | string;
  let borderRadius: number | string;

  switch (size) {
    case 'large': {
      blockSize = 44;
      borderRadius = 8;
      break;
    }
    case 'normal': {
      blockSize = 36;
      borderRadius = 5;
      break;
    }
    case 'small': {
      blockSize = 24;
      borderRadius = 5;
      break;
    }
    case 'site': {
      blockSize = 34;
      borderRadius = 5;
      break;
    }
    default: {
      blockSize = size?.blockSize || 36;
      borderRadius = size?.borderRadius || 5;
      break;
    }
  }

  return {
    blockSize,
    borderRadius,
  };
};
