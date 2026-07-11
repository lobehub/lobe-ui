import { render, screen } from '@testing-library/react';

import TableOfContents from './TableOfContents';

it('renders links from compile-time heading identifiers without rewriting them', async () => {
  render(
    <>
      <div id="usage" />
      <main id="toc-content">
        <h2 id="usage">Usage</h2>
      </main>
      <TableOfContents contentId="toc-content" scopeKey="compiled" />
    </>,
  );

  const link = await screen.findByRole('link', { name: 'Usage' });
  const heading = document.querySelector<HTMLHeadingElement>('#toc-content h2');

  expect(link.getAttribute('href')).toBe('#usage');
  expect(heading?.id).toBe('usage');
});

it('skips a heading without a compile-time identifier and never mutates the DOM', async () => {
  render(
    <>
      <main id="toc-content">
        <h2>Missing identifier</h2>
        <h3 id="configured">Configured</h3>
      </main>
      <TableOfContents contentId="toc-content" scopeKey="missing" />
    </>,
  );

  await screen.findByRole('link', { name: 'Configured' });
  expect(screen.queryByRole('link', { name: 'Missing identifier' })).toBeNull();
  expect(document.querySelector<HTMLHeadingElement>('#toc-content h2')?.hasAttribute('id')).toBe(
    false,
  );
});
