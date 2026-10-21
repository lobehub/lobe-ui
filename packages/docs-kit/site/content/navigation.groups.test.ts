import type { DocumentManifestEntry } from '../types/content';
import { createNavigation, validateSidebarGroups } from './navigation';

const document = ({
  category,
  order,
  pathname,
  source,
  title,
}: {
  category?: string;
  order?: number;
  pathname?: string;
  source: string;
  title: string;
}): DocumentManifestEntry => ({
  ...(category ? { category } : {}),
  description: `${title} documentation.`,
  ...(order === undefined ? {} : { order }),
  pathname: pathname ?? `/${source.replace(/^docs\//, '').replace(/\.mdx?$/, '')}`,
  source,
  title,
});

describe('sidebarGroups', () => {
  const button = document({
    category: 'General',
    source: 'src/Button/index.mdx',
    title: 'Button',
  });
  const guide = document({
    category: 'Guides',
    pathname: '/migration-v6',
    source: 'docs/migration-v6.mdx',
    title: 'Migration',
  });
  const featureA = document({
    category: 'Features',
    order: 2,
    pathname: '/features/model-tag',
    source: 'docs/features/model-tag.mdx',
    title: 'ModelTag',
  });
  const featureB = document({
    category: 'Features',
    order: 1,
    pathname: '/features/icon-combine',
    source: 'docs/features/icon-combine.mdx',
    title: 'IconCombine',
  });
  const editor = document({
    category: 'Editor',
    pathname: '/editor',
    source: 'docs/editor/index.mdx',
    title: 'Icon Editor',
  });

  it('keeps docs/ pages out of the sidebar when no groups are configured', () => {
    const navigation = createNavigation([button, guide, featureA, editor]);
    expect(navigation.map(({ title }) => title)).toEqual(['Components']);
    expect(navigation[0]?.categories[0]?.documents).toEqual([button]);
  });

  it('groups docs pages by directory match', () => {
    const navigation = createNavigation([button, guide, featureA, featureB, editor], {}, [
      { dir: 'docs/features', title: 'Features' },
      { dir: 'docs/editor', title: 'Editor' },
    ]);

    expect(navigation.map(({ title }) => title)).toEqual(['Components', 'Editor', 'Features']);
    expect(navigation[1]?.categories[0]?.documents.map(({ title }) => title)).toEqual([
      'Icon Editor',
    ]);
    expect(navigation[2]?.categories[0]?.documents.map(({ title }) => title)).toEqual([
      'IconCombine',
      'ModelTag',
    ]);
  });

  it('orders configured groups by order, then title', () => {
    const navigation = createNavigation([button, featureA, editor], {}, [
      // order shares the built-in section index line (Components = 0).
      { dir: 'docs/features', order: -1, title: 'Features' },
      { dir: 'docs/editor', order: 100, title: 'Editor' },
    ]);
    expect(navigation.map(({ title }) => title)).toEqual(['Features', 'Components', 'Editor']);
  });

  it('prefers the longest matching dir prefix', () => {
    const nested = document({
      category: 'Nested',
      pathname: '/features/extra/deep',
      source: 'docs/features/extra/deep.mdx',
      title: 'Deep',
    });
    const navigation = createNavigation([featureA, nested], {}, [
      { dir: 'docs/features', title: 'Features' },
      { dir: 'docs/features/extra', title: 'Extra' },
    ]);
    expect(navigation.map(({ title }) => title)).toEqual(['Extra', 'Features']);
  });

  it('defaults missing category to the group title so the section flattens', () => {
    const bare = document({
      pathname: '/features/bare',
      source: 'docs/features/bare.mdx',
      title: 'Bare',
    });
    const navigation = createNavigation([bare], {}, [{ dir: 'docs/features', title: 'Features' }]);
    expect(navigation).toEqual([
      {
        categories: [{ documents: [bare], title: 'Features' }],
        title: 'Features',
      },
    ]);
  });

  it('rejects invalid sidebarGroups with a clear error', () => {
    expect(() => validateSidebarGroups([{ dir: '', title: 'X' } as never])).toThrow(
      /sidebarGroups\[0\]\.dir must be a non-empty string/,
    );
    expect(() =>
      validateSidebarGroups([
        { dir: 'docs/a', title: 'Same' },
        { dir: 'docs/b', title: 'Same' },
      ]),
    ).toThrow(/title duplicates another group/);
    expect(() =>
      validateSidebarGroups([
        { dir: 'docs/a', title: 'A' },
        { dir: 'docs/a', title: 'B' },
      ]),
    ).toThrow(/dir duplicates another group/);
    expect(() => validateSidebarGroups([{ dir: 'docs/a', order: Number.NaN, title: 'A' }])).toThrow(
      /order must be a finite number/,
    );
  });
});
