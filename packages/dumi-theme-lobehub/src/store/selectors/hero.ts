import { IFeature } from '../../types';
import { SiteStore } from '../useSiteStore';

export const isHeroPageSel = (s: SiteStore) => !!s.routeMeta.frontmatter.hero;

const localeValueSel = (s: SiteStore, value: any) => {
  if (!value) return;

  if (value[s.locale.id]) return value[s.locale.id];

  return value;
};

/**
 * Hero Title 选择器
 * 选择逻辑：优先使用 hero 配置的 title， 再兜底到 themeConfig 中的 name
 */
export const heroTitleSel = (s: SiteStore) =>
  s.routeMeta.frontmatter.hero?.title ||
  // 从 hero 的 title 中选择
  localeValueSel(s, s.siteData.themeConfig.hero)?.title ||
  // @deprecated 1.0 正式版本移除
  // 从 hero 的 title 中选择
  localeValueSel(s, s.siteData.themeConfig.title) ||
  s.siteData.themeConfig.name;

/**
 * Hero description 选择器
 * 选择逻辑：优先使用 hero 配置的 description， 再兜底到 themeConfig 中的 name
 */
export const heroDescSel = (s: SiteStore) =>
  s.routeMeta.frontmatter.hero?.description ||
  // 从 hero 的 description 中选择
  localeValueSel(s, s.siteData.themeConfig.hero)?.description ||
  // @deprecated 1.0 正式版本移除
  // 从 hero 的 description 中选择
  localeValueSel(s, s.siteData.themeConfig.description);

/**
 * Hero Action 选择器
 * 选择逻辑：优先使用 hero 配置的 actions， 再兜底到 themeConfig 中的 actions
 */
export const heroActionsSel = (s: SiteStore) =>
  s.routeMeta.frontmatter.hero?.actions ||
  // 从 hero 的 actions 中选择
  localeValueSel(s, s.siteData.themeConfig.hero)?.actions ||
  // @deprecated 1.0 正式版本移除
  localeValueSel(s, s.siteData.themeConfig.actions);

/**
 * Features 选择器
 */
export const featuresSel = (s: SiteStore): IFeature[] => {
  if (!isHeroPageSel(s)) return [];

  return (
    localeValueSel(s, s.siteData.themeConfig.hero)?.features ||
    // @deprecated 1.0 正式版本移除
    localeValueSel(s, s.siteData.themeConfig.features) ||
    // 在themeConfig 没有配置的话，尝试兜底到 frontmatter 中的配置
    s.routeMeta.frontmatter.features ||
    []
  );
};
