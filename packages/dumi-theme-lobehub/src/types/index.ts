import { type HTMLAttributes } from 'react';

export * from './config';
export * from './hero';

/**
 * @title 锚点项
 */
export interface AnchorItem {
  /**
   * @title 子锚点项
   * @description 若存在子锚点项，则该锚点项为父锚点项
   */
  children?: AnchorItem[];
  /**
   * @title 锚点项 ID
   */
  id: string;
  /**
   * @title 锚点项标题
   */
  title: string;
}

export type DivProps = HTMLAttributes<HTMLDivElement>;

export type SvgProps = HTMLAttributes<SVGSVGElement>;

export type ImgProps = HTMLAttributes<HTMLImageElement>;

export type InputProps = HTMLAttributes<HTMLInputElement>;

export type TextAreaProps = HTMLAttributes<HTMLTextAreaElement>;
