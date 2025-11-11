import type { NumberSize, Size } from 're-resizable';
import type { CSSProperties, ReactNode } from 'react';

import type { DivProps } from '@/types';

export interface DraggableSideNavProps extends Omit<DivProps, 'children' | 'onSelect'> {
  /**
   * Body content (main content area)
   * Can be a static element or a function that receives collapsed state
   */
  children: ReactNode | ((collapsed: boolean) => ReactNode);
  /**
   * Classnames for internal components
   */
  classNames?: {
    body?: string;
    container?: string;
    content?: string;
    footer?: string;
    handle?: string;
    header?: string;
  };
  /**
   * Whether the panel is collapsed (controlled)
   */
  collapsed?: boolean;
  /**
   * Whether the panel is collapsed by default
   * @default false
   */
  defaultCollapsed?: boolean;
  /**
   * Default width when expanded
   */
  defaultSize?: Partial<Size>;
  /**
   * Footer content
   * Can be a static element or a function that receives collapsed state
   */
  footer?: ReactNode | ((collapsed: boolean) => ReactNode);
  /**
   * Header content
   * Can be a static element or a function that receives collapsed state
   */
  header?: ReactNode | ((collapsed: boolean) => ReactNode);
  /**
   * Maximum width
   */
  maxWidth?: number;
  /**
   * Minimum width (also the collapsed width)
   * @default 64
   */
  minWidth?: number;
  /**
   * Callback when collapse state changes
   */
  onCollapsedChange?: (collapsed: boolean) => void;
  /**
   * Callback when menu item is selected
   */
  onSelect?: (key: string) => void;
  /**
   * Callback when size changes
   */
  onSizeChange?: (delta: NumberSize, size?: Size) => void;
  /**
   * Callback when actively resizing
   */
  onSizeDragging?: (delta: NumberSize, size?: Size) => void;
  /**
   * Placement of the side nav
   * @default 'left'
   */
  placement?: 'left' | 'right';
  /**
   * Whether to enable resizing
   * @default true
   */
  resizable?: boolean;
  /**
   * Whether to show handle for toggling
   * @default true
   */
  showHandle?: boolean;
  /**
   * Whether to show handle when collapsed
   * @default false
   */
  showHandleWhenCollapsed?: boolean;
  /**
   * Current size (controlled)
   */
  size?: Partial<Size>;
  /**
   * Custom styles
   */
  styles?: {
    body?: CSSProperties;
    container?: CSSProperties;
    content?: CSSProperties;
    footer?: CSSProperties;
    handle?: CSSProperties;
    header?: CSSProperties;
  };
}
