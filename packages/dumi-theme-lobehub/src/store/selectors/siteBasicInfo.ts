import { SiteStore } from '../useSiteStore';

/**
 * 站点标题选择器
 */
export const siteTitleSel = (s: SiteStore) => s.siteData.themeConfig.title;

export const githubSel = (s: SiteStore) =>
  // 优先取 socialLinks 里的 github
  // TODO: 后面的 github 在 1.0 里废弃
  s.siteData.themeConfig.socialLinks?.github || s.siteData.themeConfig.github;
