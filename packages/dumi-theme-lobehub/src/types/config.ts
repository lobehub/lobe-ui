import { FooterColumn } from 'rc-footer/es/column';

import { SiteCustomToken } from '@/styles/customToken';

import { ApiHeaderConfig, IHero } from '../types';

/**
 * @title 页面底部 Footer 组件的配置
 */
export interface IFooter {
  /**
   * @title 底部内容
   */
  bottom?: string;
  /**
   * @title 列配置
   */
  columns?: FooterColumn[] | false;
  /**
   * @title 主题
   * @enum ['dark', 'light']
   * @enumNames ['黑色', '白色']
   */
  theme?: 'dark' | 'light';
}

/**
 * 网站主题配置
 */
export interface SiteThemeConfig {
  /**
   * API 文档页头部配置
   * @type ApiHeaderConfig | false
   */
  apiHeader?: ApiHeaderConfig | false;
  /**
   * 网站页脚
   * @type string | false
   */
  footer?: string | false;
  /**
   * 网站页脚配置
   * @type IFooter
   */
  footerConfig?: IFooter;
  /**
   * 导航栏 Github 图标链接，如不配置该字段，则不展示。
   */
  github?: string;
  /**
   * 网站首页头部
   * @type IHero | Record<string, IHero>
   */
  hero?: IHero | Record<string, IHero>;
  /**
   * 是否隐藏首页的 nav tab，配置为 `false` 则不展示首页的 tab
   */
  hideHomeNav?: boolean;
  /**
   * 网站 logo 图片链接
   */
  logo?: string;
  /**
   * 网站名称
   */
  name?: string;

  /**
   * 网站主题 Token 配置
   */
  siteToken?: SiteConfigToken;
  socialLinks?: {
    facebook?: string;
    github?: string;
    gitlab?: string;
    linkedin?: string;
    twitter?: string;
    weibo?: string;
    yueque?: string;
    zhihu?: string;
  };
}

export type SiteConfigToken = Partial<
  Pick<
    SiteCustomToken,
    'headerHeight' | 'footerHeight' | 'sidebarWidth' | 'tocWidth' | 'contentMaxWidth'
  >
>;
