import { cleanup, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

import { SiteProviders, useSiteTheme } from '../../app/providers/SiteProviders';
import { DocsShell } from './DocsShell';

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

it('lists navItems in the overview group and renders actions in the top bar', () => {
  render(
    <SiteProviders>
      <MemoryRouter>
        <DocsShell documents={[]} navigation={[]} onSearchOpen={vi.fn()}>
          <p>Home</p>
        </DocsShell>
      </MemoryRouter>
    </SiteProviders>,
  );

  const nav = screen.getByRole('navigation', { name: 'Documentation' });
  expect(
    within(nav)
      .getAllByRole('link')
      .map((link) => link.textContent),
  ).toEqual(['Home', 'Guides', 'Blog', 'skills.md', 'llms.txt', 'Changelog']);
  expect(within(nav).getByRole('link', { name: 'skills.md' }).getAttribute('target')).toBe(
    '_blank',
  );

  const guides = within(nav).getByRole('link', { name: 'Guides' });
  expect(guides.getAttribute('href')).toBe('/guides/getting-started');
  expect(guides.getAttribute('target')).toBeNull();

  const blog = within(nav).getByRole('link', { name: 'Blog' });
  expect(blog.getAttribute('href')).toBe('https://example.com/blog');
  expect(blog.getAttribute('target')).toBe('_blank');
  expect(blog.getAttribute('rel')).toBe('noreferrer');

  const sponsor = screen.getByRole('link', { name: 'Sponsor' });
  expect(sponsor.getAttribute('href')).toBe('https://example.com/sponsor');
  expect(sponsor.getAttribute('target')).toBe('_blank');

  expect(screen.queryByRole('button', { name: 'Select theme' })).toBeNull();
  expect(screen.getByRole('link', { name: 'Test Docs documentation home' }).textContent).toContain(
    'Docs',
  );
});
