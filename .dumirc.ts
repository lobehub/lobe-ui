import { defineConfig } from 'dumi';
import { homepage } from './package.json';

const isProd = process.env.NODE_ENV === 'production';

const themeConfig = {
  name: 'Lobe UI',
  description: 'Empowering your AI dreams with LobeHub',
  logo: 'https://raw.githubusercontent.com/lobehub/.github/main/profile/Logo.webp',
  footer: 'LobeHub',
  socialLinks: {
    github: homepage,
  },
};

export default defineConfig({
  themeConfig,
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
  extraBabelPlugins: ['babel-plugin-styled-components'],
});
