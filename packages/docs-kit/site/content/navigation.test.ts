import compatibility from '../../../../compatibility.json';
import navigationSections from '../../../../navigationSections.json';
import type { DocumentManifestEntry } from '../types/content';
import { createNavigation, toFrozenNavigationDocuments } from './navigation';

interface FrozenDocument {
  section: string;
  source: string;
}

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
  pathname: pathname ?? `/components/${title.toLowerCase()}`,
  source,
  title,
});

const finalSource = (source: string): string => source.replace(/\.md$/, '.mdx');
const sourceIdentity = (source: string): string => source.replace(/\.mdx?$/, '');

describe('reviewed documentation navigation', () => {
  it('keeps equal category names separate across frozen sections', () => {
    const componentsAction = document({
      category: 'General',
      source: 'src/Action/index.mdx',
      title: 'Action',
    });
    const baseAction = document({
      category: 'General',
      source: 'src/base-ui/Action/index.mdx',
      title: 'Base Action',
    });
    const frozenDocuments: FrozenDocument[] = [
      { section: 'Components', source: 'src/Action/index.md' },
      { section: 'Base UI', source: 'src/base-ui/Action/index.md' },
    ];

    const navigation = createNavigation([baseAction, componentsAction], frozenDocuments);

    expect(navigation.map(({ title }) => title)).toEqual(['Components', 'Base UI']);
    expect(navigation[0]?.categories[0]?.documents).toEqual([componentsAction]);
    expect(navigation[1]?.categories[0]?.documents).toEqual([baseAction]);
  });

  it('orders sections, categories, and documents at their independent hierarchy levels', () => {
    const documents = [
      document({
        category: 'Feedback',
        source: 'src/chat/Notice/index.mdx',
        title: 'Notice',
      }),
      document({
        category: 'Data Display',
        order: 20,
        source: 'src/Avatar/index.mdx',
        title: 'Avatar',
      }),
      document({
        category: 'General',
        order: 20,
        source: 'src/Checkbox/index.mdx',
        title: 'Checkbox',
      }),
      document({
        category: 'General',
        order: 20,
        source: 'src/Button/index.mdx',
        title: 'Button',
      }),
      document({
        category: 'General',
        order: -1,
        source: 'src/ActionIcon/index.mdx',
        title: 'ActionIcon',
      }),
      document({
        category: 'Feedback',
        source: 'src/Alert/index.mdx',
        title: 'Alert',
      }),
    ];
    const frozenDocuments: FrozenDocument[] = [
      { section: 'Chat', source: 'src/chat/Notice/index.md' },
      { section: 'Components', source: 'src/Avatar/index.md' },
      { section: 'Components', source: 'src/Button/index.mdx' },
      { section: 'Components', source: 'src/ActionIcon/index.md' },
      { section: 'Components', source: 'src/Checkbox/index.md' },
      { section: 'Components', source: 'src/Alert/index.md' },
    ];

    const navigation = createNavigation(documents, frozenDocuments);

    expect(navigation.map(({ title }) => title)).toEqual(['Components', 'Chat']);
    expect(navigation[0]?.categories.map(({ title }) => title)).toEqual([
      'General',
      'Data Display',
      'Feedback',
    ]);
    expect(navigation[0]?.categories[0]?.documents.map(({ title }) => title)).toEqual([
      'ActionIcon',
      'Button',
      'Checkbox',
    ]);
  });

  it('applies the complete reviewed section order regardless of input order', () => {
    const expectedSections = [
      'Components',
      'Base UI',
      'Chat',
      'Mobile',
      'Awesome',
      'Brand',
      'Mdx',
      'Icons',
      'Color',
      'Hooks & Providers',
      'StoryBook',
    ];
    const shuffledSections = [
      'StoryBook',
      'Color',
      'Components',
      'Icons',
      'Base UI',
      'Hooks & Providers',
      'Mobile',
      'Mdx',
      'Chat',
      'Brand',
      'Awesome',
    ];
    const documents = shuffledSections.map((section, index) =>
      document({
        category: 'General',
        source: `src/Section${index}/index.mdx`,
        title: `${section} document`,
      }),
    );
    const frozenDocuments = shuffledSections.map((section, index) => ({
      section,
      source: `src/Section${index}/index.md`,
    }));

    expect(createNavigation(documents, frozenDocuments).map(({ title }) => title)).toEqual(
      expectedSections,
    );
  });

  it('keeps the compact runtime section map consistent with the frozen compatibility authority', () => {
    const compactEntries = Object.entries(navigationSections);
    const compactBySource = new Map(
      compactEntries.map(([source, section]) => [sourceIdentity(source), section]),
    );

    expect(compactEntries).toHaveLength(161);
    expect(compactBySource.size).toBe(161);
    for (const frozenDocument of compatibility.documents) {
      expect(compactBySource.get(sourceIdentity(frozenDocument.source))).toBe(
        frozenDocument.section,
      );
    }
  });

  it('assigns every frozen source to exactly one section while keeping overview links separate', () => {
    expect(compatibility.documents).toHaveLength(160);

    const documents = compatibility.documents.map((record) =>
      document({
        category:
          record.pathname === '/' || record.pathname === '/changelog'
            ? undefined
            : (record.category ?? 'General'),
        pathname: record.pathname,
        source: finalSource(record.source),
        title: record.title ?? 'Documentation overview',
      }),
    );
    const navigation = createNavigation(documents, toFrozenNavigationDocuments(navigationSections));
    const nestedDocuments = navigation.flatMap(({ categories }) =>
      categories.flatMap(({ documents: categoryDocuments }) => categoryDocuments),
    );
    const frozenComponentSources = compatibility.documents
      .filter(({ pathname }) => pathname !== '/' && pathname !== '/changelog')
      .map(({ source }) => sourceIdentity(source))
      .toSorted();

    expect(nestedDocuments).toHaveLength(158);
    expect(nestedDocuments.map(({ source }) => sourceIdentity(source)).toSorted()).toEqual(
      frozenComponentSources,
    );
  });

  it('fails when a manifest document has no frozen section record', () => {
    const unknown = document({
      category: 'General',
      source: 'src/Unknown/index.mdx',
      title: 'Unknown',
    });

    expect(() => createNavigation([unknown], [])).toThrow(
      /src\/Unknown\/index\.mdx.*no frozen section record/i,
    );
  });

  it('fails when a manifest document resolves to duplicate frozen section records', () => {
    const action = document({
      category: 'General',
      source: 'src/Action/index.mdx',
      title: 'Action',
    });

    expect(() =>
      createNavigation(
        [action],
        [
          { section: 'Components', source: 'src/Action/index.md' },
          { section: 'Base UI', source: 'src/Action/index.mdx' },
        ],
      ),
    ).toThrow(/src\/Action\/index\.mdx.*multiple frozen section records.*Components.*Base UI/i);
  });

  it('fails with the source and unsupported frozen section in its diagnostic', () => {
    const action = document({
      category: 'General',
      source: 'src/Action/index.mdx',
      title: 'Action',
    });

    expect(() =>
      createNavigation(
        [action],
        [{ section: 'Experimental Components', source: 'src/Action/index.md' }],
      ),
    ).toThrow(/src\/Action\/index\.mdx.*unknown frozen section.*Experimental Components/i);
  });
});
