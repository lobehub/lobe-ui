import type { CSSProperties, ReactElement, ReactNode, Ref } from 'react';

import type { Placement } from '@/utils/placement';

export type PopoverPlacement = Placement;

export type PopoverTrigger = 'hover' | 'click' | 'both' | ('hover' | 'click')[];

export interface PopoverProps {
  /**
   * 是否显示箭头, 在 `inset` 下无法使用
   * @default true
   */
  arrow?: boolean;

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
   * 是否使用 Portal 渲染
   * @default true
   */
  portalled?: boolean;

  /**
   * ref
   */
  ref?: Ref<HTMLElement>;

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
   * z-index
   */
  zIndex?: number;
}
