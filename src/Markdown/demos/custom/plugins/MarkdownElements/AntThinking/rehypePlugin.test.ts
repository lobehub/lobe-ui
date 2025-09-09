import { describe, expect, it } from 'vitest';

import rehypePlugin from './rehypePlugin';

describe('rehypePlugin', () => {
  it('should transform <antThinking> tags within paragraphs', () => {
    const tree = {
      children: [
        {
          children: [
            { type: 'text', value: 'Before ' },
            { type: 'raw', value: '<antThinking>' },
            { type: 'text', value: 'Thinking content' },
            { type: 'raw', value: '</antThinking>' },
            { type: 'text', value: ' After' },
          ],
          tagName: 'p',
          type: 'element',
        },
      ],
      type: 'root',
    };

    const expectedTree = {
      children: [
        {
          children: [{ type: 'text', value: 'Thinking content' }],
          properties: {},
          tagName: 'antThinking',
          type: 'element',
        },
      ],
      type: 'root',
    };

    const plugin = rehypePlugin();
    plugin(tree);

    expect(tree).toEqual(expectedTree);
  });

  it('should not transform when only opening tag is present', () => {
    const tree = {
      children: [
        {
          children: [
            { type: 'text', value: 'Before ' },
            { type: 'raw', value: '<antThinking>' },
            { type: 'text', value: 'Thinking content' },
          ],
          tagName: 'p',
          type: 'element',
        },
      ],
      type: 'root',
    };

    const originalTree = structuredClone(tree);

    const plugin = rehypePlugin();
    plugin(tree);

    expect(tree).toEqual(originalTree);
  });

  it('should not transform when only closing tag is present', () => {
    const tree = {
      children: [
        {
          children: [
            { type: 'text', value: 'Thinking content' },
            { type: 'raw', value: '</antThinking>' },
            { type: 'text', value: ' After' },
          ],
          tagName: 'p',
          type: 'element',
        },
      ],
      type: 'root',
    };

    const originalTree = structuredClone(tree);

    const plugin = rehypePlugin();
    plugin(tree);

    expect(tree).toEqual(originalTree);
  });

  it('should not transform when tags are in wrong order', () => {
    const tree = {
      children: [
        {
          children: [
            { type: 'raw', value: '</antThinking>' },
            { type: 'text', value: 'Thinking content' },
            { type: 'raw', value: '<antThinking>' },
          ],
          tagName: 'p',
          type: 'element',
        },
      ],
      type: 'root',
    };

    const originalTree = structuredClone(tree);

    const plugin = rehypePlugin();
    plugin(tree);

    expect(tree).toEqual(originalTree);
  });

  it('should handle multiple paragraphs and transformations', () => {
    const tree = {
      children: [
        {
          children: [{ type: 'text', value: 'Normal paragraph' }],
          tagName: 'p',
          type: 'element',
        },
        {
          children: [
            { type: 'raw', value: '<antThinking>' },
            { type: 'text', value: 'First thinking' },
            { type: 'raw', value: '</antThinking>' },
          ],
          tagName: 'p',
          type: 'element',
        },
        {
          children: [
            { type: 'raw', value: '<antThinking>' },
            { type: 'text', value: 'Second thinking' },
            { type: 'raw', value: '</antThinking>' },
          ],
          tagName: 'p',
          type: 'element',
        },
      ],
      type: 'root',
    };

    const expectedTree = {
      children: [
        {
          children: [{ type: 'text', value: 'Normal paragraph' }],
          tagName: 'p',
          type: 'element',
        },
        {
          children: [{ type: 'text', value: 'First thinking' }],
          properties: {},
          tagName: 'antThinking',
          type: 'element',
        },
        {
          children: [{ type: 'text', value: 'Second thinking' }],
          properties: {},
          tagName: 'antThinking',
          type: 'element',
        },
      ],
      type: 'root',
    };

    const plugin = rehypePlugin();
    plugin(tree);

    expect(tree).toEqual(expectedTree);
  });
});
