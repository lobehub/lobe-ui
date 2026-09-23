import { emptyLegacyRedirects, getDocsConfig } from '../../src/config';
import { listOverviewPathnames } from '../content/sectionOverview';
import { listAgentPagePathnames } from './agent/assembleAgentDocs';
import { createContentManifest } from './content/createManifest';
import { defaultAtomDirs } from './content/discoverDocuments';
import { extractManifestDemoReferences } from './demo/extractDemoReferences';
import { getStandaloneDemoPaths } from './demo/readLegacyMap';

const repositoryRoot = process.cwd();

export function getPrerenderPaths(): string[] {
  const config = getDocsConfig(repositoryRoot);
  const legacyRedirects = config.legacyRedirects ?? emptyLegacyRedirects;
  const { documents, navigation } = createContentManifest(
    repositoryRoot,
    config.atomDirs ?? defaultAtomDirs,
    config.navSections ?? {},
    config.publicDocs ?? [],
  );

  return [
    ...documents.map(({ pathname }) => pathname),
    ...listOverviewPathnames(navigation),
    '/404',
    '/antd.css',
    '/theme-vars.css',
    '/llms.txt',
    '/skills.md',
    ...listAgentPagePathnames(documents),
    '/sitemap.xml',
    ...getStandaloneDemoPaths(
      legacyRedirects,
      extractManifestDemoReferences(repositoryRoot, documents),
    ),
  ];
}
