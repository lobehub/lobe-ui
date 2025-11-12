import type { NumberSize, Size } from 're-resizable';
import type { CSSProperties } from 'react';
import type { Props as RndProps } from 'react-rnd';

import type { DivProps } from '@/types';

type PlacementType = 'right' | 'left' | 'top' | 'bottom';

export interface DraggablePanelProps extends DivProps {
  classNames?: {
    content?: string;
    handle?: string;
  };
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
  styles?: {
    content?: CSSProperties;
    handle?: CSSProperties;
  };
}
