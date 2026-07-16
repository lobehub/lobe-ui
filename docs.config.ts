import legacyRedirects from './compatibility.json';
import navSections from './navigationSections.json';
import { defineDocsConfig } from './packages/docs-kit/src/config';

export default defineDocsConfig({
  alias: {
    '@': 'src',
    '@lobehub/ui': 'src',
  },
  atomDirs: [{ dir: 'src' }],
  description: 'A modern React component library for building LobeHub products.',
  legacyRedirects,
  navSections,
  siteUrl: 'https://ui.lobehub.com',
  themeConfig: {
    analytics: {
      plausible: {
        domain: 'ui.lobehub.com',
        source: 'https://plausible.lobehub-inc.cn/js/script.js',
      },
    },
    giscus: {
      category: 'Q&A',
      categoryId: 'DIC_kwDOJloKoM4CXsCu',
      repo: 'lobehub/lobe-ui',
      repoId: 'R_kgDOJloKoA',
    },
    metadata: {
      openGraph: {
        image:
          'https://repository-images.githubusercontent.com/643435168/789cab53-cae5-43fa-965d-5928c3c63c1c',
      },
    },
  },
  title: 'Lobe UI',
});
