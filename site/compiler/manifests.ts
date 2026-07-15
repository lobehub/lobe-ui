import path from 'node:path';

import compatibility from '../content/compatibility.json';
import { createContentManifest } from './content/createManifest';
import { getStandaloneDemoPaths } from './demo/readLegacyMap';
import type { DocumentationInventory } from './types';

const repositoryRoot = path.resolve(import.meta.dirname, '../..');

export function getPrerenderPaths(): string[] {
  return [
    ...createContentManifest(repositoryRoot).documents.map(({ pathname }) => pathname),
    '/404',
    '/antd.css',
    '/theme-vars.css',
    ...getStandaloneDemoPaths(compatibility as DocumentationInventory),
  ];
}
