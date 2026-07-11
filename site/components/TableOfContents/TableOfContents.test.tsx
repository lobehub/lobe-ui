import { render, screen } from '@testing-library/react';

import TableOfContents from './TableOfContents';

it('avoids IDs already owned by elements outside the candidate headings', async () => {
  render(
    <>
      <div id="usage" />
      <main id="toc-collision-content">
        <h2>Usage</h2>
      </main>
      <TableOfContents contentId="toc-collision-content" scopeKey="collision" />
    </>,
  );

  const link = await screen.findByRole('link', { name: 'Usage' });
  const heading = document.querySelector<HTMLHeadingElement>('#toc-collision-content h2');

  expect(link.getAttribute('href')).toBe('#usage-2');
  expect(heading?.id).toBe('usage-2');
  expect(document.querySelectorAll('#usage')).toHaveLength(1);
});
