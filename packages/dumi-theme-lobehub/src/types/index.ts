import React from 'react';

export * from './apiHeader';
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

export type DivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export type SvgProps = React.DetailedHTMLProps<React.HTMLAttributes<SVGSVGElement>, SVGSVGElement>;

export type ImgProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>;

export type InputProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export type TextAreaProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>;
