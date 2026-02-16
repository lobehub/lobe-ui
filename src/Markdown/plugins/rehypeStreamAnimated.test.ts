import type { Root } from 'hast';
import { describe, expect, it } from 'vitest';

import { rehypeStreamAnimated } from './rehypeStreamAnimated';

const collectText = (node: any): string => {
  if (!node) return '';
  if (node.type === 'text') return node.value;
  if (!('children' in node)) return '';
  return node.children.map(collectText).join('');
};

describe('rehypeStreamAnimated', () => {
  it('should wrap non-whitespace text into animated span nodes', () => {
    const tree: Root = {
      children: [
        {
          children: [{ type: 'text', value: 'Hello world' }],
          properties: {},
          tagName: 'p',
          type: 'element',
        },
      ],
      type: 'root',
    };

    rehypeStreamAnimated()(tree);

    expect(tree.children[0]).toEqual({
      children: [
        {
          children: [{ type: 'text', value: 'Hello' }],
          properties: { className: 'animate-stream' },
          tagName: 'span',
          type: 'element',
        },
        { type: 'text', value: ' ' },
        {
          children: [{ type: 'text', value: 'world' }],
          properties: { className: 'animate-stream' },
          tagName: 'span',
          type: 'element',
        },
      ],
      properties: {},
      tagName: 'p',
      type: 'element',
    });
  });

  it('should keep whitespace-only text untouched', () => {
    const tree: Root = {
      children: [
        {
          children: [{ type: 'text', value: '   ' }],
          properties: {},
          tagName: 'p',
          type: 'element',
        },
      ],
      type: 'root',
    };

    rehypeStreamAnimated()(tree);

    expect(tree.children[0]).toEqual({
      children: [{ type: 'text', value: '   ' }],
      properties: {},
      tagName: 'p',
      type: 'element',
    });
  });

  it('should skip text inside code-like elements', () => {
    const tree: Root = {
      children: [
        {
          children: [
            { type: 'text', value: 'Hello ' },
            {
              children: [{ type: 'text', value: 'code content' }],
              properties: {},
              tagName: 'code',
              type: 'element',
            },
            { type: 'text', value: ' world' },
          ],
          properties: {},
          tagName: 'p',
          type: 'element',
        },
      ],
      type: 'root',
    };

    rehypeStreamAnimated()(tree);

    const paragraph = tree.children[0] as any;
    expect(
      paragraph.children.find((node: any) => node.type === 'element' && node.tagName === 'code'),
    ).toEqual({
      children: [{ type: 'text', value: 'code content' }],
      properties: {},
      tagName: 'code',
      type: 'element',
    });
    expect(
      paragraph.children.filter(
        (node: any) =>
          node.type === 'element' &&
          node.tagName === 'span' &&
          node.properties?.className === 'animate-stream',
      ).length,
    ).toBe(2);
  });

  it('should convert remend incomplete-link anchors into stable text content', () => {
    const tree: Root = {
      children: [
        {
          children: [
            { type: 'text', value: 'Equation: ' },
            {
              children: [{ type: 'text', value: 'ihbar rac{partial}{p' }],
              properties: { href: 'streamdown:incomplete-link' },
              tagName: 'a',
              type: 'element',
            },
          ],
          properties: {},
          tagName: 'p',
          type: 'element',
        },
      ],
      type: 'root',
    };

    rehypeStreamAnimated()(tree);

    const paragraph = tree.children[0] as any;
    const hasAnchor = paragraph.children.some(
      (node: any) => node.type === 'element' && node.tagName === 'a',
    );
    expect(hasAnchor).toBe(false);
    expect(collectText(paragraph)).toContain('[ihbar rac{partial}{p]');
  });

  it('should split cjk text without whitespace into multiple animated segments', () => {
    const source = '过去两年，我的生活发生了微妙而深刻的变化。';
    const tree: Root = {
      children: [
        {
          children: [{ type: 'text', value: source }],
          properties: {},
          tagName: 'p',
          type: 'element',
        },
      ],
      type: 'root',
    };

    rehypeStreamAnimated()(tree);

    const paragraph = tree.children[0] as any;
    const spans = paragraph.children.filter(
      (node: any) =>
        node.type === 'element' &&
        node.tagName === 'span' &&
        node.properties?.className === 'animate-stream',
    );

    expect(spans.length).toBeGreaterThan(1);
    expect(collectText(paragraph)).toBe(source);
  });

  it('should animate only the incoming segment as one chunk when source offset is provided', () => {
    const tree: Root = {
      children: [
        {
          children: [
            {
              position: {
                end: { offset: 17 },
                start: { offset: 0 },
              },
              type: 'text',
              value: 'Hello world again',
            } as any,
          ],
          properties: {},
          tagName: 'p',
          type: 'element',
        },
      ],
      type: 'root',
    };

    rehypeStreamAnimated({ animateFromSourceOffset: 12 })(tree);

    const paragraph = tree.children[0] as any;
    expect(paragraph.children).toEqual([
      { type: 'text', value: 'Hello world ' },
      {
        children: [{ type: 'text', value: 'again' }],
        properties: { className: 'animate-stream', key: 'stream-12-0' },
        tagName: 'span',
        type: 'element',
      },
    ]);
  });

  it('should keep old segment static when source offset exceeds node end', () => {
    const tree: Root = {
      children: [
        {
          children: [
            {
              position: {
                end: { offset: 5 },
                start: { offset: 0 },
              },
              type: 'text',
              value: 'Hello',
            } as any,
          ],
          properties: {},
          tagName: 'p',
          type: 'element',
        },
      ],
      type: 'root',
    };

    rehypeStreamAnimated({ animateFromSourceOffset: 6 })(tree);

    const paragraph = tree.children[0] as any;
    expect(paragraph.children[0]).toMatchObject({ type: 'text', value: 'Hello' });
    expect(paragraph.children).toHaveLength(1);
  });

  it('should animate whole text as one chunk when source offset exists but node has no position', () => {
    const tree: Root = {
      children: [
        {
          children: [{ type: 'text', value: 'No position node' }],
          properties: {},
          tagName: 'p',
          type: 'element',
        },
      ],
      type: 'root',
    };

    rehypeStreamAnimated({ animateFromSourceOffset: 3 })(tree);

    const paragraph = tree.children[0] as any;
    expect(paragraph.children).toEqual([
      {
        children: [{ type: 'text', value: 'No position node' }],
        properties: { className: 'animate-stream', key: 'stream-3-0' },
        tagName: 'span',
        type: 'element',
      },
    ]);
  });

  it('should split overlapping animate ranges into tokenized spans with stagger delay', () => {
    const tree: Root = {
      children: [
        {
          children: [
            {
              position: {
                end: { offset: 20 },
                start: { offset: 0 },
              },
              type: 'text',
              value: 'Hello world again text',
            } as any,
          ],
          properties: {},
          tagName: 'p',
          type: 'element',
        },
      ],
      type: 'root',
    };

    rehypeStreamAnimated({
      animateRanges: [
        { end: 11, key: 'r1', start: 6, tokenDelayStartMs: 20, tokenDelayStepMs: 15 },
        { end: 17, key: 'r2', start: 12, tokenDelayStartMs: 60, tokenDelayStepMs: 15 },
      ],
    })(tree);

    const paragraph = tree.children[0] as any;
    expect(collectText(paragraph)).toBe('Hello world again text');
    const spans = paragraph.children.filter(
      (node: any) =>
        node.type === 'element' &&
        node.tagName === 'span' &&
        node.properties?.className === 'animate-stream',
    );

    expect(spans).toHaveLength(10);
    expect(spans[0].children[0].value).toBe('w');
    expect(spans[0].properties).toMatchObject({
      key: 'r1-6-token-0',
      style: 'animation-delay:20ms;animation-fill-mode:both',
    });
    expect(spans[4].children[0].value).toBe('d');
    expect(spans[4].properties).toMatchObject({
      key: 'r1-6-token-4',
      style: 'animation-delay:80ms;animation-fill-mode:both',
    });
    expect(spans[5].children[0].value).toBe('a');
    expect(spans[5].properties).toMatchObject({
      key: 'r2-12-token-0',
      style: 'animation-delay:60ms;animation-fill-mode:both',
    });
    expect(spans[9].children[0].value).toBe('n');
    expect(spans[9].properties).toMatchObject({
      key: 'r2-12-token-4',
      style: 'animation-delay:120ms;animation-fill-mode:both',
    });
  });

  it('should keep token delay cursor continuous across multiple text nodes in one range', () => {
    const tree: Root = {
      children: [
        {
          children: [
            {
              position: {
                end: { offset: 6 },
                start: { offset: 0 },
              },
              type: 'text',
              value: 'Hello ',
            } as any,
            {
              position: {
                end: { offset: 17 },
                start: { offset: 6 },
              },
              type: 'text',
              value: 'world again',
            } as any,
          ],
          properties: {},
          tagName: 'p',
          type: 'element',
        },
      ],
      type: 'root',
    };

    rehypeStreamAnimated({
      animateRanges: [{ end: 17, key: 'r1', start: 0, tokenDelayStartMs: 0, tokenDelayStepMs: 12 }],
    })(tree);

    const paragraph = tree.children[0] as any;
    const spans = paragraph.children.filter(
      (node: any) =>
        node.type === 'element' &&
        node.tagName === 'span' &&
        node.properties?.className === 'animate-stream',
    );

    expect(spans).toHaveLength(15);
    expect(spans.map((span: any) => span.children[0].value).join('')).toBe('Helloworldagain');
    expect(spans[0].properties.style).toBe('animation-delay:0ms;animation-fill-mode:both');
    expect(spans[4].properties.style).toBe('animation-delay:48ms;animation-fill-mode:both');
    expect(spans[5].properties.style).toBe('animation-delay:60ms;animation-fill-mode:both');
    expect(spans[14].properties.style).toBe('animation-delay:168ms;animation-fill-mode:both');
  });

  it('should add extra stagger gap after line breaks', () => {
    const tree: Root = {
      children: [
        {
          children: [
            {
              position: {
                end: { offset: 4 },
                start: { offset: 0 },
              },
              type: 'text',
              value: 'ab\nc',
            } as any,
          ],
          properties: {},
          tagName: 'p',
          type: 'element',
        },
      ],
      type: 'root',
    };

    rehypeStreamAnimated({
      animateRanges: [
        {
          end: 4,
          key: 'r1',
          lineDelayMs: 60,
          start: 0,
          tokenDelayStartMs: 0,
          tokenDelayStepMs: 10,
        },
      ],
    })(tree);

    const paragraph = tree.children[0] as any;
    const spans = paragraph.children.filter(
      (node: any) =>
        node.type === 'element' &&
        node.tagName === 'span' &&
        node.properties?.className === 'animate-stream',
    );

    expect(spans).toHaveLength(3);
    expect(spans[0].children[0].value).toBe('a');
    expect(spans[1].children[0].value).toBe('b');
    expect(spans[2].children[0].value).toBe('c');
    expect(spans[0].properties.style).toBe('animation-delay:0ms;animation-fill-mode:both');
    expect(spans[1].properties.style).toBe('animation-delay:10ms;animation-fill-mode:both');
    expect(spans[2].properties.style).toBe('animation-delay:80ms;animation-fill-mode:both');
  });
});
