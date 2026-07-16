import { packageNamespaces } from '../../../../config/packageNamespaces';
import type { DocsApiHeaderConfig } from '../../src/config';
import type { DocumentManifestEntry, NavigationSection } from '../types/content';

export interface DocumentLinks {
  editUrl?: string;
  importStatement?: string;
  npmUrl: string;
  sourceUrl?: string;
}

export interface AdjacentDocuments {
  next?: DocumentManifestEntry;
  previous?: DocumentManifestEntry;
}

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

const defaultDocUrlTemplate = '{github}/edit/master/{atomId}';
const defaultSourceUrlTemplate = '{github}/tree/master/{atomId}';

const resolveApiHeaderTemplate = (
  template: string,
  values: { atomId: string; github: string },
): string | undefined => {
  const resolved = template
    .replaceAll('{github}', values.github)
    .replaceAll('{atomId}', values.atomId);
  if (resolved.includes('{github}') || resolved.startsWith('/')) return undefined;
  return resolved;
};

export function createDocumentLinks(
  document: DocumentManifestEntry,
  apiHeader?: DocsApiHeaderConfig,
): DocumentLinks | undefined {
  const source = document.source.replaceAll('\\', '/');
  if (!source.startsWith('src/')) return undefined;
  if (apiHeader?.match && !apiHeader.match.some((prefix) => document.pathname.startsWith(prefix))) {
    return undefined;
  }

  const [, namespace] = source.split('/');
  const packageName = namespaceSet.has(namespace) ? `@lobehub/ui/${namespace}` : '@lobehub/ui';
  const directory = source.replace(/\/index\.mdx?$/, '');
  const github = apiHeader?.github ?? '';

  return {
    editUrl: resolveApiHeaderTemplate(apiHeader?.docUrl ?? defaultDocUrlTemplate, {
      atomId: source,
      github,
    }),
    importStatement: identifierPattern.test(document.title)
      ? `import { ${document.title} } from '${packageName}';`
      : undefined,
    npmUrl: 'https://www.npmjs.com/package/@lobehub/ui',
    sourceUrl: resolveApiHeaderTemplate(apiHeader?.sourceUrl ?? defaultSourceUrlTemplate, {
      atomId: directory,
      github,
    }),
  };
}
