import { resolve } from 'node:path';

import { defineConfig } from 'dumi';
import type { INavItem } from 'dumi/dist/client/theme-api/types';
import type { SiteThemeConfig } from 'dumi-theme-lobehub';

import { description, homepage, name } from './package.json';

const isProduction = process.env.NODE_ENV === 'production';
const isWin = process.platform === 'win32';

export const packages = [
  'awesome',
  'brand',
  'chat',
  'color',
  'icons',
  'mdx',
  'mobile',
  'storybook',
  'base-ui',
];

const nav: INavItem[] = [
  { link: '/components/action-icon', title: 'Components' },
  { link: '/components/base-ui/select', title: 'Base UI' },
  { link: '/components/chat/chat-input-area', title: 'Chat' },
  { link: '/components/mobile/chat-input-area', title: 'Mobile' },
  { link: '/components/awesome/features', title: 'Awesome' },
  { link: '/components/brand/lobe-hub', title: 'Brand' },
  { link: '/components/mdx/callout', title: 'Mdx' },
  { link: '/components/icons/auth0', title: 'Icons' },
  { link: '/components/color/color-scales', title: 'Color' },
  { link: '/changelog', title: 'Changelog' },
];

const themeConfig: SiteThemeConfig = {
  actions: [
    {
      github: true,
      link: homepage,
      openExternal: true,
      text: 'GitHub',
    },
    {
      link: '/components/action-icon',
      text: 'Get Started',
      type: 'primary',
    },
  ],
  analytics: {
    plausible: {
      domain: 'ui.lobehub.com',
      scriptBaseUrl: 'https://plausible.lobehub-inc.cn',
    },
  },
  apiHeader: {
    docUrl: `{github}/tree/master/src/{atomId}/index.md`,
    match: ['/components'],
    pkg: name,
    sourceUrl: `{github}/tree/master/src/{atomId}/index.tsx`,
  },
  description,
  giscus: {
    category: 'Q&A',
    categoryId: 'DIC_kwDOJloKoM4CXsCu',
    repo: 'lobehub/lobe-ui',
    repoId: 'R_kgDOJloKoA',
  },
  lastUpdated: true,
  metadata: {
    openGraph: {
      image:
        'https://repository-images.githubusercontent.com/643435168/789cab53-cae5-43fa-965d-5928c3c63c1c',
    },
  },
  name: 'UI',
  nav,
  prefersColor: {
    default: 'dark',
    switch: false,
  },
  socialLinks: {
    discord: 'https://discord.gg/AYFPHvv2jT',
    github: homepage,
  },
  title: 'Lobe UI',
};

const alias: Record<string, string> = {};
for (const pkg of packages) alias[`@lobehub/ui/${pkg}`] = resolve(__dirname, `./src/${pkg}`);

export default defineConfig({
  alias,
  apiParser: isProduction ? {} : false,
  base: '/',
  define: {
    'process.env': process.env,
  },
  extraBabelPlugins: ['babel-plugin-antd-style'],
  favicons: ['https://lobehub.com/favicon.ico'],
  jsMinifier: 'swc',
  locales: [{ id: 'en-US', name: 'English' }],
  mako: isWin || isProduction ? false : {},
  mfsu: isWin ? undefined : {},
  npmClient: 'pnpm',
  publicPath: '/',
  resolve: {
    atomDirs: [
      { dir: 'src', type: 'component' },
      ...packages.map((pkg) => ({ dir: `src/${pkg}`, subType: pkg, type: 'component' })),
    ],
    entryFile: isProduction ? './src/index.ts' : undefined,
  },
  sitemap: {
    hostname: 'https://ui.lobehub.com',
  },
  styles: [
    `html, body { background: transparent;  }

  @media (prefers-color-scheme: dark) {
    html, body { background: #000; }
  }`,
  ],
  themeConfig,
  title: 'Lobe UI',
});
