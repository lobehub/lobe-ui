import type { CSSProperties, ElementType, HTMLAttributes, ReactNode, Ref } from 'react';
import { DOMAttributes } from 'react';

export type ContentPosition =
  | 'center'
  | 'end'
  | 'flex-end'
  | 'flex-start'
  | 'start'
  | 'stretch'
  | 'baseline';

export type FlexDirection = 'vertical' | 'vertical-reverse' | 'horizontal' | 'horizontal-reverse';

export type DivProps = DOMAttributes<HTMLDivElement> & HTMLAttributes<HTMLDivElement>;

export type CommonSpaceNumber = 2 | 4 | 8 | 12 | 16 | 24;

/**
 * Flexbox 布局组件的接口
 */
export interface IFlexbox {
  /**
   * 交叉轴对齐方式
   * @default "stretch"
   */
  align?: ContentPosition;

  /**
   * 允许在 flex 布局中正常收缩（通过将根节点的 min-width 设为 0 实现）
   *
   * 在 Flex 容器（或作为 flex item）中，启用该选项可避免内容导致的溢出，
   * 让元素可以正常 shrink（常见于文本省略、滚动容器等场景）。
   * @default false
   */
  allowShrink?: boolean;

  /**
   * 渲染的 HTML 元素类型
   * @default "div"
   */
  as?: ElementType;

  /**
   * 子元素
   */
  children?: ReactNode;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 主轴方向
   * @default "horizontal"
   */
  direction?: FlexDirection;

  /**
   * 内容分布
   */
  distribution?: CSSProperties['justifyContent'];

  /**
   * flex 值
   * @default "0 1 auto"
   */
  flex?: number | string;

  /**
   * 主轴方向上的间距
   * @default 0
   */
  gap?: CommonSpaceNumber | number | string;

  /**
   * 高度
   * @default "auto"
   */
  height?: number | string;

  /**
   * 是否横向
   * @default false
   */
  horizontal?: boolean;

  /**
   * 主轴对齐方式
   */
  justify?: CSSProperties['justifyContent'];

  /**
   * 内边距
   * @default 0
   */
  padding?: string | number | CommonSpaceNumber;

  /**
   * 块内边距
   */
  paddingBlock?: string | number;

  /**
   * 内联内边距
   */
  paddingInline?: string | number;

  /**
   * 类名前缀
   */
  prefixCls?: string;

  /**
   * ref 引用
   */
  ref?: Ref<HTMLElement>;

  /**
   * 自定义样式
   */
  style?: CSSProperties;

  /**
   * 是否显示
   * @default true
   */
  visible?: boolean;

  /**
   * 宽度
   * @default "auto"
   */
  width?: number | string;

  /**
   * 换行方式
   */
  wrap?: CSSProperties['flexWrap'];
}

export interface FlexBasicProps extends IFlexbox, DivProps {}

export type FlexboxProps = FlexBasicProps;

export type CenterProps = Omit<FlexBasicProps, 'distribution' | 'direction' | 'align'>;
