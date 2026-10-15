// @vitest-environment node
import { unscopedSelectors } from './selectorPrefix';

describe('unscopedSelectors', () => {
  it('accepts selectors scoped by a lb or lobe- class', () => {
    expect(
      unscopedSelectors(`@layer lobe-ui {
        .lbx1 { color: red; }
        .lobe-markdown .katex-html, .lobe-a > .line::before { color: red; }
        :is(.lobe-markdown:not(:has(.ignore)), .lobe-markdown .markdown) h1 { color: red; }
        [data-x] > a, :root { color: red; }
        @keyframes fade { 0% { opacity: 0; } 100% { opacity: 1; } }
      }`),
    ).toEqual([]);
  });

  it('reports each comma-separated selector without a prefixed class', () => {
    expect(
      unscopedSelectors(
        '.katex-html, .lobe-a .b, :is(.c, .d) > span { margin: 0.5em; background: url(a.b.png); }',
      ),
    ).toEqual(['.katex-html', '.c .d']);
  });
});
