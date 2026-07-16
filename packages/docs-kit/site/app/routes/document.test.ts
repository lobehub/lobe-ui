import type { MetaDescriptor } from 'react-router';

import { siteMetadata } from '../../content/siteMetadata';
import type { DocumentManifestEntry } from '../../types/content';
import { meta } from './document';
import { meta as notFoundMeta } from './not-found';

const document: DocumentManifestEntry = {
  category: 'General',
  description: 'Triggers an action.',
  pathname: '/components/button',
  source: 'src/Button/index.mdx',
  title: 'Button',
};

vi.mock('../content/registry', () => ({
  contentManifest: { documents: [], navigation: [] },
  findDocument: (pathname: string) => (pathname === '/components/button' ? document : undefined),
  loadDocument: vi.fn(),
}));

const readDescriptors = (value: ReturnType<typeof meta>): MetaDescriptor[] =>
  Array.isArray(value) ? value : [];

it('emits absolute canonical, Open Graph, and Twitter metadata for a document', () => {
  const descriptors = readDescriptors(
    meta({ location: { pathname: '/components/button' } } as never),
  );

  expect(descriptors).toEqual(
    expect.arrayContaining([
      { title: 'Button - Lobe UI' },
      { content: 'Triggers an action.', name: 'description' },
      {
        href: `${siteMetadata.origin}/components/button`,
        rel: 'canonical',
        tagName: 'link',
      },
      { content: 'website', property: 'og:type' },
      { content: siteMetadata.name, property: 'og:site_name' },
      { content: 'Button - Lobe UI', property: 'og:title' },
      { content: 'Triggers an action.', property: 'og:description' },
      { content: `${siteMetadata.origin}/components/button`, property: 'og:url' },
      {
        content: siteMetadata.openGraphImage,
        property: 'og:image',
      },
      { content: 'summary_large_image', name: 'twitter:card' },
    ]),
  );
});

it('marks the prerendered not-found document as noindex', () => {
  const descriptors = readDescriptors(notFoundMeta({} as never));

  expect(descriptors).toEqual(
    expect.arrayContaining([
      { title: 'Documentation not found - Lobe UI' },
      { content: 'noindex, nofollow', name: 'robots' },
    ]),
  );
});

it('marks an unknown document matched by the components wildcard as noindex', () => {
  const descriptors = readDescriptors(
    meta({ location: { pathname: '/components/missing' } } as never),
  );

  expect(descriptors).toEqual(
    expect.arrayContaining([{ content: 'noindex, nofollow', name: 'robots' }]),
  );
});
