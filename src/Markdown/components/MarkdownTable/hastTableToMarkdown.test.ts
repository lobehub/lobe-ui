import { describe, expect, it } from 'vitest';

import { hastTableToMarkdown } from './hastTableToMarkdown';

const text = (value: string) => ({ type: 'text', value });

const el = (tagName: string, properties: any, children: any[] = []) => ({
  type: 'element',
  tagName,
  properties,
  children,
});

const cell = (tag: 'th' | 'td', content: any[], properties: any = {}) =>
  el(tag, properties, content);

const row = (cells: any[]) => el('tr', {}, cells);

const tableOf = (header: any[], body: any[][]) =>
  el('table', {}, [
    el('thead', {}, [row(header)]),
    el(
      'tbody',
      {},
      body.map((r) => row(r)),
    ),
  ]);

describe('hastTableToMarkdown', () => {
  it('serializes a simple table', () => {
    const node = tableOf(
      [cell('th', [text('Name')]), cell('th', [text('Age')])],
      [[cell('td', [text('Alice')]), cell('td', [text('25')])]],
    );
    expect(hastTableToMarkdown(node as any)).toBe('| Name | Age |\n| --- | --- |\n| Alice | 25 |');
  });

  it('honors explicit align attribute even when style is unrelated', () => {
    const node = tableOf(
      [
        cell('th', [text('A')], { style: 'color: red', align: 'right' }),
        cell('th', [text('B')], { style: 'font-weight: bold', align: 'center' }),
      ],
      [[cell('td', [text('1')]), cell('td', [text('2')])]],
    );
    expect(hastTableToMarkdown(node as any)).toBe('| A | B |\n| ---: | :---: |\n| 1 | 2 |');
  });

  it('prefers style alignment over align attribute when both specify it', () => {
    const node = tableOf(
      [cell('th', [text('A')], { style: 'text-align: center', align: 'left' })],
      [[cell('td', [text('1')])]],
    );
    expect(hastTableToMarkdown(node as any)).toBe('| A |\n| :---: |\n| 1 |');
  });

  it('encodes inline code containing backticks with longer fences', () => {
    const codeNode = el('code', {}, [text('a`b')]);
    const node = tableOf([cell('th', [text('Snippet')])], [[cell('td', [codeNode])]]);
    expect(hastTableToMarkdown(node as any)).toBe('| Snippet |\n| --- |\n| ``a`b`` |');
  });

  it('pads inline code that starts or ends with a backtick', () => {
    const codeNode = el('code', {}, [text('`x')]);
    const node = tableOf([cell('th', [text('Code')])], [[cell('td', [codeNode])]]);
    expect(hastTableToMarkdown(node as any)).toBe('| Code |\n| --- |\n| `` `x `` |');
  });

  it('escapes pipes inside cells', () => {
    const node = tableOf([cell('th', [text('a | b')])], [[cell('td', [text('c | d')])]]);
    expect(hastTableToMarkdown(node as any)).toBe('| a \\| b |\n| --- |\n| c \\| d |');
  });
});
