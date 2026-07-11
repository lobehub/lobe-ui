import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, expect, it, vi } from 'vitest';

import type { DocumentManifestEntry } from '../../types/content';
import Header from './Header';

const alphaDocument: DocumentManifestEntry = {
  category: 'General',
  description: 'Alpha component.',
  pathname: '/components/alpha',
  source: 'src/Alpha/index.mdx',
  title: 'Alpha',
};

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it('changes theme preference through accessible named controls', () => {
  const onPreferenceChange = vi.fn();
  render(
    <MemoryRouter>
      <Header
        navigation={[]}
        preference="system"
        onPreferenceChange={onPreferenceChange}
        onSearchOpen={vi.fn()}
      />
    </MemoryRouter>,
  );

  fireEvent.click(screen.getByRole('button', { name: 'Use dark theme' }));

  expect(onPreferenceChange).toHaveBeenCalledWith('dark');
  expect(
    screen.getByRole('button', { name: 'Use system theme' }).getAttribute('aria-pressed'),
  ).toBe('true');
});

it('exposes enabled desktop and mobile search entry points with their invoking controls', () => {
  const onSearchOpen = vi.fn();
  render(
    <MemoryRouter>
      <Header
        navigation={[]}
        preference="system"
        onPreferenceChange={vi.fn()}
        onSearchOpen={onSearchOpen}
      />
    </MemoryRouter>,
  );

  const desktop = screen.getByRole('button', { name: 'Search documentation' });
  const mobile = screen.getByRole('button', { name: 'Open search' });
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
  render(
    <MemoryRouter initialEntries={['/components/alpha']}>
      <Header
        preference="light"
        navigation={[
          {
            categories: [{ documents: [alphaDocument], title: 'General' }],
            title: 'Components',
          },
        ]}
        onPreferenceChange={vi.fn()}
        onSearchOpen={vi.fn()}
      />
    </MemoryRouter>,
  );

  const trigger = screen.getByRole('button', { name: 'Open documentation navigation' });
  fireEvent.click(trigger);

  const dialog = screen.getByRole('dialog', { name: 'Documentation navigation' });
  expect(dialog).toBeTruthy();
  expect(dialog.closest('header')).toBeNull();
  fireEvent.keyDown(document, { key: 'Escape' });

  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  expect(document.activeElement).toBe(trigger);
});

it('closes the mobile sheet synchronously when reduced motion is requested', () => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      addEventListener: vi.fn(),
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      removeEventListener: vi.fn(),
    })),
  );
  render(
    <MemoryRouter>
      <Header
        navigation={[]}
        preference="system"
        onPreferenceChange={vi.fn()}
        onSearchOpen={vi.fn()}
      />
    </MemoryRouter>,
  );

  const trigger = screen.getByRole('button', { name: 'Open documentation navigation' });
  fireEvent.click(trigger);
  fireEvent.keyDown(document, { key: 'Escape' });

  expect(screen.queryByRole('dialog')).toBeNull();
  expect(document.activeElement).toBe(trigger);
});

it('preserves the active nested link and closes the mobile sheet after navigation', () => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      addEventListener: vi.fn(),
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      removeEventListener: vi.fn(),
    })),
  );
  render(
    <MemoryRouter initialEntries={[alphaDocument.pathname]}>
      <Header
        preference="system"
        navigation={[
          {
            categories: [{ documents: [alphaDocument], title: 'General' }],
            title: 'Components',
          },
        ]}
        onPreferenceChange={vi.fn()}
        onSearchOpen={vi.fn()}
      />
    </MemoryRouter>,
  );

  const trigger = screen.getByRole('button', { name: 'Open documentation navigation' });
  fireEvent.click(trigger);
  const dialog = screen.getByRole('dialog', { name: 'Documentation navigation' });
  const activeLink = within(dialog).getByRole('link', { name: 'Alpha' });
  expect(activeLink.getAttribute('aria-current')).toBe('page');

  fireEvent.click(activeLink);

  expect(screen.queryByRole('dialog', { name: 'Documentation navigation' })).toBeNull();
  expect(document.activeElement).toBe(trigger);
});
