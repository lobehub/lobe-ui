import type {
  TooltipPopupProps as BaseTooltipPopupProps,
  TooltipPortalProps as BaseTooltipPortalProps,
  TooltipPositionerProps as BaseTooltipPositionerProps,
  TooltipTriggerProps as BaseTooltipTriggerProps,
} from '@base-ui/react/tooltip';
import type { CSSProperties, ReactElement, ReactNode, Ref } from 'react';

import type { HotkeyProps } from '@/Hotkey';
import type { Placement } from '@/utils/placement';

export type TooltipPlacement = Placement;

/**
 * Base UI Positioner props that can be passed through
 */
export type TooltipPositionerProps = Omit<
  BaseTooltipPositionerProps,
  'className' | 'style' | 'children'
>;

/**
 * Base UI Trigger props that can be passed through
 */
export type TooltipTriggerComponentProps = Omit<
  BaseTooltipTriggerProps,
  'className' | 'style' | 'children' | 'render' | 'handle' | 'payload'
>;

/**
 * Base UI Popup props that can be passed through
 */
export type TooltipPopupComponentProps = Omit<
  BaseTooltipPopupProps,
  'className' | 'style' | 'children'
>;

/**
 * Base UI Portal props that can be passed through
 */
export type TooltipPortalProps = Omit<BaseTooltipPortalProps, 'children' | 'container'>;

export interface TooltipProps {
  /**
   * Whether the tooltip has an arrow pointer.
   * @default false
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
   * Base UI Popup 组件的 props
   */
  popupProps?: TooltipPopupComponentProps;

  /**
   * Base UI Portal 组件的 props
   */
  portalProps?: TooltipPortalProps;

  /**
   * Base UI Positioner 组件的 props
   */
  positionerProps?: TooltipPositionerProps;

  ref?: Ref<HTMLElement>;

  /**
   * When true, this tooltip will render independently even inside a TooltipGroup,
   * ignoring the group singleton behavior.
   */
  standalone?: boolean;

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
   * Base UI Trigger 组件的 props
   */
  triggerProps?: TooltipTriggerComponentProps;

  /**
   * z-index for tooltip floating root.
   */
  zIndex?: number;
}

/**
 * Props for `TooltipGroup`.
 */
export interface TooltipGroupProps {
  arrow?: boolean;
  children: ReactNode;
  className?: string;
  classNames?: TooltipProps['classNames'];
  closeDelay?: number;
  /**
   * Disable the "destroy on invalid trigger (display:none / disconnected)" guard for performance.
   * @default false
   */
  disableDestroyOnInvalidTrigger?: boolean;
  /**
   * Disable the "hide when positioner falls back to (0,0)" visual guard for performance.
   * @default false
   */
  disableZeroOriginGuard?: boolean;
  disabled?: boolean;
  getPopupContainer?: TooltipProps['getPopupContainer'];
  hotkey?: string;
  hotkeyProps?: Omit<HotkeyProps, 'keys'>;
  layoutAnimation?: boolean;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  openDelay?: number;
  placement?: TooltipPlacement;
  popupProps?: TooltipPopupComponentProps;
  portalProps?: TooltipPortalProps;
  positionerProps?: TooltipPositionerProps;
  styles?: TooltipProps['styles'];
  triggerProps?: TooltipTriggerComponentProps;
  zIndex?: number;
}
