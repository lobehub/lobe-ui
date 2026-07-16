import { existsSync, readdirSync, statSync } from 'node:fs';
import { basename, extname, relative, resolve } from 'node:path';

import type { AtomDirConfig } from '../../../src/config';

export type DocumentKind = 'home' | 'changelog' | 'component';

export interface DiscoveredDocument {
  absolutePath: string;
  kind: DocumentKind;
  source: string;
}

export const defaultAtomDirs: AtomDirConfig[] = [{ dir: 'src' }];

const inferKind = (source: string): DocumentKind => {
  if (source === 'docs/index.mdx') return 'home';
  if (source === 'docs/changelog.mdx' || source === 'CHANGELOG.md') return 'changelog';
  return 'component';
};

const normalizePath = (path: string): string => path.replaceAll('\\', '/');

const inferStandaloneSource = (
  absolutePath: string,
  atomDirs: readonly AtomDirConfig[],
): string => {
  const normalizedPath = normalizePath(absolutePath);
  if (normalizedPath.endsWith('/docs/index.mdx')) return 'docs/index.mdx';
  if (normalizedPath.endsWith('/docs/changelog.mdx')) return 'docs/changelog.mdx';

  for (const { dir } of atomDirs) {
    const sourceMarker = `/${dir}/`;
    const sourceIndex = normalizedPath.lastIndexOf(sourceMarker);
    if (sourceIndex >= 0) return normalizedPath.slice(sourceIndex + 1);
  }
  return basename(absolutePath);
};

const collectComponentDocuments = (directory: string): string[] => {
  if (!existsSync(directory)) return [];

  const documents: string[] = [];
  for (const entry of readdirSync(directory, { withFileTypes: true }).sort((left, right) =>
    left.name.localeCompare(right.name, 'en'),
  )) {
    const absolutePath = resolve(directory, entry.name);
    if (entry.isDirectory()) documents.push(...collectComponentDocuments(absolutePath));
    if (entry.isFile() && entry.name === 'index.mdx') documents.push(absolutePath);
  }
  return documents;
};

export function discoverDocuments(
  root: string,
  atomDirs: readonly AtomDirConfig[] = defaultAtomDirs,
): DiscoveredDocument[] {
  const absoluteRoot = resolve(root);
  const stat = statSync(absoluteRoot);

  if (stat.isFile() && (extname(absoluteRoot) === '.mdx' || extname(absoluteRoot) === '.md')) {
    const source = inferStandaloneSource(absoluteRoot, atomDirs);
    return [{ absolutePath: absoluteRoot, kind: inferKind(source), source }];
  }

  if (!stat.isDirectory()) {
    throw new Error(`Expected an MDX document: ${absoluteRoot}`);
  }

  const changelogPath = resolve(absoluteRoot, 'docs/changelog.mdx');
  const changelogFallbackPath = resolve(absoluteRoot, 'CHANGELOG.md');
  const useChangelogFallback = !existsSync(changelogPath) && existsSync(changelogFallbackPath);

  const absolutePaths = [
    resolve(absoluteRoot, 'docs/index.mdx'),
    changelogPath,
    ...(useChangelogFallback ? [changelogFallbackPath] : []),
    ...atomDirs.flatMap(({ dir }) => collectComponentDocuments(resolve(absoluteRoot, dir))),
  ].filter((path) => existsSync(path) && statSync(path).isFile());

  return absolutePaths.map((absolutePath) => {
    const source = normalizePath(relative(absoluteRoot, absolutePath));
    return { absolutePath, kind: inferKind(source), source };
  });
}
