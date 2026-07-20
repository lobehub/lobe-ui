import { emptyLegacyRedirects, getDocsConfig } from '../../src/config';
import { createContentManifest } from './content/createManifest';
import { defaultAtomDirs } from './content/discoverDocuments';
import { extractManifestDemoReferences } from './demo/extractDemoReferences';
import { getStandaloneDemoPaths } from './demo/readLegacyMap';

const repositoryRoot = process.cwd();

export function getPrerenderPaths(): string[] {
  const config = getDocsConfig(repositoryRoot);
  const legacyRedirects = config.legacyRedirects ?? emptyLegacyRedirects;
  const { documents } = createContentManifest(
    repositoryRoot,
    config.atomDirs ?? defaultAtomDirs,
    config.navSections ?? {},
    config.publicDocs ?? [],
  );

  return [
    ...documents.map(({ pathname }) => pathname),
    '/404',
    '/antd.css',
    '/theme-vars.css',
    ...getStandaloneDemoPaths(
      legacyRedirects,
      extractManifestDemoReferences(repositoryRoot, documents),
    ),
  ];
}
