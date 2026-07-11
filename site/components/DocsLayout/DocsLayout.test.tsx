import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router';

import type { DocumentManifestEntry } from '../../types/content';
import DocsLayout from './DocsLayout';

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
        <h2>Usage</h2>
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
