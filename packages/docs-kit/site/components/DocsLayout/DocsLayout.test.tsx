import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router';
import siteConfig from 'virtual:lobedocs/site-config';

import type { DocumentManifestEntry } from '../../types/content';
import { DocsLayout } from './DocsLayout';
import { styles } from './style';

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

vi.mock('../../app/providers/SiteProviders', () => ({
  useSiteTheme: () => ({ appearance: 'light' }),
}));

const alphaDocument: DocumentManifestEntry = {
  category: 'General',
  description: 'Alpha component.',
  pathname: '/components/alpha',
  source: 'src/Alpha/index.mdx',
  title: 'Alpha',
};
const betaDocument: DocumentManifestEntry = {
  category: 'General',
  description: 'Beta component.',
  pathname: '/components/beta',
  source: 'src/Beta/index.mdx',
  title: 'Beta',
};

const TestPage = () => {
  const location = useLocation();

  return (
    <>
      <output data-testid="location">{location.pathname}</output>
      <DocsLayout
        document={alphaDocument}
        navigation={[
          {
            categories: [{ documents: [alphaDocument, betaDocument], title: 'General' }],
            title: 'Components',
          },
        ]}
      >
        <h2 id="usage">Usage</h2>
        <p>Content</p>
      </DocsLayout>
    </>
  );
};

it('navigates with the memory router while preserving link semantics', async () => {
  render(
    <MemoryRouter initialEntries={['/components/alpha']}>
      <TestPage />
    </MemoryRouter>,
  );

  const alphaLink = screen.getByRole('link', { name: 'Alpha' });
  const betaLink = screen.getByRole('link', { name: 'Beta' });

  expect(alphaLink.getAttribute('href')).toBe('/components/alpha');
  expect(alphaLink.getAttribute('aria-current')).toBe('page');
  expect(betaLink.getAttribute('href')).toBe('/components/beta');
  expect(betaLink.getAttribute('aria-current')).toBeNull();

  expect(fireEvent.click(betaLink)).toBe(false);
  await waitFor(() => expect(screen.getByTestId('location').textContent).toBe('/components/beta'));

  expect(alphaLink.getAttribute('aria-current')).toBeNull();
  expect(betaLink.getAttribute('aria-current')).toBe('page');

  expect(screen.getByRole('navigation', { name: 'Component documentation' })).toBeTruthy();
  const tableOfContents = await screen.findByRole('navigation', { name: 'On this page' });
  expect(tableOfContents.textContent).toContain('Usage');
  expect(screen.getByRole('link', { name: 'Usage' }).getAttribute('href')).toBe('#usage');
});

it('derives the Source and Edit links from the real docs.config.ts apiHeader', () => {
  const repositoryUrl = siteConfig.themeConfig?.apiHeader?.github;
  expect(repositoryUrl).toBeDefined();

  render(
    <MemoryRouter initialEntries={['/components/alpha']}>
      <TestPage />
    </MemoryRouter>,
  );

  expect(screen.getByRole('link', { name: /Source/ }).getAttribute('href')).toBe(
    `${repositoryUrl}/tree/master/src/Alpha`,
  );
  expect(screen.getByRole('link', { name: /Edit/ }).getAttribute('href')).toBe(
    `${repositoryUrl}/edit/master/src/Alpha/index.mdx`,
  );
});

it('marks one searchable article with title, description, category, and status metadata', () => {
  const stableDocument = { ...alphaDocument, status: 'stable' as const };
  const { container } = render(
    <MemoryRouter>
      <DocsLayout document={stableDocument} navigation={[]}>
        <p>Human prose</p>
      </DocsLayout>
    </MemoryRouter>,
  );

  expect(container.querySelectorAll('article[data-pagefind-body]')).toHaveLength(1);
  expect(container.querySelector('[data-pagefind-meta="title"]')?.textContent).toBe('Alpha');
  expect(container.querySelector('[data-pagefind-meta="description"]')?.textContent).toBe(
    'Alpha component.',
  );
  expect(container.querySelector('[data-pagefind-meta="category"]')?.textContent).toBe('General');
  expect(container.querySelector('[data-pagefind-meta="status"]')?.textContent).toBe('stable');
  expect(screen.getByText('Helpful?').closest('[data-pagefind-ignore="all"]')).toBeTruthy();
  expect(
    screen
      .getByRole('button', { name: 'Yes, this page was helpful' })
      .closest('[data-pagefind-ignore="all"]'),
  ).toBeTruthy();
  expect(screen.queryByText('Was this page helpful?')).toBeNull();
  expect(screen.queryByText('Community')).toBeNull();
});

it('syntax-highlights the component import statement', () => {
  const { container } = render(
    <MemoryRouter>
      <DocsLayout document={alphaDocument} navigation={[]}>
        <p>Content</p>
      </DocsLayout>
    </MemoryRouter>,
  );

  const importCode = container.querySelector(`.${styles.importBlock} code`);
  expect(importCode?.textContent).toBe("import { Alpha } from '@lobehub/ui';");
  expect(importCode?.querySelectorAll(`.${styles.syntaxKeyword}`)).toHaveLength(2);
  expect(importCode?.querySelector(`.${styles.syntaxEntity}`)?.textContent).toBe('Alpha');
  expect(importCode?.querySelector(`.${styles.syntaxString}`)?.textContent).toBe("'@lobehub/ui'");
});
