import type {
  PopoverBackdropProps as BasePopoverBackdropProps,
  PopoverPopupProps as BasePopoverPopupProps,
  PopoverPositionerProps as BasePopoverPositionerProps,
  PopoverTriggerProps as BasePopoverTriggerProps,
} from '@base-ui/react/popover';
import type { CSSProperties, ReactElement, ReactNode, Ref } from 'react';

import type { Placement } from '@/utils/placement';

export type PopoverPlacement = Placement;

export type PopoverTrigger = 'hover' | 'click' | 'both' | ('hover' | 'click')[];

/**
 * Base UI Positioner props that can be passed through
 */
export type PopoverPositionerProps = Omit<
  BasePopoverPositionerProps,
  'className' | 'style' | 'children'
>;

/**
 * Base UI Trigger props that can be passed through
 */
export type PopoverTriggerComponentProps = Omit<
  BasePopoverTriggerProps,
  'className' | 'style' | 'children' | 'render' | 'nativeButton' | 'handle' | 'payload'
>;

/**
 * Base UI Popup props that can be passed through
 */
export type PopoverPopupProps = Omit<BasePopoverPopupProps, 'className' | 'style' | 'children'>;

/**
 * Base UI Backdrop props that can be passed through
 */
export type PopoverBackdropProps = Omit<BasePopoverBackdropProps, 'className' | 'style'>;

export interface PopoverProps {
  /**
   * 是否显示箭头, 在 `inset` 下无法使用
   * @default false
   */
  arrow?: boolean;

  /**
   * Base UI Backdrop 组件的 props
   */
  backdropProps?: PopoverBackdropProps;
  /**
   * 触发元素
   */
  children: ReactElement | ReactNode;

  /**
   * 弹出容器类名
   */
  className?: string;

  /**
   * 自定义类名
   */
  classNames?: {
    arrow?: string;
    content?: string;
    root?: string;
    trigger?: string;
  };

  /**
   * 关闭延迟（毫秒），优先级高于 mouseLeaveDelay
   */
  closeDelay?: number;

  /**
   * 弹出内容
   */
  content: ReactNode;

  /**
   * 默认打开状态
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;

  /**
   * 获取弹出容器
   */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;

  /**
   * 是否嵌入 trigger 内部显示
   * @default false
   */
  inset?: boolean;

  /**
   * 鼠标移入延迟（秒）
   * @default 0.1
   */
  mouseEnterDelay?: number;

  /**
   * 鼠标移出延迟（秒）
   * @default 0.1
   */
  mouseLeaveDelay?: number;

  /**
   * 是否使用原生 button 元素作为触发器
   */
  nativeButton?: boolean;

  /**
   * 打开状态变化回调
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * 受控的打开状态
   */
  open?: boolean;

  /**
   * 打开延迟（毫秒），优先级高于 mouseEnterDelay
   */
  openDelay?: number;

  /**
   * 弹出位置
   * @default 'top'
   */
  placement?: PopoverPlacement;

  /**
   * Base UI Popup 组件的 props
   */
  popupProps?: PopoverPopupProps;

  /**
   * Base UI Positioner 组件的 props
   */
  positionerProps?: PopoverPositionerProps;

  /**
   * ref
   */
  ref?: Ref<HTMLElement>;

  /**
   * 当设置为 true 时，即使在 PopoverGroup 内部也会独立渲染，忽略 group 单例行为
   */
  standalone?: boolean;

  /**
   * 自定义样式
   */
  styles?: {
    arrow?: CSSProperties;
    content?: CSSProperties;
    root?: CSSProperties;
  };

  /**
   * 触发方式
   * @default 'hover'
   */
  trigger?: PopoverTrigger;

  /**
   * Base UI Trigger 组件的 props
   */
  triggerProps?: PopoverTriggerComponentProps;

  /**
   * z-index
   */
  zIndex?: number;
}
