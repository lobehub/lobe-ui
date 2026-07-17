import type { DocumentManifestEntry } from '../../types/content';
import { findSimilarDocuments } from './similarDocuments';

const entry = (pathname: string, title: string): DocumentManifestEntry => ({
  description: '',
  pathname,
  source: `${pathname}.mdx`,
  title,
});

const documents = [
  entry('/components/action-icon', 'ActionIcon'),
  entry('/components/action-icon-group', 'ActionIconGroup'),
  entry('/components/avatar', 'Avatar'),
  entry('/components/markdown', 'Markdown'),
  entry('/changelog', 'Changelog'),
];

it('matches a typo against the closest pathname segment', () => {
  const suggestions = findSimilarDocuments('/components/actonicon', documents);

  expect(suggestions.map((document) => document.pathname)).toEqual(['/components/action-icon']);
});

it('matches against document titles as well as pathnames', () => {
  const suggestions = findSimilarDocuments('/components/avatarr', documents);

  expect(suggestions[0]?.pathname).toBe('/components/avatar');
});

it('ranks closer matches first and caps the list', () => {
  const suggestions = findSimilarDocuments('/components/action-icon-grop', documents);

  expect(suggestions[0]?.pathname).toBe('/components/action-icon-group');
  expect(suggestions.length).toBeLessThanOrEqual(4);
});

it('returns nothing when the path is unrelated to any document', () => {
  expect(findSimilarDocuments('/totally/unrelated-xyzzy', documents)).toEqual([]);
});

it('returns nothing for trivial paths', () => {
  expect(findSimilarDocuments('/', documents)).toEqual([]);
  expect(findSimilarDocuments('/a', documents)).toEqual([]);
});
