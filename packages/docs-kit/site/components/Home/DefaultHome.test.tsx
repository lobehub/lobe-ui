import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, expect, it, vi } from 'vitest';

import { DefaultHome } from './DefaultHome';

const siteConfigMock = vi.hoisted(() => ({
  current: {
    description: 'Test site description.',
    favicons: {},
    navSections: {},
    siteUrl: 'https://example.com',
    themeConfig: undefined as unknown,
    title: 'Test Docs',
  },
}));

vi.mock('virtual:lobedocs/site-config', () => ({
  default: siteConfigMock.current,
}));

afterEach(() => {
  cleanup();
  siteConfigMock.current.themeConfig = undefined;
});

const renderHome = (props?: Partial<Parameters<typeof DefaultHome>[0]>) =>
  render(
    <MemoryRouter>
      <DefaultHome
        description="Route description."
        getStartedPathname="/getting-started"
        {...props}
      />
    </MemoryRouter>,
  );

it('renders hero-only with defaults when home config is absent', () => {
  renderHome();

  expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Test Docs');
  expect(screen.getByText('Route description.')).toBeTruthy();

  const getStarted = screen.getByRole('link', { name: 'Get Started' });
  expect(getStarted.getAttribute('href')).toBe('/getting-started');

  expect(screen.queryByLabelText('Features')).toBeNull();
  expect(screen.queryByRole('heading', { name: /get started in seconds/i })).toBeNull();
});

it('renders accent, custom actions, features, and install cta from full config', () => {
  siteConfigMock.current.themeConfig = {
    home: {
      ctaFootnote: 'Open source · MIT license',
      ctaTitle: 'Ship it today',
      features: [
        { description: 'Ships in every locale.', icon: 'Languages', title: 'i18n ready' },
        { description: 'Mystery feature.', icon: 'NotARealIcon', title: 'Unknown icon' },
      ],
      hero: {
        accent: 'Kit',
        actions: [
          { external: true, href: 'https://github.com/example/repo', label: 'GitHub' },
          { href: '/docs', label: 'Docs' },
        ],
        title: 'Build Faster',
      },
      install: 'bun add @lobehub/example',
    },
  };

  renderHome();

  const heading = screen.getByRole('heading', { level: 1 });
  expect(heading.textContent).toBe('Build Faster Kit');

  const githubLink = screen.getByRole('link', { name: 'GitHub' });
  expect(githubLink.getAttribute('href')).toBe('https://github.com/example/repo');
  expect(githubLink.getAttribute('target')).toBe('_blank');
  expect(githubLink.getAttribute('rel')).toBe('noreferrer');

  const docsLink = screen.getByRole('link', { name: 'Docs' });
  expect(docsLink.getAttribute('href')).toBe('/docs');
  expect(docsLink.getAttribute('target')).toBeNull();

  const featuresSection = screen.getByLabelText('Features', { selector: 'section' });
  expect(featuresSection).toBeTruthy();

  const knownFeature = screen.getByText('i18n ready').closest('div');
  expect(knownFeature?.querySelector('svg')).toBeTruthy();

  const unknownFeature = screen.getByText('Unknown icon').closest('div');
  expect(unknownFeature?.querySelector('svg')).toBeNull();

  expect(screen.getByRole('heading', { name: 'Ship it today' })).toBeTruthy();
  expect(screen.getByText('bun add @lobehub/example')).toBeTruthy();
  expect(screen.getByText(/Open source · MIT license/)).toBeTruthy();

  const links = screen.getAllByRole('link', { name: /Get Started/ });
  expect(links.some((link) => link.getAttribute('href') === '/getting-started')).toBe(true);
});

it('omits the features section when features is an empty array', () => {
  siteConfigMock.current.themeConfig = {
    home: {
      features: [],
    },
  };

  renderHome();

  expect(screen.queryByLabelText('Features')).toBeNull();
});
