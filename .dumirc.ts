import { defineConfig } from 'dumi';

import { homepage, name } from './package.json';

const isProd = process.env.NODE_ENV === 'production';
const isWin = process.platform === 'win32';

const themeConfig = {
  title: 'Lobe UI',
  name: 'UI',
  description: 'Lobe UI is an open-source UI component library for building chatbot web apps',
  footer: 'Made with 🤯 by LobeHub',
  socialLinks: {
    github: homepage,
  },
  apiHeader: {
    // 组件库包名，可以从 package.json 中引入名称
    pkg: name,
    // 匹配路由，默认为 /api 或 /components
    match: ['/components'],
    // github 会匹配 themeConfig.github 字段
    sourceUrl: `{github}/tree/master/src/{atomId}/index.tsx`,
    docUrl: `{github}/tree/master/src/{atomId}/index.md`,
  },
  actions: [
    {
      text: 'Github',
      icon: 'Github',
      link: homepage,
      openExternal: true,
    },
    {
      text: 'Get Started',
      link: '/components/action-icon',
      type: 'primary',
    },
  ],
  features: [
    {
      icon: 'Palette',
      title: 'Themeable',
      description:
        'Provides a simple way to customize default themes, you can change the colors, fonts, breakpoints and everything you need.',
    },
    {
      icon: 'Zap',
      title: 'Fast',
      description:
        'voids unnecessary styles props at runtime, making it more performant than other UI libraries.',
    },
    {
      icon: 'MoonStar',
      title: 'Light & Dark UI',
      description:
        'Automatic dark mode recognition, NextUI automatically changes the theme when detects HTML theme prop changes.',
    },
  ],
};

export default defineConfig({
  themeConfig,
  locales: [{ id: 'en-US', name: 'English' }],
  title: 'Lobe UI',
  favicons: ['https://raw.githubusercontent.com/lobehub/favicon/main/dist/favicon.ico'],
  npmClient: 'pnpm',
  base: '/',
  publicPath: '/',
  ssr: isProd ? {} : false,
  apiParser: !isProd ? false : {},
  resolve: !isProd
    ? undefined
    : {
        entryFile: './src/index.ts',
      },
  define: {
    'process.env': process.env,
  },
  mfsu: isWin
    ? undefined
    : {
        exclude: ['@dqbd/tiktoken'],
      },
  chainWebpack(config: any) {
    config.set('experiments', {
      ...config.get('experiments'),
      asyncWebAssembly: true,
      layers: true,
    });

    const REG = /\.wasm$/;

    config.module.rule('asset').exclude.add(REG).end();

    config.module
      .rule('wasm')
      .test(REG)
      .exclude.add(/node_modules/)
      .end()
      .type('webassembly/async')
      .end();
  },
  extraBabelPlugins: [
    [
      'babel-plugin-styled-components',
      {
        minify: true,
        transpileTemplateLiterals: true,
        displayName: process.env.NODE_ENV === 'development',
        pure: true,
      },
    ],
  ],
});
