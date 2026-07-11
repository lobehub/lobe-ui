import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';

import DocsRouteLayout, { ErrorBoundary } from './docs-layout';

const layoutMocks = vi.hoisted(() => ({ setPreference: vi.fn() }));

vi.mock('../content/registry', () => ({
  contentManifest: { navigation: [{ id: 'components', label: 'Components' }] },
}));

vi.mock('../providers/SiteProviders', () => ({
  useSiteTheme: () => ({ preference: 'system', setPreference: layoutMocks.setPreference }),
}));

vi.mock('../../components/Header/Header', () => ({
  default: ({
    navigation,
    onPreferenceChange,
    preference,
  }: {
    navigation: { label: string }[];
    onPreferenceChange: (value: string) => void;
    preference: string;
  }) => (
    <header data-preference={preference}>
      {navigation[0]?.label}
      <button onClick={() => onPreferenceChange('dark')}>Dark</button>
    </header>
  ),
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
  expect(screen.getByRole('banner').dataset.preference).toBe('system');
  expect(screen.getByText('Components')).toBeTruthy();
  expect(screen.getByText('Document content')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Dark' }));
  expect(layoutMocks.setPreference).toHaveBeenCalledWith('dark');
});

it('retains a documentation-specific route error boundary', () => {
  render(<ErrorBoundary />);

  expect(screen.getByRole('heading', { name: 'Documentation unavailable' })).toBeTruthy();
});
