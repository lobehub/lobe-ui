import { meta } from './not-found';

vi.mock('virtual:lobedocs/site-config', () => ({
  default: {
    description: 'Test site.',
    favicons: {},
    navSections: {},
    siteUrl: 'https://example.com',
    themeConfig: {},
    title: 'Test Docs',
  },
}));

it('derives the not-found title from siteConfig.title instead of a hardcoded brand', () => {
  const descriptors = meta({
    loaderData: {},
    location: { hash: '', key: 'not-found', pathname: '/missing', search: '', state: null },
    matches: [],
    params: {},
  });

  expect(descriptors).toEqual(
    expect.arrayContaining([
      { title: 'Documentation not found - Test Docs' },
      { content: 'noindex, nofollow', name: 'robots' },
    ]),
  );
});
