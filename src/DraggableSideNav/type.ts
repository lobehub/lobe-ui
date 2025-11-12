import type { NumberSize } from 're-resizable';
import type { CSSProperties, ReactNode } from 'react';

import type { DivProps } from '@/types';

export interface DraggableSideNavProps extends Omit<DivProps, 'children' | 'onSelect'> {
  /**
   * Animation configuration for content transitions
   * Set to false to disable all animations
   * @default undefined
   */
  animation?:
    | false
    | {
        /**
         * Enable blur effect during transitions
         * @default false
         */
        blur?: boolean;
        /**
         * Enable animation for body section
         * @default false
         */
        body?: boolean;
        /**
         * Enable fade effect during transitions
         * @default true
         */
        fade?: boolean;
        /**
         * Enable animation for footer section
         * @default false
         */
        footer?: boolean;
        /**
         * Enable animation for header section
         * @default false
         */
        header?: boolean;
      };
  backgroundColor?: string;
  /**
   * Body content (main content area)
   * Can be a static element or a function that receives expand state
   */
  children: ReactNode | ((expand: boolean) => ReactNode);
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
   * Whether the panel is expanded by default
   * @default true
   */
  defaultExpand?: boolean;
  /**
   * Default width (number format)
   */
  defaultWidth?: number;
  /**
   * Whether the panel is expanded (controlled)
   */
  expand?: boolean;
  /**
   * Whether the panel can be expanded/collapsed
   * @default true
   */
  expandable?: boolean;
  /**
   * Footer content
   * Can be a static element or a function that receives expand state
   */
  footer?: ReactNode | ((expand: boolean) => ReactNode);
  /**
   * Header content
   * Can be a static element or a function that receives expand state
   */
  header?: ReactNode | ((expand: boolean) => ReactNode);
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
   * Callback when expand state changes
   */
  onExpandChange?: (expand: boolean) => void;
  /**
   * Callback when menu item is selected
   */
  onSelect?: (key: string) => void;
  /**
   * Callback when width changes
   */
  onWidthChange?: (delta: NumberSize, width: number) => void;
  /**
   * Callback when actively resizing width
   */
  onWidthDragging?: (delta: NumberSize, width: number) => void;
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
   * Whether to show border
   * @default true
   */
  showBorder?: boolean;
  /**
   * Whether to show handle for toggling
   * @default true
   */
  showHandle?: boolean;
  showHandleHighlight?: boolean;
  /**
   * Whether to show handle when collapsed
   * @default false
   */
  showHandleWhenCollapsed?: boolean;
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

  /**
   * Current width (controlled)
   */
  width?: number;
}
