import { type Element, type ElementContent, type Root } from 'hast';
import { describe, expect, it } from 'vitest';

import { rehypeStreamAnimated, type StreamAnimatedRuntime } from './rehypeStreamAnimated';

const makeTree = (text: string): Root => ({
  children: [
    {
      children: [{ type: 'text', value: text }],
      properties: {},
      tagName: 'p',
      type: 'element',
    },
  ],
  type: 'root',
});

const childrenOf = (tree: Root): ElementContent[] => (tree.children[0] as Element).children;

const textOf = (child: ElementContent): string => {
  if (child.type === 'text') return child.value;
  if (child.type === 'element' && child.children[0]?.type === 'text') {
    return child.children[0].value;
  }
  return '';
};

const makeRuntime = (births: number[]): StreamAnimatedRuntime => ({ births, styles: [] });

describe('rehypeStreamAnimated', () => {
  it('char granularity wraps every char in a span', () => {
    const tree = makeTree('ab c');
    rehypeStreamAnimated({ runtime: makeRuntime([0, 0, 0, 0]) })(tree);

    const children = childrenOf(tree);
    expect(children).toHaveLength(4);
    expect(children.every((child) => child.type === 'element' && child.tagName === 'span')).toBe(
      true,
    );
    expect(children.map((child) => textOf(child)).join('')).toBe('ab c');
  });

  it('word granularity wraps words and keeps whitespace as text', () => {
    const tree = makeTree('hello world');
    rehypeStreamAnimated({ granularity: 'word', runtime: makeRuntime([]) })(tree);

    const children = childrenOf(tree);
    const spans = children.filter((child) => child.type === 'element');
    const texts = children.filter((child) => child.type === 'text');

    expect(spans).toHaveLength(2);
    expect(texts).toHaveLength(1);
    expect(children.map((child) => textOf(child)).join('')).toBe('hello world');
  });

  it('word granularity splits unspaced CJK runs', () => {
    const text = '今天天气真好我们出去玩吧';
    const tree = makeTree(text);
    rehypeStreamAnimated({ granularity: 'word', runtime: makeRuntime([]) })(tree);

    const children = childrenOf(tree);
    expect(children.length).toBeGreaterThan(1);
    expect(children.map((child) => textOf(child)).join('')).toBe(text);
  });

  it('marks chars past the fade window as revealed without style', () => {
    const tree = makeTree('ab');
    rehypeStreamAnimated({ fadeDuration: 100, runtime: makeRuntime([0, 0]) })(tree);

    for (const child of childrenOf(tree)) {
      if (child.type !== 'element') continue;
      expect(child.properties?.className).toContain('stream-char-revealed');
      expect(child.properties?.style).toBeUndefined();
    }
  });

  it('freezes resolved styles in the runtime cache across runs', () => {
    const runtime = makeRuntime([performance.now() + 10_000, performance.now() + 10_000]);
    const treeA = makeTree('ab');
    rehypeStreamAnimated({ fadeDuration: 100_000, runtime })(treeA);

    const cached = [...runtime.styles];
    expect(cached.every((style) => typeof style === 'string')).toBe(true);

    const treeB = makeTree('ab');
    rehypeStreamAnimated({ fadeDuration: 100_000, runtime })(treeB);

    expect(runtime.styles).toEqual(cached);
    const styleOf = (tree: Root, index: number) =>
      (childrenOf(tree)[index] as Element).properties?.style;
    expect(styleOf(treeB, 0)).toBe(styleOf(treeA, 0));
    expect(styleOf(treeB, 1)).toBe(styleOf(treeA, 1));
  });

  it('keeps the legacy births/nowMs options working', () => {
    const tree = makeTree('ab');
    rehypeStreamAnimated({ births: [100, 200], fadeDuration: 150, nowMs: 120 })(tree);

    const [first, second] = childrenOf(tree) as Element[];
    expect(first.properties?.style).toBe('animation-delay:-20ms');
    expect(second.properties?.style).toBe('animation-delay:80ms');
  });
});
