import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router';

import type { DocumentManifestEntry } from '../../types/content';
import DocsLayout from './DocsLayout';

vi.mock('../../app/providers/SiteProviders', () => ({
  useSiteTheme: () => ({ appearance: 'light' }),
}));

const alphaDocument: DocumentManifestEntry = {
  category: 'General',
  description: 'Alpha component.',
  pathname: '/components/alpha',
  source: 'src/Alpha/index.mdx',
  title: 'Alpha',
};
const betaDocument: DocumentManifestEntry = {
  category: 'General',
  description: 'Beta component.',
  pathname: '/components/beta',
  source: 'src/Beta/index.mdx',
  title: 'Beta',
};

const TestPage = () => {
  const location = useLocation();

  return (
    <>
      <output data-testid="location">{location.pathname}</output>
      <DocsLayout
        document={alphaDocument}
        navigation={[{ documents: [alphaDocument, betaDocument], title: 'General' }]}
      >
        <h2 id="usage">Usage</h2>
        <p>Content</p>
      </DocsLayout>
    </>
  );
};

it('navigates with the memory router while preserving link semantics', async () => {
  render(
    <MemoryRouter initialEntries={['/components/alpha']}>
      <TestPage />
    </MemoryRouter>,
  );

  const alphaLink = screen.getByRole('link', { name: 'Alpha' });
  const betaLink = screen.getByRole('link', { name: 'Beta' });

  expect(alphaLink.getAttribute('href')).toBe('/components/alpha');
  expect(alphaLink.getAttribute('aria-current')).toBe('page');
  expect(betaLink.getAttribute('href')).toBe('/components/beta');
  expect(betaLink.getAttribute('aria-current')).toBeNull();

  expect(fireEvent.click(betaLink)).toBe(false);
  await waitFor(() => expect(screen.getByTestId('location').textContent).toBe('/components/beta'));

  expect(alphaLink.getAttribute('aria-current')).toBeNull();
  expect(betaLink.getAttribute('aria-current')).toBe('page');

  expect(screen.getByRole('navigation', { name: 'Component documentation' })).toBeTruthy();
  const tableOfContents = await screen.findByRole('navigation', { name: 'On this page' });
  expect(tableOfContents.textContent).toContain('Usage');
  expect(screen.getByRole('link', { name: 'Usage' }).getAttribute('href')).toBe('#usage');
});

it('marks one searchable article with title, description, category, and status metadata', () => {
  const stableDocument = { ...alphaDocument, status: 'stable' as const };
  const { container } = render(
    <MemoryRouter>
      <DocsLayout document={stableDocument} navigation={[]}>
        <p>Human prose</p>
      </DocsLayout>
    </MemoryRouter>,
  );

  expect(container.querySelectorAll('article[data-pagefind-body]')).toHaveLength(1);
  expect(container.querySelector('[data-pagefind-meta="title"]')?.textContent).toBe('Alpha');
  expect(container.querySelector('[data-pagefind-meta="description"]')?.textContent).toBe(
    'Alpha component.',
  );
  expect(container.querySelector('[data-pagefind-meta="category"]')?.textContent).toBe('General');
  expect(container.querySelector('[data-pagefind-meta="status"]')?.textContent).toBe('stable');
  expect(screen.getByText('Load discussion').closest('[data-pagefind-ignore="all"]')).toBeTruthy();
  expect(
    screen.getByText('Was this page helpful?').closest('[data-pagefind-ignore="all"]'),
  ).toBeTruthy();
});
