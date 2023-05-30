import { merge } from 'lodash-es';

import { SiteStore } from '../useSiteStore';

export const tokenSel = (s: SiteStore) => {
  const fm = s.routeMeta.frontmatter;

  return merge({}, fm.token, s.siteData.themeConfig.siteToken);
};
