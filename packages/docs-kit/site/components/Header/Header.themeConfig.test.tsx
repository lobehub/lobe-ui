import { cleanup, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

import { SiteProviders } from '../../app/providers/SiteProviders';
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
  vi.unstubAllGlobals();
});

it('renders configured navItems as internal and external links, and configured actions', () => {
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

  const blogLink = within(nav).getByRole('link', { name: 'Blog' });
  expect(blogLink.getAttribute('href')).toBe('https://example.com/blog');
  expect(blogLink.getAttribute('target')).toBe('_blank');
  expect(blogLink.getAttribute('rel')).toBe('noreferrer');

  const sponsorLink = screen.getByRole('link', { name: 'Sponsor' });
  expect(sponsorLink.getAttribute('href')).toBe('https://example.com/sponsor');
  expect(sponsorLink.getAttribute('target')).toBe('_blank');
  expect(sponsorLink.getAttribute('rel')).toBe('noreferrer');

  const navLinks = within(nav).getAllByRole('link');
  expect(navLinks.map((link) => link.textContent)).toEqual(['Home', 'Guides', 'Blog']);
});
