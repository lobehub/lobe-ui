import { packageNamespaces } from '../../config/packageNamespaces';
import type { DocumentManifestEntry, NavigationSection } from '../types/content';

export interface DocumentLinks {
  editUrl: string;
  importStatement?: string;
  npmUrl: string;
  sourceUrl: string;
}

export interface AdjacentDocuments {
  next?: DocumentManifestEntry;
  previous?: DocumentManifestEntry;
}

const repositoryUrl = 'https://github.com/lobehub/lobe-ui';
const namespaceSet = new Set<string>(packageNamespaces);
const identifierPattern = /^[A-Z][A-Za-z0-9]*$/;

export function flattenSectionDocuments(section: NavigationSection): DocumentManifestEntry[] {
  return section.categories.flatMap((category) => category.documents);
}

export function findSectionByPathname(
  navigation: readonly NavigationSection[],
  pathname: string,
): NavigationSection | undefined {
  return navigation.find((section) =>
    section.categories.some((category) =>
      category.documents.some((document) => document.pathname === pathname),
    ),
  );
}

export function sectionLandingPathname(section: NavigationSection): string {
  return flattenSectionDocuments(section)[0]?.pathname ?? '/';
}

export function findAdjacentDocuments(
  navigation: readonly NavigationSection[],
  pathname: string,
): AdjacentDocuments {
  const section = findSectionByPathname(navigation, pathname);
  if (!section) return {};

  const documents = flattenSectionDocuments(section);
  const index = documents.findIndex((document) => document.pathname === pathname);
  if (index === -1) return {};

  return { next: documents[index + 1], previous: documents[index - 1] };
}

export function createDocumentLinks(document: DocumentManifestEntry): DocumentLinks | undefined {
  const source = document.source.replaceAll('\\', '/');
  if (!source.startsWith('src/')) return undefined;

  const [, namespace] = source.split('/');
  const packageName = namespaceSet.has(namespace) ? `@lobehub/ui/${namespace}` : '@lobehub/ui';
  const directory = source.replace(/\/index\.mdx?$/, '');

  return {
    editUrl: `${repositoryUrl}/edit/master/${source}`,
    importStatement: identifierPattern.test(document.title)
      ? `import { ${document.title} } from '${packageName}';`
      : undefined,
    npmUrl: 'https://www.npmjs.com/package/@lobehub/ui',
    sourceUrl: `${repositoryUrl}/tree/master/${directory}`,
  };
}
