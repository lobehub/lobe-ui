import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import {
  createMemoryRouter,
  MemoryRouter,
  Outlet,
  Route,
  RouterProvider,
  Routes,
} from 'react-router';

import DocumentRoute from './document';
import NotFound, { meta } from './not-found';

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

vi.mock('../content/registry', () => ({
  contentManifest: {
    documents: [
      {
        description: 'ActionIcon.',
        pathname: '/components/action-icon',
        source: 'src/ActionIcon/index.mdx',
        title: 'ActionIcon',
      },
    ],
    navigation: [],
  },
  findDocument: vi.fn(),
  loadDocument: vi.fn(),
}));

const openSearch = vi.fn();

afterEach(() => {
  cleanup();
  openSearch.mockClear();
});

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

const renderNotFound = (entry: string) =>
  render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route element={<Outlet context={{ openSearch }} />}>
          <Route element={<NotFound />} path="*" />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

it('shows the requested pathname and opens search from the primary action', () => {
  renderNotFound('/components/actonicon');

  screen.getByText('/components/actonicon');
  fireEvent.click(screen.getByRole('button', { name: /search documentation/i }));

  expect(openSearch).toHaveBeenCalledTimes(1);
});

it('suggests similar pages for a mistyped path', () => {
  renderNotFound('/components/actonicon');

  const suggestion = screen.getByRole('link', { name: 'ActionIcon' });
  expect(suggestion.getAttribute('href')).toBe('/components/action-icon');
});

it('omits the suggestions block when nothing is similar', () => {
  renderNotFound('/xyzzy-nothing-like-this');

  expect(screen.queryByRole('navigation', { name: /similar pages/i })).toBeNull();
});

it('renders the not-found page when a documentation pathname is absent from the manifest', async () => {
  const router = createMemoryRouter(
    [
      {
        children: [
          {
            Component: DocumentRoute,
            path: 'components/*',
          },
        ],
        Component: () => <Outlet context={{ openSearch }} />,
        ErrorBoundary: () => <h1>Documentation unavailable</h1>,
        path: '/',
      },
    ],
    { initialEntries: ['/components/actonicon'] },
  );

  render(<RouterProvider router={router} />);

  expect(await screen.findByRole('heading', { name: 'Documentation not found' })).toBeTruthy();
});
