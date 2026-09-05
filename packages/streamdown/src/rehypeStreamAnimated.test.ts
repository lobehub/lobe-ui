import { type Element, type Root } from 'hast';
import { describe, expect, it } from 'vitest';

import { rehypeStreamAnimated, type StreamAnimatedRuntime } from './rehypeStreamAnimated';
import { readStreamTailData, STREAM_TAIL_TAG, type StreamTailData } from './StreamTail';

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

const tailOf = (tree: Root): StreamTailData => {
  const child = (tree.children[0] as Element).children[0] as Element;
  expect(child.tagName).toBe(STREAM_TAIL_TAG);
  return readStreamTailData(child)!;
};

const flatten = (tail: StreamTailData) =>
  tail.text + tail.items.map((item) => (typeof item === 'string' ? item : item.value)).join('');

const spansOf = (tail: StreamTailData) => tail.items.filter((item) => typeof item !== 'string');

const makeRuntime = (births: number[]): StreamAnimatedRuntime => ({ births, skipped: [] });

describe('rehypeStreamAnimated', () => {
  it('char granularity keys every in-flight char by its index', () => {
    const now = performance.now();
    const tree = makeTree('ab c');
    rehypeStreamAnimated({ runtime: makeRuntime([now, now, now, now]) })(tree);

    const tail = tailOf(tree);
    expect(tail.text).toBe('');
    expect(spansOf(tail).map((span) => span.key)).toEqual([0, 1, 2, 3]);
    expect(flatten(tail)).toBe('ab c');
  });

  it('word granularity wraps words and keeps whitespace as text', () => {
    const now = performance.now();
    const tree = makeTree('hello world');
    rehypeStreamAnimated({
      granularity: 'word',
      runtime: makeRuntime(Array.from({ length: 11 }, () => now)),
    })(tree);

    const tail = tailOf(tree);
    expect(spansOf(tail).map((span) => span.value)).toEqual(['hello', 'world']);
    expect(tail.items[1]).toBe(' ');
    expect(flatten(tail)).toBe('hello world');
  });

  it('word granularity splits unspaced CJK runs', () => {
    const now = performance.now();
    const text = '今天天气真好我们出去玩吧';
    const tree = makeTree(text);
    rehypeStreamAnimated({
      granularity: 'word',
      runtime: makeRuntime(Array.from({ length: 12 }, () => now)),
    })(tree);

    const tail = tailOf(tree);
    expect(spansOf(tail).length).toBeGreaterThan(1);
    expect(flatten(tail)).toBe(text);
  });

  it('collapses chars whose fade completed into plain text, keeping later keys', () => {
    const now = performance.now();
    const runtime = makeRuntime([now, now, now + 20, now + 40]);
    const treeA = makeTree('abcd');
    rehypeStreamAnimated({ fadeDuration: 100, runtime })(treeA);
    expect(tailOf(treeA).text).toBe('');
    expect(spansOf(tailOf(treeA)).map((span) => span.key)).toEqual([0, 1, 2, 3]);

    runtime.births[0] = now - 500;
    runtime.births[1] = now - 400;
    const treeB = makeTree('abcd');
    rehypeStreamAnimated({ fadeDuration: 100, runtime })(treeB);

    const tail = tailOf(treeB);
    expect(tail.text).toBe('ab');
    expect(spansOf(tail).map((span) => span.key)).toEqual([2, 3]);
    expect(flatten(tail)).toBe('abcd');
  });

  it('assigns births lazily per rendered char from the runtime pacing', () => {
    const runtime: StreamAnimatedRuntime = {
      births: [],
      pacing: { capMs: 1000, pace: 10 },
      skipped: [],
    };
    const tree = makeTree('abc');
    rehypeStreamAnimated({ fadeDuration: 100, runtime })(tree);

    expect(runtime.births).toHaveLength(3);
    expect(runtime.births[1] - runtime.births[0]).toBeCloseTo(10, 5);
    expect(runtime.births[2] - runtime.births[1]).toBeCloseTo(10, 5);
    expect(spansOf(tailOf(tree)).every((span) => span.birth !== null)).toBe(true);
  });

  it('keeps chars that skipped the fade as revealed spans', () => {
    const tree = makeTree('ab');
    rehypeStreamAnimated({ fadeDuration: 100, runtime: makeRuntime([0, 0]) })(tree);

    const spans = spansOf(tailOf(tree));
    expect(spans).toHaveLength(2);
    expect(spans.every((span) => span.birth === null)).toBe(true);
  });

  it('remembers a skipped char across runs even after its birth moves', () => {
    const runtime = makeRuntime([0, 0]);
    rehypeStreamAnimated({ fadeDuration: 100, runtime })(makeTree('ab'));
    runtime.births[0] = performance.now();
    const tree = makeTree('ab');
    rehypeStreamAnimated({ fadeDuration: 100, runtime })(tree);
    expect(spansOf(tailOf(tree))[0].birth).toBeNull();
  });

  it('wraps table cell text and keeps the full run as a text child', () => {
    const now = performance.now();
    const cell: Element = {
      children: [{ type: 'text', value: 'cell' }],
      properties: {},
      tagName: 'td',
      type: 'element',
    };
    const tree: Root = {
      children: [
        {
          children: [{ children: [cell], properties: {}, tagName: 'tr', type: 'element' }],
          properties: {},
          tagName: 'table',
          type: 'element',
        },
      ],
      type: 'root',
    };
    rehypeStreamAnimated({ runtime: makeRuntime(Array.from({ length: 4 }, () => now)) })(tree);

    const tail = cell.children[0] as Element;
    expect(tail.tagName).toBe(STREAM_TAIL_TAG);
    expect(tail.children).toEqual([{ type: 'text', value: 'cell' }]);
    expect(spansOf(readStreamTailData(tail)!)).toHaveLength(4);
  });

  it('keeps the legacy births/nowMs options working', () => {
    const tree = makeTree('ab');
    rehypeStreamAnimated({ births: [100, 200], fadeDuration: 150, nowMs: 120 })(tree);

    const [first, second] = spansOf(tailOf(tree));
    expect(first.birth).toBe(100);
    expect(second.birth).toBe(200);
  });
});
