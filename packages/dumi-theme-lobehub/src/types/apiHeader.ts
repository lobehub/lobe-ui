/**
 * @title ApiHeaderProps
 * @category Props
 * @description ApiHeader 组件的 props 类型定义
 */
export interface ApiHeaderProps {
  /**
   * @title 标题
   * @description ApiHeader 组件的标题
   */
  title: string;
  /**
   * @title 包名
   * @description ApiHeader 组件所在的包名
   */
  pkg: string;
  /**
   * @title 是否默认导入
   * @description 是否默认导入组件
   * @default false
   */
  defaultImport?: boolean;
  /**
   * @title 描述
   * @description ApiHeader 组件的描述信息
   */
  description?: string;
  /**
   * @title 源代码链接
   * @description ApiHeader 组件源代码的链接
   */
  sourceUrl?: string;
  /**
   * @title 文档链接
   * @description ApiHeader 组件文档的链接
   */
  docUrl?: string;
  /**
   * @title 组件名
   * @description ApiHeader 组件的名称
   */
  componentName: string;
}
/**
 * @title ApiHeader 配置项
 */
export interface ApiHeaderConfig {
  /**
   * @title 组件库包名
   * @description 可以从 package.json 中引入名称
   */
  pkg?: string;
  /**
   * @title 匹配路由
   * @description ApiHeader 组件的匹配路由
   * @default ["/api", "/components"]
   */
  match?: string[];
  /**
   * @title 源代码链接
   * @description 点击 ApiHeader 组件的源代码链接跳转的地址
   */
  sourceUrl?: string | false;
  /**
   * @title 文档链接
   * @description 点击 ApiHeader 组件的文档链接跳转的地址
   */
  docUrl?: string | false;
}
