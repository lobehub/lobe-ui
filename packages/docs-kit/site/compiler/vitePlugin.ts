import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import type { Plugin } from 'vite';

import type { ClientSiteConfig } from '../../src/config';
import { emptyLegacyRedirects, getDocsConfig } from '../../src/config';
import { apiPlugin } from './api/apiPlugin';
import { shouldUseChangelogFallback } from './content/changelogFallback';
import { createContentManifest } from './content/createManifest';
import { defaultAtomDirs } from './content/discoverDocuments';
import { demoPlugin } from './demo/demoPlugin';

const metadataQuery = 'document-metadata';
const metadataPrefix = '\0lobe-docs:document-metadata:';
const siteConfigVirtualId = 'virtual:lobedocs/site-config';
const resolvedSiteConfigVirtualId = `\0${siteConfigVirtualId}`;
const compatibilityVirtualId = 'virtual:lobedocs/compatibility';
const resolvedCompatibilityVirtualId = `\0${compatibilityVirtualId}`;
const documentModulesVirtualId = 'virtual:lobedocs/document-modules';
const resolvedDocumentModulesVirtualId = `\0${documentModulesVirtualId}`;
const homePageVirtualId = 'virtual:lobedocs/home-page';
const defaultHomePagePath = resolve(import.meta.dirname, '../components/Home/DefaultHome.tsx');

const getMetadataPath = (id: string): string | undefined => {
  const queryIndex = id.indexOf('?');
  if (queryIndex < 0) return;

  const query = new URLSearchParams(id.slice(queryIndex + 1));
  return query.has(metadataQuery) ? id.slice(0, queryIndex) : undefined;
};

const resolveMetadataPath = (path: string, importer?: string): string => {
  if (existsSync(path)) return path;
  if (path.startsWith('/')) return resolve(process.cwd(), path.slice(1));
  if (importer) return resolve(dirname(importer), path);
  return resolve(path);
};

export function lobeDocsSiteConfigPlugin(root: string = process.cwd()): Plugin {
  return {
    load(id) {
      if (id === resolvedSiteConfigVirtualId) {
        const config = getDocsConfig(root);
        const clientConfig: ClientSiteConfig = {
          description: config.description,
          favicons: config.favicons,
          navSections: config.navSections,
          siteUrl: config.siteUrl,
          themeConfig: config.themeConfig,
          title: config.title,
        };
        return `export default ${JSON.stringify(clientConfig)};`;
      }
      if (id === resolvedCompatibilityVirtualId) {
        const config = getDocsConfig(root);
        const legacyRedirects = config.legacyRedirects ?? emptyLegacyRedirects;
        return `export default ${JSON.stringify(legacyRedirects)};`;
      }
    },
    name: 'lobe-docs-site-config',
    resolveId(source) {
      if (source === siteConfigVirtualId) return resolvedSiteConfigVirtualId;
      if (source === compatibilityVirtualId) return resolvedCompatibilityVirtualId;
      if (source === homePageVirtualId) {
        const config = getDocsConfig(root);
        if (!config.homePage) return defaultHomePagePath;

        const homePagePath = resolve(root, config.homePage);
        if (!existsSync(homePagePath)) {
          throw new Error(
            `docs.config.ts sets homePage to "${config.homePage}", but no file exists at ${homePagePath}.`,
          );
        }
        return homePagePath;
      }
    },
  };
}

export function lobeDocsDocumentModulesPlugin(root: string = process.cwd()): Plugin {
  return {
    load(id) {
      if (id !== resolvedDocumentModulesVirtualId) return;

      const config = getDocsConfig(root);
      const atomDirs = config.atomDirs ?? defaultAtomDirs;
      const componentPatterns = atomDirs.map(({ dir }) => `/${dir}/**/index.mdx`);
      const useChangelogFallback = shouldUseChangelogFallback(root);
      const publicPatterns = [
        '/docs/index.mdx',
        '/docs/changelog.mdx',
        ...(config.publicDocs ?? []).map(
          (source) => `/${source.replace(/^\.\//, '').replace(/^\//, '')}`,
        ),
        ...(useChangelogFallback ? ['/CHANGELOG.md'] : []),
      ].filter((source, index, sources) => sources.indexOf(source) === index);

      return `export const componentMetadata = import.meta.glob(${JSON.stringify(componentPatterns)}, {
  eager: true,
  import: 'default',
  query: '?document-metadata',
});
export const publicMetadata = import.meta.glob(${JSON.stringify(publicPatterns)}, {
  eager: true,
  import: 'default',
  query: '?document-metadata',
});
export const publicModuleLoaders = import.meta.glob(${JSON.stringify(publicPatterns)});
export const componentModuleLoaders = import.meta.glob(${JSON.stringify(componentPatterns)});
`;
    },
    name: 'lobe-docs-document-modules',
    resolveId(source) {
      if (source === documentModulesVirtualId) return resolvedDocumentModulesVirtualId;
    },
  };
}

export function lobeDocs(root: string = process.cwd()): Plugin[] {
  return [
    demoPlugin(),
    apiPlugin(),
    lobeDocsSiteConfigPlugin(root),
    lobeDocsDocumentModulesPlugin(root),
    {
      enforce: 'pre',
      load(id) {
        if (!id.startsWith(metadataPrefix)) return;
        const path = id.slice(metadataPrefix.length);
        const docsConfig = getDocsConfig(root);
        const document = createContentManifest(
          path,
          docsConfig.atomDirs ?? defaultAtomDirs,
          docsConfig.navSections ?? {},
          docsConfig.publicDocs ?? [],
        ).documents[0];
        if (!document) throw new Error(`No public document metadata found for ${path}`);

        return `export default ${JSON.stringify(document)};`;
      },
      name: 'lobe-docs',
      resolveId(source, importer) {
        const metadataPath = getMetadataPath(source);
        if (!metadataPath) return;
        return `${metadataPrefix}${resolveMetadataPath(metadataPath, importer)}`;
      },
    },
  ];
}
