import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router';
import siteConfig from 'virtual:lobedocs/site-config';
import { afterEach, expect, it, vi } from 'vitest';

import { SiteProviders, THEME_STORAGE_KEY } from '../../app/providers/SiteProviders';
import type { DocumentManifestEntry, NavigationSection } from '../../types/content';
import { DocsShell } from './DocsShell';

if (!Element.prototype.getAnimations) {
  Element.prototype.getAnimations = () => [];
}

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    disconnect() {}
    observe() {}
    unobserve() {}
  } as never;
}

// antd-style's ThemeObserver leaks a setTimeout past unmount; the shim must
// stay valid for the whole file so a late timer never sees a torn-down stub.
window.matchMedia = ((query: string) =>
  ({
    addEventListener: vi.fn(),
    addListener: vi.fn(),
    matches: false,
    media: query,
    removeEventListener: vi.fn(),
    removeListener: vi.fn(),
  }) as unknown as MediaQueryList) as typeof window.matchMedia;

const createDocument = (pathname: string, title: string): DocumentManifestEntry => ({
  category: 'General',
  description: `${title} component.`,
  pathname,
  source: `src/${title}/index.mdx`,
  title,
});

const alpha = createDocument('/components/alpha', 'Alpha');
const beta = createDocument('/components/beta', 'Beta');

const navigation: NavigationSection[] = [
  { categories: [{ documents: [alpha, beta], title: 'General' }], title: 'Components' },
];

const LocationDisplay = () => <output data-testid="location">{useLocation().pathname}</output>;

const renderShell = (initialEntries = [alpha.pathname], onSearchOpen = vi.fn()) =>
  render(
    <SiteProviders>
      <MemoryRouter initialEntries={initialEntries}>
        <DocsShell documents={[alpha, beta]} navigation={navigation} onSearchOpen={onSearchOpen}>
          <p>Document content</p>
        </DocsShell>
        <LocationDisplay />
      </MemoryRouter>
    </SiteProviders>,
  );

const openMenu = (trigger: HTMLElement) => {
  fireEvent.pointerDown(trigger);
  fireEvent.mouseDown(trigger);
  fireEvent.click(trigger);
};

afterEach(() => {
  cleanup();
  localStorage.clear();
  delete document.documentElement.dataset.theme;
  vi.restoreAllMocks();
});

it('renders the console chrome around the page with grouped documentation navigation', () => {
  renderShell();

  expect(screen.getByRole('main').textContent).toContain('Document content');
  expect(screen.getByRole('link', { name: 'Skip to documentation' })).toBeTruthy();
  expect(screen.getByRole('link', { name: `${siteConfig.title} documentation home` })).toBeTruthy();

  const nav = screen.getByRole('navigation', { name: 'Documentation' });
  expect(within(nav).queryByRole('button', { name: 'Documentation' })).toBeNull();
  expect(
    within(nav).getByRole('button', { name: 'Components' }).getAttribute('aria-expanded'),
  ).toBe('true');
  expect(within(nav).getByRole('button', { name: 'General' }).getAttribute('aria-expanded')).toBe(
    'true',
  );
  expect(within(nav).getByRole('link', { name: 'Home' }).getAttribute('href')).toBe('/');
  expect(within(nav).getByRole('link', { name: 'Changelog' }).getAttribute('href')).toBe(
    '/changelog',
  );

  const active = within(nav).getByRole('link', { name: 'Alpha' });
  expect(active.getAttribute('aria-current')).toBe('page');
  expect(within(nav).getByRole('link', { name: 'Beta' }).getAttribute('aria-current')).toBeNull();
});

it('links the breadcrumb to overview pages and follows router navigation', async () => {
  renderShell([beta.pathname]);

  const breadcrumb = screen.getByRole('navigation', { name: 'Breadcrumb' });
  expect(within(breadcrumb).getByRole('link', { name: 'Components' }).getAttribute('href')).toBe(
    '/sections/components',
  );
  expect(within(breadcrumb).getByRole('link', { name: 'General' }).getAttribute('href')).toBe(
    '/sections/components/general',
  );
  expect(within(breadcrumb).getByText('Beta').getAttribute('aria-current')).toBe('page');

  fireEvent.click(
    within(screen.getByRole('navigation', { name: 'Documentation' })).getByRole('link', {
      name: 'Alpha',
    }),
  );
  await waitFor(() => expect(screen.getByTestId('location').textContent).toBe(alpha.pathname));
});

it('resets the workspace scroll position on forward navigation', async () => {
  renderShell();

  const main = screen.getByRole('main');
  let scrollTop = 320;
  Object.defineProperty(main, 'scrollTop', {
    configurable: true,
    get: () => scrollTop,
    set: (value: number) => {
      scrollTop = value;
    },
  });

  fireEvent.click(
    within(screen.getByRole('navigation', { name: 'Documentation' })).getByRole('link', {
      name: 'Beta',
    }),
  );

  await waitFor(() => expect(screen.getByTestId('location').textContent).toBe(beta.pathname));
  expect(scrollTop).toBe(0);
});

it('opens search from the top bar with the invoking control', () => {
  const onSearchOpen = vi.fn();
  renderShell(undefined, onSearchOpen);

  const search = screen.getByRole('button', { name: 'Search documentation' });
  expect(search.getAttribute('aria-keyshortcuts')).toBe('Meta+K Control+K');
  fireEvent.click(search);

  expect(onSearchOpen).toHaveBeenCalledWith(search);
});

it('selects theme preference through a dropdown menu with a system option', async () => {
  renderShell();

  openMenu(screen.getByRole('button', { name: 'Select theme' }));
  const menu = await screen.findByRole('menu');
  expect(within(menu).getByRole('menuitemcheckbox', { name: 'System' })).toBeTruthy();

  fireEvent.click(within(menu).getByRole('menuitemcheckbox', { name: 'Dark' }));

  await waitFor(() => expect(document.documentElement.dataset.theme).toBe('dark'));
  expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
});

it('renders the GitHub icon link from themeConfig', () => {
  renderShell();

  const githubLink = siteConfig.themeConfig?.socialLinks?.find((link) => link.icon === 'github');
  expect(githubLink).toBeDefined();
  expect(screen.getByLabelText(`${siteConfig.title} on GitHub`).getAttribute('href')).toBe(
    githubLink?.href,
  );
});
