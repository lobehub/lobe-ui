import { describe, expect, it } from 'vitest';

import type { NavigationSection } from '../types/content';
import {
  createDocumentLinks,
  findAdjacentDocuments,
  findSectionByPathname,
  sectionLandingPathname,
} from './pageChrome';

const navigation: NavigationSection[] = [
  {
    categories: [
      {
        documents: [
          {
            category: 'General',
            description: 'Alpha.',
            pathname: '/components/alpha',
            source: 'src/Alpha/index.mdx',
            title: 'Alpha',
          },
          {
            category: 'General',
            description: 'Beta.',
            pathname: '/components/beta',
            source: 'src/Beta/index.mdx',
            title: 'Beta',
          },
        ],
        title: 'General',
      },
      {
        documents: [
          {
            category: 'Layout',
            description: 'Gamma.',
            pathname: '/components/gamma',
            source: 'src/Gamma/index.mdx',
            title: 'Gamma',
          },
        ],
        title: 'Layout',
      },
    ],
    title: 'Components',
  },
];

describe('findSectionByPathname', () => {
  it('locates the section containing a document pathname', () => {
    expect(findSectionByPathname(navigation, '/components/gamma')?.title).toBe('Components');
    expect(findSectionByPathname(navigation, '/changelog')).toBeUndefined();
  });
});

describe('sectionLandingPathname', () => {
  it('returns the first document of the section', () => {
    expect(sectionLandingPathname(navigation[0])).toBe('/components/alpha');
  });
});

describe('findAdjacentDocuments', () => {
  it('walks documents across category boundaries', () => {
    const { next, previous } = findAdjacentDocuments(navigation, '/components/beta');
    expect(previous?.title).toBe('Alpha');
    expect(next?.title).toBe('Gamma');
  });

  it('omits neighbours at the section edges', () => {
    expect(findAdjacentDocuments(navigation, '/components/alpha').previous).toBeUndefined();
    expect(findAdjacentDocuments(navigation, '/components/gamma').next).toBeUndefined();
    expect(findAdjacentDocuments(navigation, '/unknown')).toEqual({});
  });
});

describe('createDocumentLinks', () => {
  it('derives root package imports and repository links', () => {
    const links = createDocumentLinks({
      category: 'General',
      description: 'Alpha.',
      pathname: '/components/alpha',
      source: 'src/Alpha/index.mdx',
      title: 'Alpha',
    });

    expect(links).toMatchObject({
      editUrl: 'https://github.com/lobehub/lobe-ui/edit/master/src/Alpha/index.mdx',
      importStatement: "import { Alpha } from '@lobehub/ui';",
      sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/Alpha',
    });
  });

  it('uses the namespace subpath package for namespaced sources', () => {
    const links = createDocumentLinks({
      category: 'General',
      description: 'Bubble.',
      pathname: '/components/chat-bubble',
      source: 'src/chat/Bubble/index.mdx',
      title: 'Bubble',
    });

    expect(links?.importStatement).toBe("import { Bubble } from '@lobehub/ui/chat';");
  });

  it('omits the import statement for non-identifier titles and skips non-src documents', () => {
    expect(
      createDocumentLinks({
        category: 'General',
        description: 'Overview.',
        pathname: '/components/custom-theme',
        source: 'src/color/customTheme/index.mdx',
        title: 'Custom Theme',
      })?.importStatement,
    ).toBeUndefined();
    expect(
      createDocumentLinks({
        description: 'Changelog.',
        pathname: '/changelog',
        source: 'docs/changelog.mdx',
        title: 'Changelog',
      }),
    ).toBeUndefined();
  });
});
