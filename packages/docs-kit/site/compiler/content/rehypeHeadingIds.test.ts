import type { Element, Root } from 'hast';

import { rehypeHeadingIds } from './rehypeHeadingIds';

const heading = (depth: 1 | 2 | 3, value: string, id?: string): Element => ({
  children: [{ type: 'text', value }],
  properties: id ? { id } : {},
  tagName: `h${depth}`,
  type: 'element',
});

const transform = (...children: Element[]): Element[] => {
  const tree: Root = { children, type: 'root' };
  rehypeHeadingIds()(tree);
  return tree.children as Element[];
};

it('creates deterministic Unicode heading identifiers and suffixes duplicates', () => {
  const [first, second, third] = transform(
    heading(2, '你好，世界'),
    heading(3, '你好，世界'),
    heading(2, 'Crème brûlée API'),
  );

  expect(first.properties?.id).toBe('你好-世界');
  expect(second.properties?.id).toBe('你好-世界-2');
  expect(third.properties?.id).toBe('crème-brûlée-api');
});

it('preserves explicit identifiers and reserves them before generating automatic identifiers', () => {
  const [automatic, explicit] = transform(heading(2, 'Usage'), heading(2, 'Custom', 'usage'));

  expect(automatic.properties?.id).toBe('usage-2');
  expect(explicit.properties?.id).toBe('usage');
});

it('reserves explicit identifiers on non-heading elements across the compiled page', () => {
  const anchor: Element = {
    children: [],
    properties: { id: 'usage' },
    tagName: 'div',
    type: 'element',
  };
  const [, automatic] = transform(anchor, heading(2, 'Usage'));

  expect(automatic.properties?.id).toBe('usage-2');
});

it('collects text recursively from formatted heading children', () => {
  const formatted: Element = {
    children: [
      { type: 'text', value: 'Button ' },
      {
        children: [{ type: 'text', value: 'API' }],
        properties: {},
        tagName: 'code',
        type: 'element',
      },
    ],
    properties: {},
    tagName: 'h2',
    type: 'element',
  };

  const [result] = transform(formatted);

  expect(result.properties?.id).toBe('button-api');
});

it('reserves fixed documentation shell identifiers before assigning heading identifiers', () => {
  const [content, pageContent] = transform(
    heading(2, 'Docs Content'),
    heading(2, 'Docs Page Content'),
  );

  expect(content.properties?.id).toBe('docs-content-2');
  expect(pageContent.properties?.id).toBe('docs-page-content-2');
});
