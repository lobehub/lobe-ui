import { describe, expect, it } from 'vitest';

// @ts-expect-error -- plain ESM helper, not covered by the library tsconfig
import { selectCommits } from './scoped-commits.mjs';

const commit = (message: string) => ({ message });

const HEADERS = [
  '✨ feat(docs-kit): derive standalone demo routes from mdx demo imports',
  ':bug: fix(docs): exclude demo headings from TOC (#569)',
  '🐛 fix(image): keep the viewer backdrop when it opens from a dialog (#598)',
  '⬆️ fix: upgrade katex to v0.18 and align class names',
  ':bookmark: chore(release): v5.27.0 [skip ci]',
  'Merge pull request #123 from lobehub/patch',
];

const headers = (commits: { message: string }[]) => commits.map((c) => c.message);

describe('selectCommits', () => {
  it('keeps only the listed scopes', () => {
    const kept = selectCommits({ scopes: ['docs-kit'] }, HEADERS.map(commit));

    expect(headers(kept)).toEqual([HEADERS[0]]);
  });

  it('drops the listed scopes when excluding', () => {
    const kept = selectCommits(
      { exclude: true, scopes: ['docs', 'docs-kit'] },
      HEADERS.map(commit),
    );

    expect(headers(kept)).toEqual([HEADERS[2], HEADERS[3], HEADERS[4], HEADERS[5]]);
  });

  it('treats scopeless and non-conventional headers as an empty scope', () => {
    const messages = ['⬆️ fix: upgrade katex', 'Merge branch master'].map(commit);

    expect(selectCommits({ scopes: [''] }, messages)).toHaveLength(2);
    expect(selectCommits({ scopes: ['docs-kit'] }, messages)).toHaveLength(0);
  });

  it('reads the scope from the header only, not the body', () => {
    const messages = [
      commit('🐛 fix(image): tighten zoom\n\nSupersedes fix(docs-kit): earlier try'),
    ];

    expect(selectCommits({ scopes: ['docs-kit'] }, messages)).toHaveLength(0);
    expect(selectCommits({ scopes: ['image'] }, messages)).toHaveLength(1);
  });
});
