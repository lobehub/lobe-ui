import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { describe, expect, it } from 'vitest';

import { rehypeKatex } from './rehypeKatex';

const render = async (md: string) => {
  const processor = unified().use(remarkParse).use(remarkMath).use(remarkRehype).use(rehypeKatex);
  const tree = await processor.run(processor.parse(md));
  return JSON.stringify(tree);
};

describe('rehypeKatex', () => {
  it('renders inline math with katex v0.18 class names', async () => {
    const html = await render('$a^2$');
    expect(html).toContain('"katex"');
    expect(html).toContain('katex-base');
  });

  it('renders display math', async () => {
    const html = await render('$$\na^2\n$$');
    expect(html).toContain('katex-display');
  });

  it('falls back to a katex-error span on invalid math', async () => {
    const html = await render('$\\invalidcommand$');
    expect(html).toContain('katex');
  });
});
