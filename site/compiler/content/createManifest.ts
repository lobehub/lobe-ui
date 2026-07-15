import { readFileSync } from 'node:fs';
import { relative } from 'node:path';

import { parse } from 'yaml';

import { createNavigation } from '../../content/navigation';
import { canonicalizePathname, validateExplicitPathname } from '../../content/pathname';
import type {
  ContentFrontmatter,
  ContentManifest,
  DocumentManifestEntry,
} from '../../types/content';
import { discoverDocuments, type DiscoveredDocument } from './discoverDocuments';
import { validateFrontmatter } from './validateFrontmatter';

const frontmatterPattern = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

const kebabRouteSegment = (value: string): string =>
  value
    .replaceAll(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replaceAll(/([a-z\d])([A-Z])/g, '$1-$2')
    .replaceAll(/[’']/g, '')
    .replaceAll(/[^A-Za-z\d]+/g, '-')
    .replaceAll(/^-|-$/g, '')
    .toLowerCase();

const parseDocumentFrontmatter = (
  document: DiscoveredDocument,
): { diagnostics: string[]; value?: unknown } => {
  const contents = readFileSync(document.absolutePath, 'utf8');
  const match = contents.match(frontmatterPattern);
  if (!match) return { diagnostics: ['missing YAML frontmatter block'] };

  try {
    return { diagnostics: [], value: parse(match[1]) };
  } catch (error) {
    return {
      diagnostics: [
        `invalid YAML frontmatter: ${error instanceof Error ? error.message : String(error)}`,
      ],
    };
  }
};

const derivePathname = (document: DiscoveredDocument, frontmatter: ContentFrontmatter): string => {
  if (frontmatter.route) return canonicalizePathname(frontmatter.route);
  if (document.kind === 'home') return '/';
  if (document.kind === 'changelog') return '/changelog';

  const componentPath = document.source
    .slice('src/'.length, -'/index.mdx'.length)
    .split('/')
    .map(kebabRouteSegment)
    .join('/');
  return canonicalizePathname(`/components/${componentPath}`);
};

const compareDocuments = (left: DocumentManifestEntry, right: DocumentManifestEntry): number =>
  left.pathname.localeCompare(right.pathname, 'en');

const validateRouteSurface = (
  document: DiscoveredDocument,
  pathname: string,
): string | undefined => {
  if (document.kind === 'home' && pathname !== '/') {
    return `route "${pathname}" is unreachable: the home document route must remain "/"`;
  }
  if (document.kind === 'changelog' && pathname !== '/changelog') {
    return `route "${pathname}" is unreachable: the changelog document route must remain "/changelog"`;
  }
  if (document.kind === 'component' && !pathname.startsWith('/components/')) {
    return `route "${pathname}" is unreachable: component routes must remain under "/components/"`;
  }
};

export function createContentManifest(root: string): ContentManifest {
  const documents: DocumentManifestEntry[] = [];
  const diagnostics: string[] = [];
  const pathnames = new Map<string, string>();

  for (const document of discoverDocuments(root)) {
    const parsed = parseDocumentFrontmatter(document);
    const validation = validateFrontmatter(parsed.value, {
      requireCategory: document.kind === 'component',
    });
    const documentDiagnostics = [...parsed.diagnostics, ...validation.diagnostics];

    if (documentDiagnostics.length > 0 || !validation.frontmatter) {
      diagnostics.push(`${document.absolutePath}: ${documentDiagnostics.join('; ')}`);
      continue;
    }

    const pathnameDiagnostic = validation.frontmatter.route
      ? validateExplicitPathname(validation.frontmatter.route)
      : undefined;
    if (pathnameDiagnostic) {
      diagnostics.push(`${document.absolutePath}: ${pathnameDiagnostic}`);
      continue;
    }

    const pathname = derivePathname(document, validation.frontmatter);
    const routeDiagnostic = validateRouteSurface(document, pathname);
    if (routeDiagnostic) {
      diagnostics.push(`${document.absolutePath}: ${routeDiagnostic}`);
      continue;
    }

    const previousSource = pathnames.get(pathname);
    if (previousSource) {
      diagnostics.push(
        `Duplicate documentation pathname "${pathname}" for ${previousSource} and ${document.source}`,
      );
      continue;
    }
    pathnames.set(pathname, document.source);

    documents.push({
      ...validation.frontmatter,
      pathname,
      source: document.source || relative(root, document.absolutePath),
    });
  }

  if (diagnostics.length > 0) {
    throw new Error(`Invalid MDX documents:\n- ${diagnostics.join('\n- ')}`);
  }

  const sortedDocuments = documents.toSorted(compareDocuments);
  return {
    documents: sortedDocuments,
    navigation: createNavigation(sortedDocuments),
  };
}
