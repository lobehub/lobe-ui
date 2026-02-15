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
});
