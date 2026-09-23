import { SkillsIcon } from '@lobehub/ui/icons';
import { Bot, Folder, History, House } from 'lucide-react';

import type { DocumentManifestEntry, NavigationSection } from '../../types/content';
import {
  buildBreadcrumb,
  buildNavGroups,
  buildNavItems,
  findActiveLocation,
  isExternalHref,
  sectionIcon,
} from './navigation';

const createDocument = (pathname: string, title: string): DocumentManifestEntry => ({
  description: `${title} description.`,
  pathname,
  source: `src/${title}/index.mdx`,
  title,
});

const alpha = createDocument('/components/alpha', 'Alpha');
const beta = createDocument('/components/beta', 'Beta');
const button = createDocument('/base-ui/button', 'Button');
const intro = createDocument('/guides/intro', 'Intro');
const changelog = createDocument('/changelog', 'Changelog');

const navigation: NavigationSection[] = [
  { categories: [{ documents: [intro], title: 'Guides' }], title: 'Guides' },
  { categories: [{ documents: [button], title: 'General' }], title: 'Base UI' },
  {
    categories: [
      { documents: [alpha], title: 'General' },
      { documents: [beta], title: 'Layout' },
    ],
    title: 'Components',
  },
];

describe('buildNavItems', () => {
  it('surrounds configured links with Home and Changelog', () => {
    expect(buildNavItems().map((item) => [item.href, item.icon, item.external])).toEqual([
      ['/', House, false],
      ['/skills.md', SkillsIcon, true],
      ['/llms.txt', Bot, true],
      ['/changelog', History, false],
    ]);
    expect(buildNavItems().every((item) => item.end)).toBe(true);
  });

  it('keeps a configured changelog after the agent links and flags external links', () => {
    const items = buildNavItems([
      { href: '/changelog', label: 'Releases' },
      { href: 'https://example.com/blog', label: 'Blog' },
    ]);

    expect(items.map((item) => [item.label, item.href, item.external])).toEqual([
      ['Home', '/', false],
      ['skills.md', '/skills.md', true],
      ['llms.txt', '/llms.txt', true],
      ['Releases', '/changelog', false],
      ['Blog', 'https://example.com/blog', true],
    ]);
  });
});

describe('buildNavGroups', () => {
  const groups = buildNavGroups(navigation);

  it('orders preferred sections first and gives only sections an icon', () => {
    expect(groups.map((group) => group.label)).toEqual(['Components', 'Base UI', 'Guides']);
    expect(groups.every((group) => group.icon)).toBe(true);
    expect(groups[0].groups?.every((category) => !category.icon)).toBe(true);
    expect(
      groups
        .flatMap((group) => [
          ...(group.items ?? []),
          ...(group.groups ?? []).flatMap((category) => category.items ?? []),
        ])
        .every((item) => !item.icon && item.end),
    ).toBe(true);
  });

  it('nests categories and links every group to its overview page', () => {
    const [components, baseUi, guides] = groups;

    expect(components.href).toBe('/sections/components');
    expect(components.groups?.map((category) => [category.label, category.href])).toEqual([
      ['General', '/sections/components/general'],
      ['Layout', '/sections/components/layout'],
    ]);
    expect(components.defaultExpanded).toBeUndefined();
    expect(components.groups?.every((category) => category.defaultExpanded)).toBe(true);
    expect(baseUi.groups?.map((category) => category.label)).toEqual(['General']);
    expect(guides.groups).toBeUndefined();
    expect(guides.items?.map((item) => item.href)).toEqual(['/guides/intro']);
  });

  it('drops sections without documents', () => {
    expect(buildNavGroups([{ categories: [], title: 'Empty' }])).toEqual([]);
  });

  it('falls back to a folder icon for unknown sections', () => {
    expect(sectionIcon('Unknown')).toBe(Folder);
  });
});

describe('findActiveLocation', () => {
  it('resolves documents and overview pages', () => {
    expect(findActiveLocation(navigation, beta.pathname)).toMatchObject({
      categoryTitle: 'Layout',
      section: { title: 'Components' },
    });
    expect(findActiveLocation(navigation, intro.pathname)).toMatchObject({
      categoryTitle: undefined,
      section: { title: 'Guides' },
    });
    expect(findActiveLocation(navigation, '/sections/components/layout')).toMatchObject({
      categoryTitle: 'Layout',
    });
    expect(findActiveLocation(navigation, '/elsewhere')).toBeUndefined();
  });
});

describe('buildBreadcrumb', () => {
  const documents = [alpha, beta, button, intro, changelog];

  it('links the section and category of a document to their overview pages', () => {
    expect(buildBreadcrumb(navigation, documents, beta.pathname)).toEqual([
      { href: '/sections/components', label: 'Components', optional: true },
      { href: '/sections/components/layout', label: 'Layout' },
      { label: 'Beta' },
    ]);
  });

  it('skips a category that repeats the section', () => {
    expect(buildBreadcrumb(navigation, documents, intro.pathname)).toEqual([
      { href: '/sections/guides', label: 'Guides', optional: false },
      { label: 'Intro' },
    ]);
  });

  it('describes overview pages', () => {
    expect(buildBreadcrumb(navigation, documents, '/sections/components')).toEqual([
      { label: 'Components' },
    ]);
    expect(buildBreadcrumb(navigation, documents, '/sections/components/layout')).toEqual([
      { href: '/sections/components', label: 'Components' },
      { label: 'Layout' },
    ]);
  });

  it('falls back to Home for pages outside any section', () => {
    expect(buildBreadcrumb(navigation, documents, '/')).toEqual([{ label: 'Home' }]);
    expect(buildBreadcrumb(navigation, documents, '/changelog')).toEqual([
      { href: '/', label: 'Home' },
      { label: 'Changelog' },
    ]);
    expect(buildBreadcrumb(navigation, documents, '/missing')).toEqual([
      { href: '/', label: 'Home' },
      { label: 'Not found' },
    ]);
  });
});

it('detects external hrefs by scheme', () => {
  expect(isExternalHref('https://example.com')).toBe(true);
  expect(isExternalHref('mailto:hi@example.com')).toBe(true);
  expect(isExternalHref('/components/alpha')).toBe(false);
});
