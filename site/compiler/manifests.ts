import { resolve } from 'node:path';

import compatibility from '../content/compatibility.json';
import { createContentManifest } from './content/createManifest';
import { getStandaloneDemoPaths } from './demo/readLegacyMap';
import type { DocumentationInventory } from './types';

const repositoryRoot = resolve(import.meta.dirname, '../..');

export function getPrerenderPaths(): string[] {
  return [
    ...createContentManifest(repositoryRoot).documents.map(({ pathname }) => pathname),
    ...getStandaloneDemoPaths(compatibility as DocumentationInventory),
  ];
}
