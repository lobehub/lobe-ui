import { resolve } from 'node:path';

import mdx from '@mdx-js/rollup';
import rehypeRaw from 'rehype-raw';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { normalizePath, type Plugin } from 'vite';

import { remarkApi } from '../api/remarkApi';
import { rehypeHeadingIds } from './rehypeHeadingIds';

// Mirrors @mdx-js/mdx's internal `nodeTypes` (from `mdast-util-mdx`), which
// it always passes through untouched from mdast to hast. rehype-raw must be
// told to leave these alone too: `remark-mdx-frontmatter` emits an
// `mdxjsEsm` export node even for `format: 'md'` files (e.g. the
// CHANGELOG.md fallback), and hast-util-raw otherwise throws trying to
// reparse it as HTML.
const mdxPassThroughNodeTypes = [
  'mdxFlowExpression',
  'mdxJsxFlowElement',
  'mdxJsxTextElement',
  'mdxTextExpression',
  'mdxjsEsm',
];

export function createMdxPlugin(): Plugin {
  return mdx({
    include: /\.(md|mdx)$/,
    providerImportSource: normalizePath(resolve(import.meta.dirname, '../../app/mdx-components')),
    // rehype-raw expands the raw HTML nodes that `.md` format keeps around
    // (details/summary/kbd/div, entities); without it @mdx-js/mdx's
    // rehypeRemoveRaw silently drops that markup for `format: 'md'` files
    // such as the CHANGELOG.md fallback. It is a no-op for `.mdx` since
    // authored JSX never produces `raw` hast nodes.
    rehypePlugins: [[rehypeRaw, { passThrough: mdxPassThroughNodeTypes }], rehypeHeadingIds],
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm, remarkApi],
  });
}
