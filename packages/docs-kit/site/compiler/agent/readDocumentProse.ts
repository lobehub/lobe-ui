import { readFileSync } from 'node:fs';
import path from 'node:path';

import type { DocumentManifestEntry } from '../../types/content';
import { extractMdxProse, type MdxProse } from './mdxProse';

const emptyProse: MdxProse = { headings: [], prose: '' };

const prosePath = (root: string, source: string): string | undefined => {
  const absoluteRoot = path.resolve(root);
  const absolute = path.resolve(absoluteRoot, source);
  const relative = path.relative(absoluteRoot, absolute);
  if (relative.startsWith('..') || path.isAbsolute(relative)) return;
  return absolute;
};

export function readDocumentProse(
  root: string,
  documents: readonly Pick<DocumentManifestEntry, 'source'>[],
): Map<string, MdxProse> {
  const proseBySource = new Map<string, MdxProse>();
  for (const document of documents) {
    if (proseBySource.has(document.source)) continue;
    const file = prosePath(root, document.source);
    if (!file) {
      proseBySource.set(document.source, emptyProse);
      continue;
    }
    try {
      proseBySource.set(document.source, extractMdxProse(readFileSync(file, 'utf8')));
    } catch {
      proseBySource.set(document.source, emptyProse);
    }
  }
  return proseBySource;
}
