import { defineConfig } from 'dumi';

import { homepage, name } from './package.json';

const isProduction = process.env.NODE_ENV === 'production';
const isWin = process.platform === 'win32';

const themeConfig = {
  actions: [
    {
      icon: 'Github',
      link: homepage,
      openExternal: true,
      text: 'Github',
    },
    {
      link: '/components/action-icon',
      text: 'Get Started',
      type: 'primary',
    },
  ],
  apiHeader: {
    docUrl: `{github}/tree/master/src/{atomId}/index.md`,

    // 匹配路由，默认为 /api 或 /components
    match: ['/components'],

    // 组件库包名，可以从 package.json 中引入名称
    pkg: name,
    // github 会匹配 themeConfig.github 字段
    sourceUrl: `{github}/tree/master/src/{atomId}/index.tsx`,
  },
  description: 'Lobe UI is an open-source UI component library for building chatbot web apps',

  features: [
    {
      description:
        'Provides a simple way to customize default themes, you can change the colors, fonts, breakpoints and everything you need.',
      icon: 'Palette',
      title: 'Themeable',
    },
    {
      description:
        'voids unnecessary styles props at runtime, making it more performant than other UI libraries.',
      icon: 'Zap',
      title: 'Fast',
    },
    {
      description:
        'Automatic dark mode recognition, NextUI automatically changes the theme when detects HTML theme prop changes.',
      icon: 'MoonStar',
      title: 'Light & Dark UI',
    },
  ],
  footer: 'Made with 🤯 by LobeHub',
  name: 'UI',
  socialLinks: {
    github: homepage,
  },
  title: 'Lobe UI',
};

export default defineConfig({
  apiParser: isProduction ? {} : false,
  base: '/',
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
  define: {
    'process.env': process.env,
  },
  extraBabelPlugins: [
    [
      'babel-plugin-styled-components',
      {
        displayName: process.env.NODE_ENV === 'development',
        minify: true,
        pure: true,
        transpileTemplateLiterals: true,
      },
    ],
  ],
  favicons: ['https://npm.elemecdn.com/@lobehub/assets/favicons/favicon.ico'],
  locales: [{ id: 'en-US', name: 'English' }],
  mfsu: isWin
    ? undefined
    : {
        exclude: ['@dqbd/tiktoken'],
      },
  npmClient: 'pnpm',
  publicPath: '/',
  resolve: isProduction
    ? {
        entryFile: './src/index.ts',
      }
    : undefined,

  ssr: isProduction ? {} : false,
  themeConfig,
  title: 'Lobe UI',
});
