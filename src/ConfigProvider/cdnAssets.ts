import type { CdnApi } from '@/utils/genCdnUrl';

export const KATEX_CSS_VERSION = '0.19.0';

export const DEFAULT_WEB_FONTS: CdnApi[] = [
  { path: 'css/index.css', pkg: '@lobehub/webfont-mono', version: '1.0.0' },
  { path: 'css/index-full.css', pkg: '@lobehub/webfont-geist', version: '1.0.0' },
  { path: 'css/index-full.css', pkg: '@lobehub/webfont-harmony-sans', version: '1.0.0' },
  { path: 'css/index.css', pkg: '@lobehub/webfont-harmony-sans-sc', version: '1.0.0' },
  { path: 'dist/katex.min.css', pkg: 'katex', version: KATEX_CSS_VERSION },
];
