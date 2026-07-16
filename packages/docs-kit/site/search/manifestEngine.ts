import type { DocumentManifestEntry } from '../types/content';
import type { SearchEngine, SearchHit } from './types';

interface RankedHit {
  hit: SearchHit;
  score: number;
}

const normalize = (value: string | undefined): string => value?.trim().toLocaleLowerCase() ?? '';

const componentName = (source: string): string => {
  const segments = source.split('/');
  return segments.at(-2) ?? segments.at(-1) ?? source;
};

const scoreField = (field: string, query: string, weight: number): number => {
  if (!field) return 0;
  if (field === query) return weight * 4;
  if (field.startsWith(query)) return weight * 3;
  if (field.includes(query)) return weight * 2;
  return 0;
};

const rankDocument = (document: DocumentManifestEntry, query: string): RankedHit | undefined => {
  const terms = query.split(/\s+/).filter(Boolean);
  const fields = {
    category: normalize(document.category),
    component: normalize(componentName(document.source)),
    description: normalize(document.description),
    source: normalize(document.source),
    status: normalize(document.status),
    title: normalize(document.title),
  };
  const searchable = Object.values(fields).join(' ');
  if (!terms.every((term) => searchable.includes(term))) return;

  let score = 0;
  for (const term of terms) {
    score += scoreField(fields.title, term, 100);
    score += scoreField(fields.component, term, 80);
    score += scoreField(fields.description, term, 30);
    score += scoreField(fields.category, term, 25);
    score += scoreField(fields.status, term, 20);
    score += scoreField(fields.source, term, 10);
  }

  return {
    hit: {
      excerpt: document.description,
      id: document.pathname,
      pathname: document.pathname,
      section: document.category,
      title: document.title,
    },
    score,
  };
};

export function createManifestEngine(documents: readonly DocumentManifestEntry[]): SearchEngine {
  return {
    async init() {},
    async preload() {},
    async search(value) {
      const query = normalize(value);
      if (!query) return [];

      return documents
        .flatMap((document) => {
          const ranked = rankDocument(document, query);
          return ranked ? [ranked] : [];
        })
        .toSorted(
          (left, right) =>
            right.score - left.score ||
            left.hit.title.localeCompare(right.hit.title, 'en') ||
            left.hit.pathname.localeCompare(right.hit.pathname, 'en'),
        )
        .slice(0, RESULT_LIMIT)
        .map(({ hit }) => hit);
    },
  };
}

const RESULT_LIMIT = 10;
