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
  favicons: {
    appleTouchIcon: '/apple-touch-icon.png',
    icon: '/favicon.ico',
    icon16: '/favicon-16x16.png',
    icon32: '/favicon-32x32.png',
  },
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
    apiHeader: {
      docUrl: '{github}/edit/master/{atomId}',
      github: 'https://github.com/lobehub/lobe-ui',
      sourceUrl: '{github}/tree/master/{atomId}',
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
    prefersColor: 'auto',
    socialLinks: [
      { href: 'https://github.com/lobehub/lobe-ui', icon: 'github', label: 'GitHub' },
      { href: 'https://www.npmjs.com/package/@lobehub/ui', icon: 'npm', label: 'NPM' },
    ],
  },
  title: 'Lobe UI',
});
