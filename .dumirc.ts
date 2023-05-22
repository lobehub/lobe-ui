import { defineConfig } from 'dumi';
import { homepage } from './package.json';

const isProd = process.env.NODE_ENV === 'production';

const themeConfig = {
  name: 'UI',
  description: 'Empowering your AI dreams with LobeHub',
  footer: 'LobeHub',
  socialLinks: {
    github: homepage,
  },
};

export default defineConfig({
  themeConfig,
  locales: [{ id: 'en-US', name: 'English' }],
  title: 'LobeHub UI Kit',
  favicons: ['https://raw.githubusercontent.com/lobehub/favicon/main/dist/favicon.ico'],
  npmClient: 'pnpm',
  base: '/',
  publicPath: '/',
  ssr: isProd ? {} : false,
  apiParser: isProd ? {} : false,
  resolve: isProd
    ? {
        entryFile: './src/index.ts',
      }
    : {},
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
