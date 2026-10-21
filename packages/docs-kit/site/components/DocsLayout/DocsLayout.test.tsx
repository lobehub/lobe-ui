import { ConfigProvider } from '@lobehub/ui';
import * as stylex from '@stylexjs/stylex';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { motion } from 'motion/react';
import type { ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, useLocation } from 'react-router';
import siteConfig from 'virtual:lobedocs/site-config';

import { styles as modalStyles } from '@/Modal/style';

import type { DocumentManifestEntry } from '../../types/content';
import { DocsLayout } from './DocsLayout';

if (!Element.prototype.getAnimations) {
  Element.prototype.getAnimations = () => [];
}

const renderLayout = (ui: ReactElement) =>
  render(<ConfigProvider motion={motion}>{ui}</ConfigProvider>);

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
  const { container } = renderLayout(
    <MemoryRouter initialEntries={['/components/alpha']}>
      <TestPage />
    </MemoryRouter>,
  );

  const pagination = screen.getByRole('navigation', { name: 'Adjacent documents' });
  const nextLink = within(pagination).getByRole('link', { name: /Beta/ });

  expect(nextLink.getAttribute('href')).toBe('/components/beta');
  expect(nextLink.getAttribute('rel')).toBe('next');
  expect(within(pagination).queryByRole('link', { name: /Previous/ })).toBeNull();

  expect(fireEvent.click(nextLink)).toBe(false);
  await waitFor(() => expect(screen.getByTestId('location').textContent).toBe('/components/beta'));

  expect(screen.queryByRole('main')).toBeNull();
  await waitFor(() => expect(container.querySelector('[data-toc-outline]')).not.toBeNull());
  const tableOfContents = container.querySelector<HTMLElement>('[data-toc-outline]')!;
  expect(tableOfContents.textContent).toContain('Usage');
  expect(
    within(tableOfContents).getByRole('link', { hidden: true, name: 'Usage' }).getAttribute('href'),
  ).toBe('#usage');
  expect(
    tableOfContents.closest('[data-docs-grid]')?.contains(container.querySelector('article')),
  ).toBe(true);
});

it('derives the Source and Edit links from the real docs.config.ts apiHeader', () => {
  const repositoryUrl = siteConfig.themeConfig?.apiHeader?.github;
  expect(repositoryUrl).toBeDefined();

  renderLayout(
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
  const { container } = renderLayout(
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

it('renders the component import with the lobe highlighter snippet', () => {
  const { container } = renderLayout(
    <MemoryRouter>
      <DocsLayout document={alphaDocument} navigation={[]}>
        <p>Content</p>
      </DocsLayout>
    </MemoryRouter>,
  );

  const importCode = container.querySelector('[data-code-type="highlighter"]');
  expect(importCode?.textContent).toContain("import { Alpha } from '@lobehub/ui';");
  expect(importCode?.querySelector('button, [role="button"]')).toBeTruthy();
});

it('does not override component typography inside an embedded demo', () => {
  renderLayout(
    <MemoryRouter>
      <DocsLayout document={alphaDocument} navigation={[]}>
        <h2>Documentation heading</h2>
        <section data-demo-layout="default">
          <h2 {...stylex.props(modalStyles.title)}>Demo modal title</h2>
        </section>
      </DocsLayout>
    </MemoryRouter>,
  );

  const demoHeading = screen.getByRole('heading', { name: 'Demo modal title' });

  expect(getComputedStyle(demoHeading).fontSize).toBe('14px');
  expect(getComputedStyle(demoHeading).fontWeight).toBe('600');
  expect(getComputedStyle(demoHeading).marginBlockStart).toBe('0');
});

it('prerenders the table of contents from compiled headings', () => {
  const html = renderToString(
    <ConfigProvider motion={motion}>
      <MemoryRouter>
        <DocsLayout
          document={alphaDocument}
          headings={[{ id: 'usage', level: 2, title: 'Usage' }]}
          navigation={[]}
        >
          <h2 id="usage">Usage</h2>
        </DocsLayout>
      </MemoryRouter>
    </ConfigProvider>,
  );

  expect(html).toContain('data-docs-toc');
  expect(html).toContain('href="#usage"');
});
