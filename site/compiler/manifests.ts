import { resolve } from 'node:path';

import { createContentManifest } from './content/createManifest';

const repositoryRoot = resolve(import.meta.dirname, '../..');

export function getPrerenderPaths(): string[] {
  return createContentManifest(repositoryRoot).documents.map(({ pathname }) => pathname);
}
