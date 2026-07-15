import { cleanup, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, expect, it } from 'vitest';

import { Footer } from './Footer';

afterEach(cleanup);

const renderFooter = () =>
  render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>,
  );

it('renders the copyright line with the current year', () => {
  renderFooter();

  expect(screen.getByText(`Copyright © 2022–${new Date().getFullYear()}`)).toBeDefined();
  expect(screen.getByRole('link', { name: 'LobeHub' }).getAttribute('href')).toBe(
    'https://lobehub.com',
  );
});

it('opens GitHub and NPM links externally', () => {
  renderFooter();
  const nav = within(screen.getByRole('navigation', { name: 'Footer' }));

  for (const [name, href] of [
    ['GitHub', 'https://github.com/lobehub/lobe-ui'],
    ['NPM', 'https://www.npmjs.com/package/@lobehub/ui'],
  ] as const) {
    const link = nav.getByRole('link', { name });
    expect(link.getAttribute('href')).toBe(href);
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toContain('noreferrer');
  }
});

it('links to the changelog route internally', () => {
  renderFooter();
  const nav = within(screen.getByRole('navigation', { name: 'Footer' }));
  const changelog = nav.getByRole('link', { name: 'Changelog' });

  expect(changelog.getAttribute('href')).toBe('/changelog');
  expect(changelog.getAttribute('target')).toBeNull();
});
