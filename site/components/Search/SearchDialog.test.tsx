import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { type RefObject, useRef, useState } from 'react';
import { MemoryRouter, useLocation } from 'react-router';

import type { SearchEngine } from '../../search/types';
import { deferred } from '../../tests/deferred';
import type { DocumentManifestEntry } from '../../types/content';
import SearchDialog from './SearchDialog';

const documents: DocumentManifestEntry[] = [
  {
    category: 'Actions',
    description: 'Primary action control.',
    pathname: '/components/button',
    source: 'src/Button/index.mdx',
    title: 'Button',
  },
];

const hits = [
  {
    excerpt: '<img src=x onerror=alert(1)> Safe text',
    id: 'button',
    pathname: '/components/button',
    section: 'Actions',
    title: 'Button',
  },
  {
    excerpt: 'Select one option.',
    id: 'segmented',
    pathname: '/components/segmented',
    title: 'Segmented',
  },
];

const createEngine = (): SearchEngine => ({
  init: vi.fn(async () => {}),
  preload: vi.fn(async () => {}),
  search: vi.fn(async (query) => (query ? hits : [])),
});

function Harness({
  engine,
  loadEngine = () => engine,
}: {
  engine: SearchEngine;
  loadEngine?: () => SearchEngine;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();

  return (
    <>
      <button ref={triggerRef} type="button" onClick={() => setOpen(true)}>
        Open search
      </button>
      <output data-testid="location">{location.pathname}</output>
      <SearchDialog
        documents={documents}
        loadEngine={loadEngine}
        open={open}
        triggerRef={triggerRef}
        onOpenChange={setOpen}
      />
    </>
  );
}

afterEach(() => cleanup());

it('does not load search until intent, then exposes a named dialog and searchbox', async () => {
  const engine = createEngine();
  const loadEngine = vi.fn(() => engine);
  render(
    <MemoryRouter>
      <Harness engine={engine} loadEngine={loadEngine} />
    </MemoryRouter>,
  );

  expect(loadEngine).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Open search' }));

  expect(screen.getByRole('dialog', { name: 'Search documentation' })).toBeTruthy();
  const searchbox = screen.getByRole('searchbox', { name: 'Search documentation' });
  await waitFor(() => expect(document.activeElement).toBe(searchbox));
  expect(loadEngine).toHaveBeenCalledTimes(1);
  expect(engine.init).toHaveBeenCalledTimes(1);
});

it('wraps arrow selection, activates with Enter, and renders excerpts only as text', async () => {
  const engine = createEngine();
  const { container } = render(
    <MemoryRouter>
      <Harness engine={engine} />
    </MemoryRouter>,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Open search' }));
  const searchbox = screen.getByRole('searchbox', { name: 'Search documentation' });
  fireEvent.change(searchbox, { target: { value: 'button' } });
  await screen.findByRole('option', { name: /Button/ });

  expect(container.querySelector('img')).toBeNull();
  expect(screen.getByText('<img src=x onerror=alert(1)> Safe text')).toBeTruthy();
  fireEvent.keyDown(searchbox, { key: 'ArrowUp' });
  expect(screen.getByRole('option', { name: /Segmented/ }).getAttribute('aria-selected')).toBe(
    'true',
  );
  fireEvent.keyDown(searchbox, { key: 'ArrowDown' });
  expect(screen.getByRole('option', { name: /Button/ }).getAttribute('aria-selected')).toBe('true');
  fireEvent.keyDown(searchbox, { key: 'Enter' });

  await waitFor(() =>
    expect(screen.getByTestId('location').textContent).toBe('/components/button'),
  );
  expect(screen.queryByRole('dialog')).toBeNull();
});

it('traps focus, closes with Escape, and restores the invoking trigger', async () => {
  const engine = createEngine();
  render(
    <MemoryRouter>
      <Harness engine={engine} />
    </MemoryRouter>,
  );
  const trigger = screen.getByRole('button', { name: 'Open search' });
  fireEvent.click(trigger);
  const dialog = screen.getByRole('dialog', { name: 'Search documentation' });
  const searchbox = screen.getByRole('searchbox', { name: 'Search documentation' });
  const close = screen.getByRole('button', { name: 'Close search' });

  close.focus();
  fireEvent.keyDown(dialog, { key: 'Tab' });
  expect(document.activeElement).toBe(searchbox);
  fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true });
  expect(document.activeElement).toBe(close);
  fireEvent.keyDown(dialog, { key: 'Escape' });

  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  expect(document.activeElement).toBe(trigger);
});

it('invalidates a pending result when the active engine changes', async () => {
  const pending = deferred<Awaited<ReturnType<SearchEngine['search']>>>();
  const oldEngine = {
    ...createEngine(),
    search: vi.fn(() => pending.promise),
  };
  const nextEngine = createEngine();
  const triggerRef = { current: null } as RefObject<HTMLButtonElement | null>;
  const onOpenChange = vi.fn();
  const { rerender } = render(
    <MemoryRouter>
      <button ref={triggerRef}>Trigger</button>
      <SearchDialog
        open
        documents={documents}
        loadEngine={() => oldEngine}
        triggerRef={triggerRef}
        onOpenChange={onOpenChange}
      />
    </MemoryRouter>,
  );
  fireEvent.change(screen.getByRole('searchbox', { name: 'Search documentation' }), {
    target: { value: 'old' },
  });
  await waitFor(() => expect(oldEngine.search).toHaveBeenCalledOnce());

  rerender(
    <MemoryRouter>
      <button ref={triggerRef}>Trigger</button>
      <SearchDialog
        open
        documents={documents}
        loadEngine={() => nextEngine}
        triggerRef={triggerRef}
        onOpenChange={onOpenChange}
      />
    </MemoryRouter>,
  );
  await act(async () => {
    pending.resolve([
      {
        excerpt: 'Stale result',
        id: 'stale',
        pathname: '/components/stale',
        title: 'Stale result',
      },
    ]);
    await pending.promise;
  });

  expect(screen.queryByRole('option', { name: /Stale result/ })).toBeNull();
});
