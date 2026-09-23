import type { DocsConfig } from '../../../src/config';
import { getDocsConfig } from '../../../src/config';
import { createContentManifest } from '../content/createManifest';
import { defaultAtomDirs } from '../content/discoverDocuments';
import { assembleAgentDocs, type AssembledAgentDocs } from './assembleAgentDocs';
import { readDocumentProse } from './readDocumentProse';

export function agentSiteFromConfig(config: DocsConfig) {
  return {
    atomDirs: config.atomDirs,
    description: config.description,
    install: config.themeConfig?.home?.install,
    navSections: config.navSections ?? {},
    origin: config.siteUrl,
    packageName: config.themeConfig?.apiHeader?.packageName,
    repository: config.themeConfig?.apiHeader?.github,
    title: config.title,
  };
}

export function loadAssembledAgentDocs(root: string = process.cwd()): AssembledAgentDocs {
  const config = getDocsConfig(root);
  const { documents } = createContentManifest(
    root,
    config.atomDirs ?? defaultAtomDirs,
    config.navSections ?? {},
    config.publicDocs ?? [],
  );
  return assembleAgentDocs({
    documents,
    proseBySource: readDocumentProse(root, documents),
    site: agentSiteFromConfig(config),
  });
}
