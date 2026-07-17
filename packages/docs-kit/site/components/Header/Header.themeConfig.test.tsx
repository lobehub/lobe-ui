import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

import { SiteProviders, useSiteTheme } from '../../app/providers/SiteProviders';
import { Header } from './Header';

vi.mock('virtual:lobedocs/site-config', () => ({
  default: {
    description: 'Test site.',
    favicons: {},
    navSections: {},
    siteUrl: 'https://example.com',
    themeConfig: {
      actions: [{ external: true, href: 'https://example.com/sponsor', label: 'Sponsor' }],
      navItems: [
        { href: '/guides/getting-started', label: 'Guides' },
        { external: true, href: 'https://example.com/blog', label: 'Blog' },
      ],
      prefersColor: 'dark',
    },
    title: 'Test Docs',
  },
}));

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

beforeEach(() => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(
      (query: string): MediaQueryList =>
        ({
          addEventListener: vi.fn(),
          addListener: vi.fn(),
          matches: false,
          media: query,
          removeEventListener: vi.fn(),
          removeListener: vi.fn(),
        }) as unknown as MediaQueryList,
    ),
  );
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

const openMenu = (trigger: HTMLElement) => {
  fireEvent.pointerDown(trigger);
  fireEvent.mouseDown(trigger);
  fireEvent.click(trigger);
};

const ThemeProbe = () => {
  const { appearance, preference } = useSiteTheme();

  return <output data-preference={preference}>{appearance}</output>;
};

it('exposes the configured forced theme during the initial render', () => {
  render(
    <SiteProviders>
      <ThemeProbe />
    </SiteProviders>,
  );

  const probe = screen.getByText('dark');
  expect(probe.getAttribute('data-preference')).toBe('dark');
});

it('keeps internal navItems visible and moves external ecosystem links into the more menu', async () => {
  const open = vi.spyOn(window, 'open').mockImplementation(() => null);

  render(
    <SiteProviders>
      <MemoryRouter>
        <Header navigation={[]} onSearchOpen={vi.fn()} />
      </MemoryRouter>
    </SiteProviders>,
  );

  const nav = screen.getByRole('navigation', { name: 'Documentation sections' });
  const guidesLink = within(nav).getByRole('link', { name: 'Guides' });
  expect(guidesLink.getAttribute('href')).toBe('/guides/getting-started');
  expect(guidesLink.getAttribute('target')).toBeNull();

  expect(within(nav).queryByRole('link', { name: 'Blog' })).toBeNull();

  openMenu(within(nav).getByRole('button', { name: 'More navigation links' }));
  const menu = await screen.findByRole('menu');
  const blogItem = within(menu).getByRole('menuitem', { name: 'Blog' });
  fireEvent.click(blogItem);
  expect(open).toHaveBeenCalledWith('https://example.com/blog', '_blank', 'noopener,noreferrer');
  expect(within(menu).getByRole('menuitem', { name: 'Changelog' })).toBeTruthy();

  const sponsorLink = screen.getByRole('link', { name: 'Sponsor' });
  expect(sponsorLink.getAttribute('href')).toBe('https://example.com/sponsor');
  expect(sponsorLink.getAttribute('target')).toBe('_blank');
  expect(sponsorLink.getAttribute('rel')).toBe('noreferrer');

  const navLinks = within(nav).getAllByRole('link');
  expect(navLinks.map((link) => link.textContent)).toEqual(['Home', 'Guides']);

  const homeLink = screen.getByRole('link', { name: 'Test Docs documentation home' });
  expect(homeLink.textContent).toContain('Test Docs');
});
