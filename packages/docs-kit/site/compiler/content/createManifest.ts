import { readFileSync } from 'node:fs';
import path from 'node:path';

import { parse } from 'yaml';

import type { AtomDirConfig } from '../../../src/config';
import { createNavigation, toFrozenNavigationDocuments } from '../../content/navigation';
import { canonicalizePathname, validateExplicitPathname } from '../../content/pathname';
import type {
  ContentFrontmatter,
  ContentManifest,
  DocumentManifestEntry,
} from '../../types/content';
import { deriveComponentRoute, resolveAtomDir } from './atomRouting';
import { discoverDocuments, type DiscoveredDocument } from './discoverDocuments';
import { validateFrontmatter } from './validateFrontmatter';

const frontmatterPattern = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

const changelogFallbackFrontmatter = {
  description: 'Release history for this project.',
  title: 'Changelog',
};

const parseDocumentFrontmatter = (
  document: DiscoveredDocument,
): { diagnostics: string[]; value?: unknown } => {
  if (document.source === 'CHANGELOG.md') {
    return { diagnostics: [], value: changelogFallbackFrontmatter };
  }

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

interface DerivedPathname {
  pathname: string;
  subType?: string;
}

const derivePathname = (
  document: DiscoveredDocument,
  frontmatter: ContentFrontmatter,
  atomDirs: readonly AtomDirConfig[],
): DerivedPathname => {
  if (frontmatter.route) return { pathname: canonicalizePathname(frontmatter.route) };
  if (document.kind === 'home') return { pathname: '/' };
  if (document.kind === 'changelog') return { pathname: '/changelog' };
  if (document.kind === 'guide') {
    const guidePath = document.source
      .slice('docs/'.length)
      .replace(/\.mdx?$/, '')
      .replace(/\/index$/, '');
    return { pathname: canonicalizePathname(`/${guidePath}`) };
  }

  const atomDir = resolveAtomDir(document.source, atomDirs);
  const componentPath = document.source.slice(atomDir.dir.length + 1, -'/index.mdx'.length);
  const { pathname } = deriveComponentRoute(componentPath, atomDir, atomDirs);
  return atomDir.subType
    ? { pathname: canonicalizePathname(pathname), subType: atomDir.subType }
    : { pathname: canonicalizePathname(pathname) };
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

export function createContentManifest(
  root: string,
  atomDirs: readonly AtomDirConfig[],
  navSections: Record<string, string>,
  publicDocs: readonly string[] = [],
): ContentManifest {
  const documents: DocumentManifestEntry[] = [];
  const diagnostics: string[] = [];
  const pathnames = new Map<string, string>();

  for (const document of discoverDocuments(root, atomDirs, publicDocs)) {
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

    const { pathname, subType } = derivePathname(document, validation.frontmatter, atomDirs);
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
      source: document.source || path.relative(root, document.absolutePath),
      ...(subType ? { subType } : {}),
    });
  }

  if (diagnostics.length > 0) {
    throw new Error(`Invalid MDX documents:\n- ${diagnostics.join('\n- ')}`);
  }

  const sortedDocuments = documents.toSorted(compareDocuments);
  return {
    documents: sortedDocuments,
    navigation: createNavigation(sortedDocuments, toFrozenNavigationDocuments(navSections)),
  };
}
