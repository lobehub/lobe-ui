import type { CSSProperties, ReactElement, ReactNode, Ref } from 'react';

import type { HotkeyProps } from '@/Hotkey';
import type { Placement } from '@/utils/placement';

export type TooltipPlacement = Placement;

export type TooltipProps = {
  /**
   * Whether the tooltip has an arrow pointer.
   */
  arrow?: boolean;
  /**
   * Trigger element. Prefer a single React element.
   */
  children: ReactElement | ReactNode;

  /**
   * Custom className for the tooltip floating root.
   */
  className?: string;
  /**
   * Compatible with Ant Design `classNames` shape (subset).
   */
  classNames?: {
    arrow?: string;
    container?: string;
    content?: string;
    root?: string;
  };

  /**
   * Delay (in milliseconds) before closing the tooltip.
   * Takes precedence over `mouseLeaveDelay`.
   */
  closeDelay?: number;
  /**
   * Uncontrolled initial open state.
   */
  defaultOpen?: boolean;
  /**
   * Disable tooltip behavior.
   */
  disabled?: boolean;
  /**
   * An Ant Design compatible escape hatch for portal container.
   */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;

  hotkey?: string;
  hotkeyProps?: Omit<HotkeyProps, 'keys'>;
  /**
   * Delay (in seconds) before showing the tooltip on hover.
   * Kept compatible with Ant Design `Tooltip`.
   */
  mouseEnterDelay?: number;

  /**
   * Delay (in seconds) before hiding the tooltip on hover out.
   * Kept compatible with Ant Design `Tooltip`.
   */
  mouseLeaveDelay?: number;

  /**
   * Callback when open state changes.
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Controlled open state.
   */
  open?: boolean;

  /**
   * Delay (in milliseconds) before opening the tooltip.
   * Takes precedence over `mouseEnterDelay`.
   */
  openDelay?: number;

  /**
   * Tooltip placement. Supports Floating UI placements and Ant Design legacy placements.
   */
  placement?: TooltipPlacement;

  /**
   * Render tooltip in a portal attached to body.
   */
  portalled?: boolean;

  ref?: Ref<HTMLElement>;

  /**
   * Compatible with Ant Design `styles` shape (subset).
   */
  styles?: {
    arrow?: CSSProperties;
    /**
     * Backwards-compatible alias for the floating root style.
     */
    container?: CSSProperties;
    content?: CSSProperties;
    root?: CSSProperties;
  };
  /**
   * Tooltip content.
   */
  title: ReactNode;
  /**
   * z-index for tooltip floating root.
   */
  zIndex?: number;
};
