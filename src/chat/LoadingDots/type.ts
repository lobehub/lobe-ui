import type { CSSProperties } from 'react';

export type LoadingDotsVariant = 'dots' | 'pulse' | 'wave' | 'orbit' | 'typing';

export interface LoadingDotsProps {
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * 点的颜色
   * @description 如果不提供，将使用主题的 colorPrimary
   */
  color?: string;
  /**
   * 点的大小（直径）
   * @default 8
   */
  size?: number;
  /**
   * 自定义样式
   */
  style?: CSSProperties;
  /**
   * 动画变体
   * @default 'dots'
   */
  variant?: LoadingDotsVariant;
}
