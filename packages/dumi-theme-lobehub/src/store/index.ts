export * from './selectors';
export * from './useSiteStore';
import { apiHeaderSel, flattenSidebarSel, tokenSel } from './selectors';

/**
 * @title 数据选择器
 */
export const siteSelectors = {
  /**
   * @title API 头部选择器
   */
  apiHeader: apiHeaderSel,
  /**
   * @title 扁平化侧边栏选择器
   */
  flattenSidebar: flattenSidebarSel,
  token: tokenSel,
};
