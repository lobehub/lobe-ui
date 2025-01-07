import { defineConfig } from 'dumi';
import { SiteThemeConfig } from 'dumi-theme-lobehub';
import { INavItem } from 'dumi/dist/client/theme-api/types';
import { resolve } from 'node:path';

import { description, homepage, name } from './package.json';

const isProduction = process.env.NODE_ENV === 'production';
const isWin = process.platform === 'win32';

const nav: INavItem[] = [
  { link: '/components/action-icon', title: 'Components' },
  { link: '/components/chat/chat-input-area', title: 'Chat' },
  { link: '/components/mobile/mobile-chat-input-area', title: 'Mobile' },
  { link: '/components/awesome/features', title: 'Awesome' },
  { link: '/components/brand/lobe-hub', title: 'Brand' },
  { link: '/components/mdx/callout', title: 'Mdx' },
  { link: 'https://icons.lobehub.com', mode: 'override', title: 'Icons' },
  { link: 'https://charts.lobehub.com', mode: 'override', title: 'Charts' },
  { link: '/components/color/color-scales', title: 'Colors' },
  { link: '/changelog', title: 'Changelog' },
];

const themeConfig: SiteThemeConfig = {
  actions: [
    {
      icon: 'Github',
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

export default defineConfig({
  alias: {
    '@lobehub/ui/awesome': resolve(__dirname, './src/awesome'),
    '@lobehub/ui/brand': resolve(__dirname, './src/brand'),
    '@lobehub/ui/chat': resolve(__dirname, './src/chat'),
    '@lobehub/ui/color': resolve(__dirname, './src/color'),
    '@lobehub/ui/mdx': resolve(__dirname, './src/mdx'),
    '@lobehub/ui/mobile': resolve(__dirname, './src/mobile'),
    '@lobehub/ui/storybook': resolve(__dirname, './src/storybook'),
  },
  apiParser: isProduction ? {} : false,
  base: '/',
  define: {
    'process.env': process.env,
  },
  exportStatic: {},
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
      { dir: 'src/awesome', subType: 'awesome', type: 'component' },
      { dir: 'src/chat', subType: 'chat', type: 'component' },
      { dir: 'src/mobile', subType: 'mobile', type: 'component' },
      { dir: 'src/brand', subType: 'brand', type: 'component' },
      { dir: 'src/mdx', subType: 'mdx', type: 'component' },
      { dir: 'src/storybook', subType: 'storybook', type: 'component' },
      { dir: 'src/color', subType: 'color', type: 'component' },
    ],
    entryFile: isProduction ? './src/index.ts' : undefined,
  },
  sitemap: {
    hostname: 'https://ui.lobehub.com',
  },
  ssr: isProduction ? {} : false,
  styles: [
    `html, body { background: transparent;  }

  @media (prefers-color-scheme: dark) {
    html, body { background: #000; }
  }`,
  ],
  themeConfig,
  title: 'Lobe UI',
});
