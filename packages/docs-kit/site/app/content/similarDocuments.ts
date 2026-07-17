import type { DocumentManifestEntry } from '../../types/content';

const MAX_SUGGESTIONS = 4;
const MIN_SCORE = 0.5;

const normalizeSegment = (value: string) =>
  value
    .toLowerCase()
    .replaceAll(/[\s_-]+/g, ' ')
    .trim();

const lastSegment = (pathname: string) => pathname.split('/').findLast(Boolean) ?? '';

const bigrams = (value: string) => {
  const grams = new Set<string>();
  for (let index = 0; index < value.length - 1; index += 1) {
    grams.add(value.slice(index, index + 2));
  }
  return grams;
};

const similarity = (left: string, right: string) => {
  if (!left || !right) return 0;
  if (left === right) return 1;
  if (left.includes(right) || right.includes(left)) return 0.8;
  const leftGrams = bigrams(left);
  const rightGrams = bigrams(right);
  if (leftGrams.size === 0 || rightGrams.size === 0) return 0;
  let overlap = 0;
  for (const gram of leftGrams) {
    if (rightGrams.has(gram)) overlap += 1;
  }
  return (2 * overlap) / (leftGrams.size + rightGrams.size);
};

const score = (query: string, candidate: string) => {
  const base = similarity(query, candidate);
  if (base === 0) return 0;
  const lengthRatio =
    Math.min(query.length, candidate.length) / Math.max(query.length, candidate.length);
  return base * lengthRatio;
};

export function findSimilarDocuments(
  pathname: string,
  documents: DocumentManifestEntry[],
): DocumentManifestEntry[] {
  const query = normalizeSegment(lastSegment(pathname));
  if (query.length < 2) return [];

  return documents
    .map((document) => ({
      document,
      score: Math.max(
        score(query, normalizeSegment(lastSegment(document.pathname))),
        score(query, normalizeSegment(document.title)),
      ),
    }))
    .filter(({ score }) => score >= MIN_SCORE)
    .toSorted(
      (left, right) =>
        right.score - left.score ||
        left.document.pathname.localeCompare(right.document.pathname, 'en'),
    )
    .slice(0, MAX_SUGGESTIONS)
    .map(({ document }) => document);
}
