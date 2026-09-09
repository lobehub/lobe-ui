import type { DocumentManifestEntry } from '../types/content';
import { createNavigation } from './navigation';

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
    const navigation = createNavigation([baseAction, componentsAction]);

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
    const navigation = createNavigation(documents);

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
    const shuffled = [
      ['StoryBook', 'src/storybook/index.mdx'],
      ['Color', 'src/color/index.mdx'],
      ['Components', 'src/Button/index.mdx'],
      ['Icons', 'src/icons/Foo/index.mdx'],
      ['Base UI', 'src/base-ui/Foo/index.mdx'],
      ['Hooks & Providers', 'src/i18n/index.mdx'],
      ['Mobile', 'src/mobile/Foo/index.mdx'],
      ['Mdx', 'src/mdx/Foo/index.mdx'],
      ['Chat', 'src/chat/Foo/index.mdx'],
      ['Brand', 'src/brand/Foo/index.mdx'],
      ['Awesome', 'src/awesome/Foo/index.mdx'],
    ];
    const documents = shuffled.map(([section, source]) =>
      document({ category: 'General', source, title: `${section} document` }),
    );

    expect(createNavigation(documents).map(({ title }) => title)).toEqual([
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
    ]);
  });

  it('keeps standalone guides out of the component sidebar', () => {
    const documents = [
      document({ category: 'General', source: 'docs/index.mdx', title: 'Home' }),
      document({ category: 'General', source: 'docs/changelog.mdx', title: 'Changelog' }),
      document({ category: 'General', source: 'docs/guides/theming.mdx', title: 'Theming' }),
      document({ category: 'General', source: 'src/Button/index.mdx', title: 'Button' }),
    ];

    expect(createNavigation(documents).map(({ title }) => title)).toEqual(['Components']);
  });

  it('routes a source through a section override', () => {
    const documents = [
      document({ category: 'General', source: 'src/Odd/index.mdx', title: 'Odd' }),
    ];

    expect(
      createNavigation(documents, { 'src/Odd/index.mdx': 'Chat' }).map(({ title }) => title),
    ).toEqual(['Chat']);
  });
});
