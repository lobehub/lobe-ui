import { emptyLegacyRedirects, getDocsConfig } from '../../src/config';
import { createContentManifest } from './content/createManifest';
import { defaultAtomDirs } from './content/discoverDocuments';
import { getStandaloneDemoPaths } from './demo/readLegacyMap';

const repositoryRoot = process.cwd();

export function getPrerenderPaths(): string[] {
  const config = getDocsConfig(repositoryRoot);
  const legacyRedirects = config.legacyRedirects ?? emptyLegacyRedirects;

  return [
    ...createContentManifest(
      repositoryRoot,
      config.atomDirs ?? defaultAtomDirs,
      config.navSections ?? {},
      config.publicDocs ?? [],
    ).documents.map(({ pathname }) => pathname),
    '/404',
    '/antd.css',
    '/theme-vars.css',
    ...getStandaloneDemoPaths(legacyRedirects),
  ];
}
