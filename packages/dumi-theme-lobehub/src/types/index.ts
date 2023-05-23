export * from './apiHeader';
export * from './config';
export * from './hero';

/**
 * @title 锚点项
 */
export interface AnchorItem {
  /**
   * @title 锚点项 ID
   */
  id: string;
  /**
   * @title 锚点项标题
   */
  title: string;
  /**
   * @title 子锚点项
   * @description 若存在子锚点项，则该锚点项为父锚点项
   */
  children?: AnchorItem[];
}
