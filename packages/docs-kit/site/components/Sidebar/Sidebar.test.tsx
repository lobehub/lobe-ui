import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, expect, it, vi } from 'vitest';

import type { DocumentManifestEntry, NavigationSection } from '../../types/content';
import { Sidebar } from './Sidebar';

const createRect = ({
  height,
  left,
  top,
  width,
}: {
  height: number;
  left: number;
  top: number;
  width: number;
}): DOMRect =>
  ({
    bottom: top + height,
    height,
    left,
    right: left + width,
    toJSON: () => ({}),
    top,
    width,
    x: left,
    y: top,
  }) as DOMRect;

afterEach(() => vi.restoreAllMocks());

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

it('keeps one indicator positioned from active-link geometry across navigation', async () => {
  let rootTop = -1112;
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: HTMLElement,
  ) {
    if (this.getAttribute('aria-label') === 'Component documentation') {
      return createRect({ height: 400, left: 24, top: rootTop, width: 224 });
    }

    if (this.textContent === 'Action') {
      return createRect({ height: 32, left: 24, top: rootTop + 30, width: 224 });
    }

    if (this.textContent === 'Base Action') {
      return createRect({ height: 32, left: 24, top: rootTop + 112, width: 224 });
    }

    return createRect({ height: 0, left: 0, top: 0, width: 0 });
  });

  const { container } = render(
    <MemoryRouter initialEntries={[actionDocument.pathname]}>
      <Sidebar navigation={navigation} />
    </MemoryRouter>,
  );

  const initialIndicator = container.querySelector<HTMLElement>('[data-sidebar-active-indicator]');
  expect(initialIndicator?.style.transform).toBe('translate3d(0px, 30px, 0)');

  rootTop = 132;
  fireEvent.click(screen.getByRole('link', { name: 'Base Action' }));

  await waitFor(() => {
    const indicator = container.querySelector<HTMLElement>('[data-sidebar-active-indicator]');
    expect(indicator).toBe(initialIndicator);
    expect(indicator?.style.transform).toBe('translate3d(0px, 112px, 0)');
  });

  expect(container.querySelectorAll('[data-sidebar-active-indicator]')).toHaveLength(1);
});
