import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter, useLocation } from 'react-router';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

import SiteProviders, { THEME_STORAGE_KEY } from '../../app/providers/SiteProviders';
import type { DocumentManifestEntry } from '../../types/content';
import Header from './Header';

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    disconnect() {}
    observe() {}
    unobserve() {}
  } as never;
}

const alphaDocument: DocumentManifestEntry = {
  category: 'General',
  description: 'Alpha component.',
  pathname: '/components/alpha',
  source: 'src/Alpha/index.mdx',
  title: 'Alpha',
};

const createMatchMedia =
  (matchesQuery?: string) =>
  (query: string): MediaQueryList =>
    ({
      addEventListener: vi.fn(),
      addListener: vi.fn(),
      matches: query === matchesQuery,
      media: query,
      removeEventListener: vi.fn(),
      removeListener: vi.fn(),
    }) as unknown as MediaQueryList;

const LocationDisplay = () => <output data-testid="location">{useLocation().pathname}</output>;

const renderHeader = (header: ReactElement, initialEntries?: string[]) =>
  render(
    <SiteProviders>
      <MemoryRouter initialEntries={initialEntries}>
        {header}
        <LocationDisplay />
      </MemoryRouter>
    </SiteProviders>,
  );

const openMenu = (trigger: HTMLElement) => {
  fireEvent.pointerDown(trigger);
  fireEvent.mouseDown(trigger);
  fireEvent.click(trigger);
};

beforeEach(() => {
  vi.stubGlobal('matchMedia', vi.fn(createMatchMedia()));
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  localStorage.clear();
  delete document.documentElement.dataset.theme;
});

it('selects theme preference through a dropdown menu with a system option', async () => {
  renderHeader(<Header navigation={[]} onSearchOpen={vi.fn()} />);

  openMenu(screen.getByRole('button', { name: 'Select theme' }));
  const menu = await screen.findByRole('menu');
  expect(within(menu).getByRole('menuitemcheckbox', { name: 'System' })).toBeTruthy();

  fireEvent.click(within(menu).getByRole('menuitemcheckbox', { name: 'Dark' }));

  await waitFor(() => expect(document.documentElement.dataset.theme).toBe('dark'));
  expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
});

it('marks the active section tab and lists overflow sections in the more menu', async () => {
  renderHeader(
    <Header
      navigation={[
        {
          categories: [{ documents: [alphaDocument], title: 'General' }],
          title: 'Components',
        },
        {
          categories: [
            {
              documents: [{ ...alphaDocument, pathname: '/components/color-a', title: 'ColorA' }],
              title: 'General',
            },
          ],
          title: 'Color',
        },
      ]}
      onSearchOpen={vi.fn()}
    />,
    [alphaDocument.pathname],
  );

  const nav = screen.getByRole('navigation', { name: 'Documentation sections' });
  const componentsTab = within(nav).getByRole('link', { name: 'Components' });
  expect(componentsTab.getAttribute('aria-current')).toBe('true');
  expect(componentsTab.getAttribute('href')).toBe(alphaDocument.pathname);

  openMenu(within(nav).getByRole('button', { name: 'More documentation sections' }));
  const menu = await screen.findByRole('menu');
  expect(within(menu).getByRole('menuitem', { name: 'Changelog' })).toBeTruthy();

  fireEvent.click(within(menu).getByRole('menuitem', { name: 'Color' }));

  await waitFor(() =>
    expect(screen.getByTestId('location').textContent).toBe('/components/color-a'),
  );
});

it('exposes enabled desktop and mobile search entry points with their invoking controls', () => {
  const onSearchOpen = vi.fn();
  renderHeader(<Header navigation={[]} onSearchOpen={onSearchOpen} />);

  const desktop = screen.getByRole('button', { name: 'Search documentation' });
  const mobile = screen.getByLabelText('Open search');
  expect((desktop as HTMLButtonElement).disabled).toBe(false);
  expect((mobile as HTMLButtonElement).disabled).toBe(false);
  expect(desktop.getAttribute('aria-keyshortcuts')).toBe('Meta+K Control+K');
  expect(mobile.getAttribute('aria-keyshortcuts')).toBe('Meta+K Control+K');
  fireEvent.click(desktop);
  fireEvent.click(mobile);

  expect(onSearchOpen).toHaveBeenNthCalledWith(1, desktop);
  expect(onSearchOpen).toHaveBeenNthCalledWith(2, mobile);
});

it('opens and closes the named mobile navigation sheet and restores trigger focus', async () => {
  renderHeader(
    <Header
      navigation={[
        {
          categories: [{ documents: [alphaDocument], title: 'General' }],
          title: 'Components',
        },
      ]}
      onSearchOpen={vi.fn()}
    />,
    ['/components/alpha'],
  );

  const trigger = screen.getByLabelText('Open documentation navigation');
  fireEvent.click(trigger);

  const dialog = screen.getByRole('dialog', { name: 'Documentation navigation' });
  expect(dialog).toBeTruthy();
  expect(dialog.closest('header')).toBeNull();
  fireEvent.keyDown(document, { key: 'Escape' });

  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  expect(document.activeElement).toBe(trigger);
});

it('closes the mobile sheet synchronously when reduced motion is requested', () => {
  vi.stubGlobal('matchMedia', vi.fn(createMatchMedia('(prefers-reduced-motion: reduce)')));
  renderHeader(<Header navigation={[]} onSearchOpen={vi.fn()} />);

  const trigger = screen.getByLabelText('Open documentation navigation');
  fireEvent.click(trigger);
  fireEvent.keyDown(document, { key: 'Escape' });

  expect(screen.queryByRole('dialog')).toBeNull();
  expect(document.activeElement).toBe(trigger);
});

it('preserves the active nested link and closes the mobile sheet after navigation', () => {
  vi.stubGlobal('matchMedia', vi.fn(createMatchMedia('(prefers-reduced-motion: reduce)')));
  renderHeader(
    <Header
      navigation={[
        {
          categories: [{ documents: [alphaDocument], title: 'General' }],
          title: 'Components',
        },
      ]}
      onSearchOpen={vi.fn()}
    />,
    [alphaDocument.pathname],
  );

  const trigger = screen.getByLabelText('Open documentation navigation');
  fireEvent.click(trigger);
  const dialog = screen.getByRole('dialog', { name: 'Documentation navigation' });
  const activeLink = within(dialog).getByRole('link', { name: 'Alpha' });
  expect(activeLink.getAttribute('aria-current')).toBe('page');

  fireEvent.click(activeLink);

  expect(screen.queryByRole('dialog', { name: 'Documentation navigation' })).toBeNull();
  expect(document.activeElement).toBe(trigger);
});
