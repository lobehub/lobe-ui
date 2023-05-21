import { defineConfig } from 'dumi';
import { homepage } from './package.json';

export default defineConfig({
  themeConfig: {
    name: 'Lobe UI',
    socialLinks: {
      github: homepage,
    },
  },
});
