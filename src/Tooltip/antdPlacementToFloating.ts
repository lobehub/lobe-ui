import type { Placement } from '@floating-ui/react';

/**
 * Convert Ant Design legacy placements to Floating UI placements.
 *
 * Notes:
 * - Floating UI placements like `top-start` are passed through.
 * - Ant Design legacy placements like `topLeft` are mapped to Floating UI.
 */
export const antdPlacementToFloating = (
  placement?:
    | Placement
    | 'topLeft'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomRight'
    | 'leftTop'
    | 'leftBottom'
    | 'rightTop'
    | 'rightBottom'
    | 'top'
    | 'bottom'
    | 'left'
    | 'right',
): Placement => {
  if (!placement) return 'top';

  // Floating UI placements are already compatible.
  if (typeof placement === 'string' && placement.includes('-')) return placement as Placement;

  switch (placement) {
    case 'topLeft': {
      return 'top-start';
    }
    case 'topRight': {
      return 'top-end';
    }
    case 'bottomLeft': {
      return 'bottom-start';
    }
    case 'bottomRight': {
      return 'bottom-end';
    }
    case 'leftTop': {
      return 'left-start';
    }
    case 'leftBottom': {
      return 'left-end';
    }
    case 'rightTop': {
      return 'right-start';
    }
    case 'rightBottom': {
      return 'right-end';
    }
    default: {
      return placement as Placement;
    }
  }
};
