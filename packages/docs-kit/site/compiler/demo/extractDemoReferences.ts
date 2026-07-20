import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import type { DocumentManifestEntry } from '../../types/content';
import { createCanonicalDemoId } from './readLegacyMap';

export interface ManifestDemoReference {
  canonicalId: string;
  document: string;
  pathname: string;
  source: string;
}

const demoImportPattern = /^\s*import\s+[\w$]+\s+from\s+['"]([^'"]+)\?demo['"]/;
const fencePattern = /^\s*(`{3,}|~{3,})/;

const normalizePath = (path: string): string => path.replaceAll('\\', '/');

const collectDemoImportSpecifiers = (contents: string): string[] => {
  const specifiers: string[] = [];
  let fence: string | undefined;

  for (const line of contents.split('\n')) {
    const fenceMatch = line.match(fencePattern);
    if (fenceMatch) {
      if (!fence) fence = fenceMatch[1];
      else if (fenceMatch[1].startsWith(fence[0]) && fenceMatch[1].length >= fence.length) {
        fence = undefined;
      }
      continue;
    }
    if (fence) continue;

    const importMatch = line.match(demoImportPattern);
    if (importMatch) specifiers.push(importMatch[1]);
  }

  return specifiers;
};

export function extractManifestDemoReferences(
  root: string,
  documents: readonly DocumentManifestEntry[],
): ManifestDemoReference[] {
  const references: ManifestDemoReference[] = [];
  const seen = new Set<string>();
  const errors: string[] = [];

  for (const document of documents) {
    const documentSource = normalizePath(document.source);
    if (!documentSource.endsWith('.mdx')) continue;

    const absoluteDocument = path.resolve(root, documentSource);
    if (!existsSync(absoluteDocument)) continue;

    for (const specifier of collectDemoImportSpecifiers(readFileSync(absoluteDocument, 'utf8'))) {
      if (!specifier.startsWith('.')) continue;

      const absoluteSource = path.resolve(path.dirname(absoluteDocument), specifier);
      if (!existsSync(absoluteSource)) {
        errors.push(`Missing demo source "${specifier}" referenced by ${documentSource}`);
        continue;
      }

      const source = normalizePath(path.relative(root, absoluteSource));
      const key = `${documentSource}:${source}`;
      if (seen.has(key)) continue;
      seen.add(key);

      references.push({
        canonicalId: createCanonicalDemoId(source),
        document: documentSource,
        pathname: document.pathname,
        source,
      });
    }
  }

  if (errors.length > 0) {
    throw new Error(`Invalid demo references:\n- ${errors.join('\n- ')}`);
  }

  return references.toSorted((left, right) =>
    left.canonicalId.localeCompare(right.canonicalId, 'en'),
  );
}
