import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import type { Plugin } from 'vite';

import { createContentManifest } from './content/createManifest';

const metadataQuery = 'document-metadata';
const metadataPrefix = '\0lobe-docs:document-metadata:';

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

export function lobeDocs(): Plugin {
  return {
    enforce: 'pre',
    load(id) {
      if (!id.startsWith(metadataPrefix)) return;
      const path = id.slice(metadataPrefix.length);
      const document = createContentManifest(path).documents[0];
      if (!document) throw new Error(`No public document metadata found for ${path}`);

      return `export default ${JSON.stringify(document)};`;
    },
    name: 'lobe-docs',
    resolveId(source, importer) {
      const metadataPath = getMetadataPath(source);
      if (!metadataPath) return;
      return `${metadataPrefix}${resolveMetadataPath(metadataPath, importer)}`;
    },
  };
}
