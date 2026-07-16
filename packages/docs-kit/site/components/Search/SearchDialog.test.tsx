import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { useRef, useState } from 'react';
import { MemoryRouter, useLocation } from 'react-router';

import type { SearchEngine, SearchHit } from '../../search/types';
import type { DocumentManifestEntry } from '../../types/content';
import { readRecents } from './recentStore';
import { SearchDialog } from './SearchDialog';

const documents: DocumentManifestEntry[] = [
  {
    category: 'Components',
    description: 'Primary action control.',
    pathname: '/components/button',
    source: 'src/Button/index.mdx',
    title: 'Button',
  },
  {
    category: 'Components',
    description: 'Grouped choices.',
    pathname: '/components/segmented',
    source: 'src/Segmented/index.mdx',
    title: 'Segmented',
  },
  {
    category: 'Guides',
    description: 'How to theme.',
    pathname: '/guides/theming',
    source: 'guides/theming.mdx',
    title: 'Theming',
  },
];

const hits: SearchHit[] = [
  {
    category: 'Components',
    excerpt: '<img src=x onerror=alert(1)> Safe text',
    id: 'button',
    pathname: '/components/button',
    subResults: [
      { pathname: '/components/button#usage', title: 'Usage' },
      { pathname: '/components/button#api', title: 'API' },
    ],
    title: 'Button',
  },
  {
    category: 'Guides',
    excerpt: 'Theme guide.',
    id: 'theming',
    pathname: '/guides/theming',
    title: 'Theming',
  },
  {
    category: 'Components',
    excerpt: 'Select one option.',
    id: 'segmented',
    pathname: '/components/segmented',
    title: 'Segmented',
  },
];

const createEngine = (result: SearchHit[] = hits): SearchEngine => ({
  init: vi.fn(async () => {}),
  preload: vi.fn(async () => {}),
  search: vi.fn(async (query) => (query ? result : [])),
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
      <output data-testid="hash">{location.hash}</output>
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

const renderDialog = (engine: SearchEngine, loadEngine?: () => SearchEngine) =>
  render(
    <MemoryRouter>
      <Harness engine={engine} loadEngine={loadEngine} />
    </MemoryRouter>,
  );

const openAndType = async (engine: SearchEngine, value: string) => {
  renderDialog(engine);
  fireEvent.click(screen.getByRole('button', { name: 'Open search' }));
  const searchbox = screen.getByRole('searchbox', { name: 'Search documentation' });
  fireEvent.change(searchbox, { target: { value } });
  await waitFor(() => expect(screen.getAllByRole('option').length).toBeGreaterThan(0));
  return searchbox;
};

afterEach(() => {
  cleanup();
  localStorage.clear();
});

it('does not load search until intent, then exposes a named dialog and searchbox', async () => {
  const engine = createEngine();
  const loadEngine = vi.fn(() => engine);
  renderDialog(engine, loadEngine);

  expect(loadEngine).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Open search' }));

  expect(screen.getByRole('dialog', { name: 'Search documentation' })).toBeTruthy();
  const searchbox = screen.getByRole('searchbox', { name: 'Search documentation' });
  await waitFor(() => expect(document.activeElement).toBe(searchbox));
  expect(loadEngine).toHaveBeenCalledTimes(1);
  expect(engine.init).toHaveBeenCalledTimes(1);
});

it('groups hits by category in best-hit order and highlights matches as text', async () => {
  const engine = createEngine();
  await openAndType(engine, 'button');

  const groups = screen.getAllByRole('group').map((node) => node.getAttribute('aria-label'));
  expect(groups).toEqual(['Components', 'Guides']);

  const options = screen.getAllByRole('option').map((node) => node.textContent);
  expect(options[0]).toContain('Button');
  expect(options[1]).toContain('Segmented');
  expect(options[2]).toContain('Theming');

  expect(document.querySelector('mark')?.textContent).toBe('Button');
  expect(document.querySelector('img')).toBeNull();
  expect(document.body.textContent).toContain('<img src=x onerror=alert(1)> Safe text');

  const listPane = screen.getByRole('listbox').parentElement as HTMLElement;
  const preview = Array.from(listPane.parentElement!.children).find(
    (child) => child !== listPane,
  ) as HTMLElement;
  const activeOption = screen
    .getAllByRole('option')
    .find((node) => node.getAttribute('aria-selected') === 'true') as HTMLElement;
  expect(preview.getAttribute('aria-labelledby')).toBe(activeOption.id);
});

it('wraps arrow navigation across groups and writes a recent on Enter', async () => {
  const engine = createEngine();
  const searchbox = await openAndType(engine, 'button');

  fireEvent.keyDown(searchbox, { key: 'ArrowUp' });
  expect(screen.getByRole('option', { name: /Theming/ }).getAttribute('aria-selected')).toBe(
    'true',
  );
  fireEvent.keyDown(searchbox, { key: 'ArrowDown' });
  expect(screen.getByRole('option', { name: /Button/ }).getAttribute('aria-selected')).toBe('true');

  fireEvent.keyDown(searchbox, { key: 'ArrowUp' });
  fireEvent.keyDown(searchbox, { key: 'Enter' });

  await waitFor(() => expect(screen.getByTestId('location').textContent).toBe('/guides/theming'));
  expect(readRecents()[0]).toMatchObject({ pathname: '/guides/theming', title: 'Theming' });
});

it('enters the anchor list with Arrow keys and navigates to a sub-result with hash', async () => {
  const engine = createEngine();
  const searchbox = await openAndType(engine, 'button');
  await act(async () => {});

  const preview = screen.getByText('On this page').closest('div') as HTMLElement;
  fireEvent.keyDown(searchbox, { key: 'ArrowRight' });
  await waitFor(() =>
    expect(within(preview).getByRole('button', { name: 'Usage' }).dataset.active).toBe('true'),
  );
  fireEvent.keyDown(searchbox, { key: 'ArrowDown' });
  await waitFor(() =>
    expect(within(preview).getByRole('button', { name: 'API' }).dataset.active).toBe('true'),
  );
  fireEvent.keyDown(searchbox, { key: 'ArrowLeft' });
  await waitFor(() =>
    expect(within(preview).getByRole('button', { name: 'API' }).dataset.active).toBe('false'),
  );

  fireEvent.keyDown(searchbox, { key: 'ArrowRight' });
  fireEvent.keyDown(searchbox, { key: 'Enter' });

  await waitFor(() => expect(screen.getByTestId('hash').textContent).toBe('#usage'));
  expect(screen.getByTestId('location').textContent).toBe('/components/button');
  expect(readRecents()[0]).toMatchObject({ pathname: '/components/button', title: 'Button' });
});

it('decodes HTML entities in the preview excerpt and still renders it as text', async () => {
  const engine = createEngine([
    {
      category: 'Components',
      excerpt: 'ReactElement&lt;unknown&gt; &amp; &lt;img src=x&gt;',
      id: 'button',
      pathname: '/components/button',
      title: 'Button',
    },
  ]);
  await openAndType(engine, 'button');

  expect(document.body.textContent).toContain('ReactElement<unknown> & <img src=x>');
  expect(document.querySelector('img')).toBeNull();
});

it('dedupes recents by page pathname when activating hits with different hashes', async () => {
  const searchbox1 = await openAndType(
    createEngine([
      {
        category: 'Components',
        excerpt: 'x',
        id: 'u',
        pathname: '/components/button#usage',
        title: 'Button',
      },
    ]),
    'button',
  );
  fireEvent.keyDown(searchbox1, { key: 'Enter' });
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  cleanup();

  const searchbox2 = await openAndType(
    createEngine([
      {
        category: 'Components',
        excerpt: 'y',
        id: 'a',
        pathname: '/components/button#api',
        title: 'Button',
      },
    ]),
    'button',
  );
  fireEvent.keyDown(searchbox2, { key: 'Enter' });
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());

  const recents = readRecents();
  expect(recents).toHaveLength(1);
  expect(recents[0].pathname).toBe('/components/button');
});

it('omits the anchors block when a hit has no sub-results (undefined or empty)', async () => {
  const engine = createEngine([
    { category: 'Components', excerpt: 'no anchors', id: 'a', pathname: '/a', title: 'Alpha' },
    {
      category: 'Components',
      excerpt: 'empty anchors',
      id: 'b',
      pathname: '/b',
      subResults: [],
      title: 'Beta',
    },
  ]);
  const searchbox = await openAndType(engine, 'a');

  expect(screen.queryByText('On this page')).toBeNull();
  fireEvent.keyDown(searchbox, { key: 'ArrowDown' });
  expect(screen.getByRole('option', { name: /Beta/ }).getAttribute('aria-selected')).toBe('true');
  expect(screen.queryByText('On this page')).toBeNull();
});

it('shows recents and Explore in the empty state and removes a recent with ✕', async () => {
  localStorage.setItem(
    'lobedocs:search-recents',
    JSON.stringify([{ category: 'Components', pathname: '/components/button', title: 'Button' }]),
  );
  const engine = createEngine();
  renderDialog(engine);
  fireEvent.click(screen.getByRole('button', { name: 'Open search' }));

  const groupLabels = () =>
    screen.getAllByRole('group').map((node) => node.getAttribute('aria-label'));
  expect(groupLabels()).toEqual(['Recent', 'Explore']);
  expect(screen.getByRole('option', { name: /Segmented/ })).toBeTruthy();

  fireEvent.click(screen.getByRole('button', { name: 'Remove Button from recents' }));
  await waitFor(() => expect(groupLabels()).toEqual(['Explore']));
  expect(readRecents()).toHaveLength(0);
});

it('falls back to Explore only when there are no recents', async () => {
  const engine = createEngine();
  renderDialog(engine);
  fireEvent.click(screen.getByRole('button', { name: 'Open search' }));

  const groups = screen.getAllByRole('group').map((node) => node.getAttribute('aria-label'));
  expect(groups).toEqual(['Explore']);
});

it('renders the no-results status inside the list pane, not the preview', async () => {
  const engine = createEngine([]);
  renderDialog(engine);
  fireEvent.click(screen.getByRole('button', { name: 'Open search' }));
  fireEvent.change(screen.getByRole('searchbox', { name: 'Search documentation' }), {
    target: { value: 'zzz' },
  });

  const status = await screen.findByText('No results found');
  const listPane = screen.getByRole('listbox').parentElement as HTMLElement;
  const body = listPane.parentElement as HTMLElement;
  const preview = Array.from(body.children).find((child) => child !== listPane) as HTMLElement;

  expect(listPane.contains(status)).toBe(true);
  expect(preview.contains(status)).toBe(false);
});

it('keeps Tab focus trapped when anchor buttons (tabindex=-1) are present', async () => {
  const engine = createEngine();
  const searchbox = await openAndType(engine, 'button');
  expect(screen.getAllByRole('button').some((node) => node.getAttribute('tabindex') === '-1')).toBe(
    true,
  );
  const dialog = screen.getByRole('dialog', { name: 'Search documentation' });

  searchbox.focus();
  fireEvent.keyDown(dialog, { key: 'Tab' });
  expect(document.activeElement).toBe(searchbox);
  fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true });
  expect(document.activeElement).toBe(searchbox);
});

it('keeps Tab focus trapped when recent remove buttons (tabindex=-1) are present', async () => {
  localStorage.setItem(
    'lobedocs:search-recents',
    JSON.stringify([{ category: 'Components', pathname: '/components/button', title: 'Button' }]),
  );
  const engine = createEngine();
  renderDialog(engine);
  fireEvent.click(screen.getByRole('button', { name: 'Open search' }));
  const searchbox = screen.getByRole('searchbox', { name: 'Search documentation' });
  expect(
    screen.getByRole('button', { name: 'Remove Button from recents' }).getAttribute('tabindex'),
  ).toBe('-1');
  const dialog = screen.getByRole('dialog', { name: 'Search documentation' });

  searchbox.focus();
  fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true });
  expect(document.activeElement).toBe(searchbox);
  fireEvent.keyDown(dialog, { key: 'Tab' });
  expect(document.activeElement).toBe(searchbox);
});

it('traps focus on the input, closes with Escape, and restores the trigger', async () => {
  const engine = createEngine();
  renderDialog(engine);
  const trigger = screen.getByRole('button', { name: 'Open search' });
  fireEvent.click(trigger);
  const dialog = screen.getByRole('dialog', { name: 'Search documentation' });
  const searchbox = screen.getByRole('searchbox', { name: 'Search documentation' });

  searchbox.focus();
  fireEvent.keyDown(dialog, { key: 'Tab' });
  expect(document.activeElement).toBe(searchbox);
  fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true });
  expect(document.activeElement).toBe(searchbox);
  fireEvent.keyDown(dialog, { key: 'Escape' });

  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  expect(document.activeElement).toBe(trigger);
});
