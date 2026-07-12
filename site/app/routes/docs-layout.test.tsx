import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';

import type { NavigationSection } from '../../types/content';
import DocsRouteLayout, { ErrorBoundary } from './docs-layout';

const layoutMocks = vi.hoisted(() => ({ searchModuleLoads: 0 }));

vi.mock('../content/registry', () => ({
  contentManifest: {
    navigation: [
      {
        categories: [{ documents: [], title: 'General' }],
        title: 'Components',
      },
    ] satisfies NavigationSection[],
  },
}));

vi.mock('../../components/Header/Header', () => ({
  default: ({
    navigation,
    onSearchOpen,
  }: {
    navigation: NavigationSection[];
    onSearchOpen: (trigger: HTMLButtonElement) => void;
  }) => (
    <header>
      {navigation[0]?.title}
      <button onClick={(event) => onSearchOpen(event.currentTarget)}>Search</button>
    </header>
  ),
}));

vi.mock('../../components/Search/SearchDialog', () => {
  layoutMocks.searchModuleLoads += 1;
  return {
    default: ({ open }: { open: boolean }) =>
      open ? (
        <div aria-label="Search documentation" role="dialog">
          <input autoFocus aria-label="Search input" />
        </div>
      ) : null,
  };
});

vi.mock('../../components/Analytics/Plausible', () => ({
  default: () => <script data-testid="plausible" />,
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

it('owns documentation chrome while rendering the nested document route', () => {
  render(
    <MemoryRouter>
      <Routes>
        <Route element={<DocsRouteLayout />}>
          <Route index element={<main id="docs-content">Document content</main>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

  expect(screen.getByRole('link', { name: 'Skip to documentation' }).getAttribute('href')).toBe(
    '#docs-content',
  );
  expect(screen.getByText('Components')).toBeTruthy();
  expect(screen.getByText('Document content')).toBeTruthy();
  expect(layoutMocks.searchModuleLoads).toBe(0);
  expect(screen.getByTestId('plausible')).toBeTruthy();
});

it('opens documentation search from a header intent', async () => {
  render(
    <MemoryRouter>
      <Routes>
        <Route element={<DocsRouteLayout />}>
          <Route index element={<main id="docs-content">Document content</main>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

  expect(screen.queryByRole('dialog', { name: 'Search documentation' })).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Search' }));
  expect(await screen.findByRole('dialog', { name: 'Search documentation' })).toBeTruthy();
});

it('cancels a pending lazy search with Escape and restores the invoking control', () => {
  render(
    <MemoryRouter>
      <Routes>
        <Route element={<DocsRouteLayout />}>
          <Route index element={<main id="docs-content">Document content</main>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

  const trigger = screen.getByRole('button', { name: 'Search' });
  fireEvent.click(trigger);
  fireEvent.keyDown(document, { key: 'Escape' });

  expect(screen.queryByRole('dialog', { name: 'Search documentation' })).toBeNull();
  expect(screen.queryByRole('status', { name: 'Loading search…' })).toBeNull();
  expect(document.activeElement).toBe(trigger);
});

it.each([
  ['Command', { metaKey: true }],
  ['Control', { ctrlKey: true }],
])('opens documentation search from %s + K', async (_label, modifier) => {
  render(
    <MemoryRouter>
      <Routes>
        <Route element={<DocsRouteLayout />}>
          <Route index element={<main id="docs-content">Document content</main>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

  fireEvent.keyDown(document, { key: 'k', ...modifier });
  expect(await screen.findByRole('dialog', { name: 'Search documentation' })).toBeTruthy();
});

it('preserves the original trigger when the search shortcut repeats inside the dialog', async () => {
  render(
    <MemoryRouter>
      <Routes>
        <Route element={<DocsRouteLayout />}>
          <Route index element={<main id="docs-content">Document content</main>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

  const trigger = screen.getByRole('button', { name: 'Search' });
  trigger.focus();
  fireEvent.click(trigger);
  const input = await screen.findByRole('textbox', { name: 'Search input' });
  expect(document.activeElement).toBe(input);

  fireEvent.keyDown(input, { ctrlKey: true, key: 'k' });
  fireEvent.keyDown(document, { key: 'Escape' });

  expect(document.activeElement).toBe(trigger);
});

it('retains a documentation-specific route error boundary', () => {
  render(<ErrorBoundary />);

  expect(screen.getByRole('heading', { name: 'Documentation unavailable' })).toBeTruthy();
});
