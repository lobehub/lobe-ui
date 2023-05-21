import type { GetCustomToken } from 'antd-style';
import { rgba } from 'polished';

declare module 'antd-style' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface CustomToken extends SiteToken {}
}

/**
 * @title 站点主题 Token
 * @description 站点的一些基础配置信息
 */
export interface SiteToken {
  /**
   * @title 头部高度
   */
  headerHeight: number;
  /**
   * @title 底部高度
   */
  footerHeight: number;
  /**
   * @title 侧边栏宽度
   */
  sidebarWidth: number;
  /**
   * @title 目录宽度
   */
  tocWidth: number;
  /**
   * @title 内容最大宽度
   * @description 文本内容的最大宽度 1152
   */
  contentMaxWidth: number | string;
  /**
   * @title 渐变色1
   */
  gradientColor1: string;
  /**
   * @title 渐变色2
   */
  gradientColor2: string;
  /**
   * @title 渐变色3
   */
  gradientColor3: string;
  /**
   * @title 渐变背景色
   */
  gradientHeroBgG: string;
  /**
   * @title 默认图标渐变色
   */
  gradientIconDefault: string;
  /**
   * @title 实色
   */
  colorSolid: string;
  /**
   * @title 代码高亮字体
   */
  fontFamilyHighlighter: string;

  /**
   * 是否让 Demo 继承站点主题
   */
  demoInheritSiteTheme: boolean;
}

export const createCustomToken: GetCustomToken<SiteToken> = ({ isDarkMode, token }) => {
  const gradientColor1 = token.blue;
  const gradientColor2 = isDarkMode ? token.pink : token.cyan;
  const gradientColor3 = token.purple;
  const colorSolid = isDarkMode ? token.colorWhite : '#000';

  return {
    headerHeight: 64,
    footerHeight: 300,
    sidebarWidth: 240,
    tocWidth: 176,
    contentMaxWidth: 1152,
    fontFamilyHighlighter:
      "'Fira Code', 'Fira Mono', Menlo, Consolas, 'DejaVu Sans Mono', monospace",

    colorSolid,

    gradientColor1,
    gradientColor2,
    gradientColor3,
    gradientHeroBgG: `radial-gradient(at 80% 20%, ${gradientColor1} 0%, ${gradientColor2} 80%, ${gradientColor3} 130%)`,

    gradientIconDefault: `radial-gradient(
        100% 100% at 50% 0,
        ${rgba(colorSolid, isDarkMode ? 0.2 : 0.2)} 0,
        ${rgba(colorSolid, isDarkMode ? 0.1 : 0.4)} 100%
      )`,
    demoInheritSiteTheme: false,
  };
};
