import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
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

afterEach(cleanup);

it('changes theme preference through accessible named controls', () => {
  const onPreferenceChange = vi.fn();
  render(
    <MemoryRouter>
      <Header navigation={[]} preference="system" onPreferenceChange={onPreferenceChange} />
    </MemoryRouter>,
  );

  fireEvent.click(screen.getByRole('button', { name: 'Use dark theme' }));

  expect(onPreferenceChange).toHaveBeenCalledWith('dark');
  expect(
    screen.getByRole('button', { name: 'Use system theme' }).getAttribute('aria-pressed'),
  ).toBe('true');
});

it('opens and closes the named mobile navigation sheet and restores trigger focus', async () => {
  render(
    <MemoryRouter initialEntries={['/components/alpha']}>
      <Header
        navigation={[{ documents: [alphaDocument], title: 'General' }]}
        preference="light"
        onPreferenceChange={vi.fn()}
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
