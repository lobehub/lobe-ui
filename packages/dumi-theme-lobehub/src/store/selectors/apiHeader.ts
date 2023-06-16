import type { ApiHeaderProps } from '../../components/ApiHeader';
import type { ApiHeaderConfig } from '../../types/config';
import type { SiteStore } from '../useSiteStore';
import { githubSel } from './siteBasicInfo';

export * from './hero';

const haseUrl = (config: false | string | undefined) => {
  if (config === false) return false;

  return typeof config === 'string';
};

export const isApiPageSel = (s: SiteStore) => {
  const fm = s.routeMeta.frontmatter;

  if (s.siteData.themeConfig.apiHeader === false || fm.apiHeader === false) return false;

  if (fm.apiHeader) return true;

  const baseMatch = ['/api', '/components', ...(s.siteData.themeConfig.apiHeader?.match || [])];

  return baseMatch.some((path) => s.location.pathname.startsWith(path));
};

export const apiHeaderSel = (s: SiteStore): ApiHeaderProps => {
  const REPO_BASE = githubSel(s);
  const fm = s.routeMeta.frontmatter;
  const localeId = s.locale.id;

  // 统一的路径匹配替换方法
  const replaceUrl = (rawString: string) => {
    return rawString
      .replace('{github}', REPO_BASE)
      .replace('{atomId}', fm.atomId || '')
      .replace('{title}', fm.title)
      .replace('{locale}', localeId);
  };

  const {
    pkg: package_ = s.siteData.pkg.name,
    sourceUrl: sourceUrlMatch,
    docUrl: documentUrlMatch,
  } = (s.siteData.themeConfig.apiHeader || {}) as ApiHeaderConfig;

  // 1. 兜底默认使用文档的 apiHeader.pkg
  // 2. 如果 themeConfig 里配置了 pkg， 则使用配置的 pkg
  // 3. 兜底使用 package.json 中的 name
  const displayPackage = fm.apiHeader?.pkg || package_;

  // 1. 默认使用文档的 fm.atomId
  // 2. 兜底到文档 title
  const componentName = fm.atomId || fm.title;

  // 1. 优先选择使用文档 apiHeader.defaultImport
  // 2. 默认使用 false
  const defaultImport = fm.apiHeader?.defaultImport || false;

  const sourceUrl =
    fm.apiHeader?.sourceUrl ||
    (haseUrl(sourceUrlMatch) ? replaceUrl(sourceUrlMatch as string) : undefined);

  const documentUrl =
    fm.apiHeader?.docUrl ||
    (haseUrl(documentUrlMatch) ? replaceUrl(documentUrlMatch as string) : undefined);

  return {
    componentName,
    defaultImport,
    description: fm.description,
    docUrl: documentUrl,
    pkg: displayPackage,
    sourceUrl,
    title: fm.title,
  };
};
