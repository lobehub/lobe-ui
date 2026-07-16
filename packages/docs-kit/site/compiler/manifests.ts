import path from 'node:path';

import { getDocsConfig } from '../../src/config';
import { createContentManifest } from './content/createManifest';
import { getStandaloneDemoPaths } from './demo/readLegacyMap';
import type { DocumentationInventory } from './types';

const repositoryRoot = path.resolve(import.meta.dirname, '../../../..');

export function getPrerenderPaths(): string[] {
  const config = getDocsConfig(repositoryRoot);
  const legacyRedirects = (config.legacyRedirects ?? {
    demoReferences: [],
    documents: [],
  }) as DocumentationInventory;

  return [
    ...createContentManifest(repositoryRoot).documents.map(({ pathname }) => pathname),
    '/404',
    '/antd.css',
    '/theme-vars.css',
    ...getStandaloneDemoPaths(legacyRedirects),
  ];
}
