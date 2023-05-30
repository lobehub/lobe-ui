import type { CSSProperties } from 'react';

export type ImageContainerType = 'light' | 'primary' | 'soon';

/**
 * @title 特性
 */
export interface IFeature {
  /**
   * @title 列数
   */
  column?: number;
  /**
   * @title 描述
   */
  description?: string;
  /**
   * @title 是否在背后显示 hero 的流动色
   */
  hero?: boolean;
  /**
   * @title 图片 url
   */
  image?: string;
  /**
   * @title 图片样式
   */
  imageStyle?: CSSProperties;
  /**
   * @title 图片容器样式类型
   * @enum ["contain", "cover", "fill"]
   * @enumNames ["包含", "覆盖", "填充"]
   */
  imageType?: ImageContainerType;
  /**
   * @title 链接
   */
  link?: string;
  /**
   * 支持打开外部链接，新窗口跳转
   */
  openExternal?: boolean;
  /**
   * @title 行数
   */
  row?: number;
  /**
   * @title 标题
   */
  title: string;
}

/**
 * @title 操作项
 */
export interface IAction {
  /**
   * @title 链接
   */
  link: string;
  /**
   * 新窗口打开链接
   */
  openExternal?: boolean;
  /**
   * @title 文本
   */
  text: string;
  /**
   * @title 类型
   * @enum ['primary', 'default']
   * @enumNames ['主要', '默认']
   */
  type?: 'primary' | 'default';
}
/**
 * @title 英雄
 */
export interface IHero {
  /**
   * @title 行动列表
   */
  actions: IAction[];
  /**
   * @title 配置首页首屏区域的简介文字
   */
  description?: string;
  /**
   * @title 特性列表
   */
  features?: IFeature[];
  /**
   * @title 标题
   */
  title?: string;
}
