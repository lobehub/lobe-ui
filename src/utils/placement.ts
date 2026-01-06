import type { Align, Side } from '@base-ui/react/utils/useAnchorPositioning';
import type { Placement as FloatingUIPlacement } from '@floating-ui/react';

export type PlacementConfig = {
  align: Align;
  side: Side;
};

/**
 * All supported placement values
 * - Unified placement names for Tooltip, Popover, and DropdownMenu
 * - Ant Design style: topLeft, topCenter, topRight, etc.
 * - Additional aliases: top (same as topCenter), bottom (same as bottomCenter)
 */
export type Placement =
  | 'top'
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'bottom'
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottomRight'
  | 'left'
  | 'leftTop'
  | 'leftBottom'
  | 'right'
  | 'rightTop'
  | 'rightBottom';

const top: PlacementConfig = { align: 'center', side: 'top' };
const topLeft: PlacementConfig = { align: 'start', side: 'top' };
const topRight: PlacementConfig = { align: 'end', side: 'top' };
const bottom: PlacementConfig = { align: 'center', side: 'bottom' };
const bottomLeft: PlacementConfig = { align: 'start', side: 'bottom' };
const bottomRight: PlacementConfig = { align: 'end', side: 'bottom' };
const left: PlacementConfig = { align: 'center', side: 'left' };
const leftTop: PlacementConfig = { align: 'start', side: 'left' };
const leftBottom: PlacementConfig = { align: 'end', side: 'left' };
const right: PlacementConfig = { align: 'center', side: 'right' };
const rightTop: PlacementConfig = { align: 'start', side: 'right' };
const rightBottom: PlacementConfig = { align: 'end', side: 'right' };

/**
 * Map of placement values to Base UI placement config
 * Used by Popover and DropdownMenu components
 */
export const placementMap: Record<Placement, PlacementConfig> = {
  bottom,
  bottomCenter: bottom,
  bottomLeft,
  bottomRight,
  left,
  leftBottom,
  leftTop,
  right,
  rightBottom,
  rightTop,
  top,
  topCenter: top,
  topLeft,
  topRight,
};

/**
 * Convert unified Placement to Floating UI placement format
 * Used by Tooltip component which uses @floating-ui/react
 *
 * @param placement - Unified placement value
 * @returns Floating UI placement (e.g., 'top-start', 'bottom-end')
 */
export const toFloatingUIPlacement = (placement?: Placement): FloatingUIPlacement => {
  if (!placement) return 'top';

  switch (placement) {
    case 'topLeft': {
      return 'top-start';
    }
    case 'top':
    case 'topCenter': {
      return 'top';
    }
    case 'topRight': {
      return 'top-end';
    }
    case 'bottomLeft': {
      return 'bottom-start';
    }
    case 'bottom':
    case 'bottomCenter': {
      return 'bottom';
    }
    case 'bottomRight': {
      return 'bottom-end';
    }
    case 'leftTop': {
      return 'left-start';
    }
    case 'left': {
      return 'left';
    }
    case 'leftBottom': {
      return 'left-end';
    }
    case 'rightTop': {
      return 'right-start';
    }
    case 'right': {
      return 'right';
    }
    case 'rightBottom': {
      return 'right-end';
    }
    default: {
      return 'top';
    }
  }
};
