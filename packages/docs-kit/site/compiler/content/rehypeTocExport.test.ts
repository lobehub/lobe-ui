// @vitest-environment node

import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';

import { rehypeHeadingIds } from './rehypeHeadingIds';
import { rehypeTocExport } from './rehypeTocExport';

const compileToc = async (source: string) => {
  const module = await evaluate(source, {
    ...runtime,
    rehypePlugins: [rehypeHeadingIds, rehypeTocExport],
  });
  return module.toc;
};

it('exports h2 and h3 headings in document order with their compiled identifiers', async () => {
  const toc = await compileToc(
    ['# Title', '## Usage', '### With `icon`', '#### Deep', '## Usage'].join('\n\n'),
  );

  expect(toc).toEqual([
    { id: 'usage', level: 2, title: 'Usage' },
    { id: 'with-icon', level: 3, title: 'With icon' },
    { id: 'usage-2', level: 2, title: 'Usage' },
  ]);
});

it('exports an empty outline for a page without sections', async () => {
  expect(await compileToc('Just prose.')).toEqual([]);
});
