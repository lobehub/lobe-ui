import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import type { Plugin } from 'vite';

import { getDocsConfig } from '../../src/config';
import { apiPlugin } from './api/apiPlugin';
import { createContentManifest } from './content/createManifest';
import { defaultAtomDirs } from './content/discoverDocuments';
import { demoPlugin } from './demo/demoPlugin';

const metadataQuery = 'document-metadata';
const metadataPrefix = '\0lobe-docs:document-metadata:';
const siteConfigVirtualId = 'virtual:lobedocs/site-config';
const resolvedSiteConfigVirtualId = `\0${siteConfigVirtualId}`;
const compatibilityVirtualId = 'virtual:lobedocs/compatibility';
const resolvedCompatibilityVirtualId = `\0${compatibilityVirtualId}`;

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
        const clientConfig = {
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
        const legacyRedirects = config.legacyRedirects ?? { demoReferences: [], documents: [] };
        return `export default ${JSON.stringify(legacyRedirects)};`;
      }
    },
    name: 'lobe-docs-site-config',
    resolveId(source) {
      if (source === siteConfigVirtualId) return resolvedSiteConfigVirtualId;
      if (source === compatibilityVirtualId) return resolvedCompatibilityVirtualId;
    },
  };
}

export function lobeDocs(root: string = process.cwd()): Plugin[] {
  return [
    demoPlugin(),
    apiPlugin(),
    lobeDocsSiteConfigPlugin(root),
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
