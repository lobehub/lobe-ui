import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { expect, it, vi } from 'vitest';

import type { DocumentManifestEntry, NavigationSection } from '../../types/content';
import { Sidebar } from './Sidebar';

const actionDocument: DocumentManifestEntry = {
  category: 'General',
  description: 'Action documentation.',
  pathname: '/components/action',
  source: 'src/Action/index.mdx',
  title: 'Action',
};
const baseActionDocument: DocumentManifestEntry = {
  category: 'General',
  description: 'Base Action documentation.',
  pathname: '/components/base-ui/action',
  source: 'src/base-ui/Action/index.mdx',
  title: 'Base Action',
};
const navigation: NavigationSection[] = [
  {
    categories: [{ documents: [actionDocument], title: 'General' }],
    title: 'Components',
  },
  {
    categories: [{ documents: [baseActionDocument], title: 'General' }],
    title: 'Base UI',
  },
];

it('renders independent overview links and semantic section/category headings', () => {
  render(
    <MemoryRouter>
      <Sidebar navigation={navigation} />
    </MemoryRouter>,
  );

  const sidebar = screen.getByRole('navigation', { name: 'Component documentation' });
  expect(
    within(sidebar)
      .getAllByRole('link')
      .slice(0, 2)
      .map((link) => link.textContent),
  ).toEqual(['Overview', 'Changelog']);
  expect(within(sidebar).getByRole('heading', { level: 2, name: 'Documentation' })).toBeTruthy();
  expect(within(sidebar).getByRole('heading', { level: 2, name: 'Components' })).toBeTruthy();
  expect(within(sidebar).getByRole('heading', { level: 2, name: 'Base UI' })).toBeTruthy();
  expect(within(sidebar).getAllByRole('heading', { level: 3, name: 'General' })).toHaveLength(2);
});

it('preserves active-link semantics and invokes the mobile navigation callback', async () => {
  const onNavigate = vi.fn();
  render(
    <MemoryRouter initialEntries={[actionDocument.pathname]}>
      <Sidebar navigation={navigation} onNavigate={onNavigate} />
    </MemoryRouter>,
  );

  const actionLink = screen.getByRole('link', { name: 'Action' });
  const baseActionLink = screen.getByRole('link', { name: 'Base Action' });
  expect(actionLink.getAttribute('aria-current')).toBe('page');
  expect(baseActionLink.getAttribute('aria-current')).toBeNull();

  fireEvent.click(baseActionLink);

  expect(onNavigate).toHaveBeenCalledOnce();
  await waitFor(() => expect(baseActionLink.getAttribute('aria-current')).toBe('page'));
  expect(actionLink.getAttribute('aria-current')).toBeNull();
});
