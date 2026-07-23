import type { NumberSize, Size } from 're-resizable';
import type { CSSProperties } from 'react';
import type { Props as RndProps } from 'react-rnd';

import type { DivProps } from '@/types';

type PlacementType = 'right' | 'left' | 'top' | 'bottom';

export interface DraggablePanelProps extends DivProps {
  backgroundColor?: string;
  classNames?: {
    content?: string;
    handle?: string;
  };
  /**
   * Preview a collapsed panel while resizing at or below this size, then commit
   * the collapsed state on pointer release. Dragging back above the threshold
   * before release restores the panel.
   * Applies to width for left/right placement and height for top/bottom placement.
   * Omit to disable drag-to-collapse behavior.
   */
  collapseThreshold?: number;
  defaultExpand?: boolean;
  defaultSize?: Partial<Size>;
  destroyOnClose?: boolean;
  expand?: boolean;
  expandable?: boolean;
  fullscreen?: boolean;
  headerHeight?: number;
  maxHeight?: number;
  maxWidth?: number;
  minHeight?: number;
  minWidth?: number;
  mode?: 'fixed' | 'float';
  onExpandChange?: (expand: boolean) => void;
  onSizeChange?: (delta: NumberSize, size?: Size) => void;
  onSizeDragging?: (delta: NumberSize, size?: Size) => void;
  pin?: boolean;
  placement: PlacementType;
  resize?: RndProps['enableResizing'];
  /**
   * Whether to show border
   * @default true
   */
  showBorder?: boolean;
  showHandleHighlight?: boolean;
  showHandleWhenCollapsed?: boolean;
  showHandleWideArea?: boolean;
  size?: Partial<Size>;
  /**
   * Use two-layer container layout to keep content layout stable when collapsed/expanded.
   * @default false
   */
  stableLayout?: boolean;
  styles?: {
    content?: CSSProperties;
    handle?: CSSProperties;
  };
}
