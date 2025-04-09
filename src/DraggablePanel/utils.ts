import type { DraggablePanelProps } from './type';

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
