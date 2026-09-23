import type { DocumentManifestEntry, NavigationSection } from '../types/content';
import {
  findOverview,
  hasSubgroups,
  listOverviewPathnames,
  slugifyNavigationTitle,
} from './sectionOverview';

const document = (pathname: string): DocumentManifestEntry => ({
  description: '',
  pathname,
  source: `src${pathname}/index.mdx`,
  title: pathname,
});

const navigation: NavigationSection[] = [
  {
    categories: [
      { documents: [document('/components/button')], title: 'General' },
      { documents: [document('/components/flex')], title: 'Data Display' },
      { documents: [], title: 'Empty' },
    ],
    title: 'Components',
  },
  {
    categories: [{ documents: [document('/hooks/a')], title: 'Hooks & Providers' }],
    title: 'Hooks & Providers',
  },
  { categories: [], title: 'Nothing' },
];

it('slugifies titles', () => {
  expect(slugifyNavigationTitle('Hooks & Providers')).toBe('hooks-providers');
  expect(slugifyNavigationTitle('  Base UI ')).toBe('base-ui');
  expect(slugifyNavigationTitle('Café')).toBe('cafe');
});

it('flattens a lone category that repeats its section', () => {
  expect(hasSubgroups(navigation[0])).toBe(true);
  expect(hasSubgroups(navigation[1])).toBe(false);
});

it('lists overview pages for sections and their non-empty categories', () => {
  expect(listOverviewPathnames(navigation)).toEqual([
    '/sections/components',
    '/sections/components/general',
    '/sections/components/data-display',
    '/sections/hooks-providers',
  ]);
});

it('matches overview pathnames, ignoring a trailing slash', () => {
  expect(findOverview(navigation, '/sections/components/')?.section.title).toBe('Components');
  expect(findOverview(navigation, '/sections/components/data-display')?.category?.title).toBe(
    'Data Display',
  );
  expect(findOverview(navigation, '/sections/hooks-providers/hooks-providers')).toBeUndefined();
  expect(findOverview(navigation, '/sections/unknown')).toBeUndefined();
});
