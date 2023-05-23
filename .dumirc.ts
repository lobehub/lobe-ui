import { defineConfig } from 'dumi';
import { homepage } from './package.json';

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
  apiParser: isWin ? false : {},
  resolve: isWin
    ? undefined
    : {
        entryFile: './src/index.ts',
      },
  define: {
    'process.env': process.env,
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
