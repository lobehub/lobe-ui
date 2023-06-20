import { GetCustomToken } from 'antd-style';

export interface SiteCustomToken {
  contentMaxWidth: number;
  footerHeight: number;
  headerHeight: number;
  sidebarWidth: number;
  tocWidth: number;
}

const generateCustomToken: GetCustomToken<SiteCustomToken> = () => ({
  contentMaxWidth: 960,
  footerHeight: 300,
  headerHeight: 64,
  sidebarWidth: 240,
  tocWidth: 176,
});

export default generateCustomToken;
