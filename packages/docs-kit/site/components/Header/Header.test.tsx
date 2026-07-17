import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter, useLocation } from 'react-router';
import siteConfig from 'virtual:lobedocs/site-config';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

import { SiteProviders, THEME_STORAGE_KEY } from '../../app/providers/SiteProviders';
import type { DocumentManifestEntry, NavigationSection } from '../../types/content';
import { Header } from './Header';

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

const alphaDocument: DocumentManifestEntry = {
  category: 'General',
  description: 'Alpha component.',
  pathname: '/components/alpha',
  source: 'src/Alpha/index.mdx',
  title: 'Alpha',
};

const createSection = (title: string, pathname: string): NavigationSection => ({
  categories: [
    {
      documents: [{ ...alphaDocument, pathname, title: `${title} entry` }],
      title: 'General',
    },
  ],
  title,
});

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

// antd-style's ThemeObserver leaks a setTimeout past unmount; the shim must
// stay valid for the whole file so a late timer never sees a torn-down stub.
let matchMediaImpl = createMatchMedia();
window.matchMedia = ((query: string) => matchMediaImpl(query)) as typeof window.matchMedia;

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
  matchMediaImpl = createMatchMedia();
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  delete document.documentElement.dataset.theme;
  vi.restoreAllMocks();
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

it('keeps the header transparent at the top of every page and solidifies after scroll', () => {
  Object.defineProperty(window, 'scrollY', { configurable: true, value: 0, writable: true });
  renderHeader(<Header navigation={[]} onSearchOpen={vi.fn()} />, ['/components/alpha']);

  const header = document.querySelector('header');
  expect(header?.hasAttribute('data-transparent')).toBe(true);

  Object.defineProperty(window, 'scrollY', { configurable: true, value: 24, writable: true });
  fireEvent.scroll(window);

  expect(header?.hasAttribute('data-transparent')).toBe(false);

  Object.defineProperty(window, 'scrollY', { configurable: true, value: 0, writable: true });
  fireEvent.scroll(window);

  expect(header?.hasAttribute('data-transparent')).toBe(true);
});

it('marks the active section tab and lists overflow sections in the more menu', async () => {
  renderHeader(
    <Header
      navigation={[
        createSection('Components', alphaDocument.pathname),
        createSection('Base UI', '/components/base-ui/alpha'),
        createSection('Chat', '/components/chat/alpha'),
        createSection('Icons', '/components/icons/alpha'),
        createSection('Brand', '/components/brand/alpha'),
        createSection('Color', '/components/color-a'),
      ]}
      onSearchOpen={vi.fn()}
    />,
    [alphaDocument.pathname],
  );

  const nav = screen.getByRole('navigation', { name: 'Documentation sections' });
  const componentsTab = within(nav).getByRole('link', { name: 'Components' });
  expect(componentsTab.getAttribute('aria-current')).toBe('true');
  expect(componentsTab.getAttribute('href')).toBe(alphaDocument.pathname);

  openMenu(within(nav).getByRole('button', { name: 'More navigation links' }));
  const menu = await screen.findByRole('menu');
  expect(within(menu).getByRole('menuitem', { name: 'Changelog' })).toBeTruthy();

  fireEvent.click(within(menu).getByRole('menuitem', { name: 'Color' }));

  await waitFor(() =>
    expect(screen.getByTestId('location').textContent).toBe('/components/color-a'),
  );
});

it('keeps one indicator positioned relative to the navigation across route and viewport offsets', async () => {
  let navLeft = 80;
  let navTop = -1400;
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: HTMLElement,
  ) {
    if (this.getAttribute('aria-label') === 'Documentation sections') {
      return createRect({ height: 55, left: navLeft, top: navTop, width: 480 });
    }

    if (this.getAttribute('href') === '/') {
      return createRect({ height: 55, left: navLeft + 20, top: navTop, width: 64 });
    }

    if (this.getAttribute('href') === alphaDocument.pathname) {
      return createRect({ height: 55, left: navLeft + 92, top: navTop, width: 112 });
    }

    return createRect({ height: 0, left: 0, top: 0, width: 0 });
  });

  const { container } = renderHeader(
    <Header
      navigation={[createSection('Components', alphaDocument.pathname)]}
      onSearchOpen={vi.fn()}
    />,
    ['/'],
  );

  const initialIndicator = container.querySelector<HTMLElement>('[data-header-nav-indicator]');
  expect(initialIndicator?.style.transform).toBe('translate3d(20px, 0, 0)');
  expect(initialIndicator?.style.width).toBe('64px');

  navLeft = 260;
  navTop = 0;
  fireEvent.click(screen.getByRole('link', { name: 'Components' }));

  await waitFor(() => {
    const indicator = container.querySelector<HTMLElement>('[data-header-nav-indicator]');
    expect(indicator).toBe(initialIndicator);
    expect(indicator?.style.transform).toBe('translate3d(92px, 0, 0)');
    expect(indicator?.style.width).toBe('112px');
  });

  expect(container.querySelectorAll('[data-header-nav-indicator]')).toHaveLength(1);
});

it('keeps consumer-specific documentation sections visible in the primary navigation', () => {
  renderHeader(
    <Header
      navigation={[
        createSection('React', '/components/react/editor'),
        createSection('Plugins', '/components/plugins/common'),
        createSection('Renderer', '/components/renderer/lexical-renderer'),
      ]}
      onSearchOpen={vi.fn()}
    />,
  );

  const nav = screen.getByRole('navigation', { name: 'Documentation sections' });
  expect(
    within(nav)
      .getAllByRole('link')
      .map((link) => link.textContent),
  ).toEqual(['Home', 'React', 'Plugins', 'Renderer']);
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
  matchMediaImpl = createMatchMedia('(prefers-reduced-motion: reduce)');
  renderHeader(<Header navigation={[]} onSearchOpen={vi.fn()} />);

  const trigger = screen.getByLabelText('Open documentation navigation');
  fireEvent.click(trigger);
  fireEvent.keyDown(document, { key: 'Escape' });

  expect(screen.queryByRole('dialog')).toBeNull();
  expect(document.activeElement).toBe(trigger);
});

it('preserves the active nested link and closes the mobile sheet after navigation', () => {
  matchMediaImpl = createMatchMedia('(prefers-reduced-motion: reduce)');
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

it('renders the GitHub icon link and theme switcher from themeConfig', () => {
  renderHeader(<Header navigation={[]} onSearchOpen={vi.fn()} />);

  expect(screen.getByRole('link', { name: `${siteConfig.title} documentation home` })).toBeTruthy();

  const githubLink = siteConfig.themeConfig?.socialLinks?.find((link) => link.icon === 'github');
  expect(githubLink).toBeDefined();

  const githubButton = screen.getByLabelText(`${siteConfig.title} on GitHub`);
  expect(githubButton.getAttribute('href')).toBe(githubLink?.href);

  const showThemeMenu = (siteConfig.themeConfig?.prefersColor ?? 'auto') === 'auto';
  const themeMenu = screen.queryByRole('button', { name: 'Select theme' });
  expect(themeMenu === null).toBe(!showThemeMenu);
});
