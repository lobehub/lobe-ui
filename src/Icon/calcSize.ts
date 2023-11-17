import { IconSize } from '@/Icon/index';

export const calcSize = (size?: IconSize) => {
  let fontSize: number | string;
  let strokeWidth: number | string;

  switch (size) {
    case 'large': {
      fontSize = 24;
      strokeWidth = 2;
      break;
    }
    case 'normal': {
      fontSize = 20;
      strokeWidth = 2;
      break;
    }
    case 'small': {
      fontSize = 14;
      strokeWidth = 1.5;
      break;
    }
    default: {
      if (size) {
        fontSize = size?.fontSize || 24;
        strokeWidth = size?.strokeWidth || 2;
      } else {
        fontSize = '1em';
        strokeWidth = 2;
      }
      break;
    }
  }
  return { fontSize, strokeWidth };
};
