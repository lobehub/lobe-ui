import type { CSSProperties } from 'react';

import type { DivProps } from '@/types';

import type { Placement } from './core/axes';

export type DraggablePanelPlacement = Placement;

export interface DraggablePanelSize {
  height?: number | string;
  width?: number | string;
}

export interface DraggablePanelProps extends Omit<DivProps, 'onDrag'> {
  backgroundColor?: string;
  classNames?: {
    content?: string;
  };
  /**
   * Preview a collapsed panel while resizing at or below this size, then commit
   * the collapsed state on pointer release. Dragging back above the threshold
   * before release restores the panel.
   * Omit to disable drag-to-collapse behavior.
   */
  collapseThreshold?: number;
  defaultExpand?: boolean;
  defaultSize?: DraggablePanelSize;
  expand?: boolean;
  expandable?: boolean;
  maxHeight?: number;
  maxWidth?: number;
  minHeight?: number;
  minWidth?: number;
  mode?: 'fixed' | 'float';
  onExpandChange?: (expand: boolean) => void;
  onSizeChange?: (delta: DraggablePanelSize, size: DraggablePanelSize) => void;
  onSizeDragging?: (delta: DraggablePanelSize, size: DraggablePanelSize) => void;
  /**
   * `placement` is resolved against the inline axis, so `left` means inline-start
   * and flips with `dir="rtl"`.
   */
  placement?: DraggablePanelPlacement;
  showBorder?: boolean;
  showHandleWhenCollapsed?: boolean;
  /**
   * Widen the resize handle's hit area from 8px to 16px. A coarse pointer always
   * gets 20px regardless.
   */
  showHandleWideArea?: boolean;
  size?: DraggablePanelSize;
  styles?: {
    content?: CSSProperties;
  };
}
