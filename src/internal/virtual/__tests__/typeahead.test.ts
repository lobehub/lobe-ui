import { createElement } from 'react';

import { findEdge, findMatch, flattenText, type ListEntry } from '../useMenuVirtualList';

const entries: ListEntry[] = [
  { disabled: false, label: 'apple' },
  { disabled: false, label: 'apricot' },
  { disabled: true, label: 'avocado' },
  { disabled: false, label: 'banana' },
  { disabled: false, label: 'blueberry' },
];

describe('findMatch', () => {
  test('prefix match from the start', () => {
    expect(findMatch(entries, 'ban', 0)).toBe(3);
  });

  test('searches after the start index and wraps around', () => {
    expect(findMatch(entries, 'a', 3)).toBe(0);
  });

  test('cycles to the next same-prefix item past the current index', () => {
    expect(findMatch(entries, 'a', 1)).toBe(1);
    expect(findMatch(entries, 'ap', 2)).toBe(0);
  });

  test('skips disabled items', () => {
    expect(findMatch(entries, 'av', 0)).toBe(-1);
  });

  test('no match returns -1', () => {
    expect(findMatch(entries, 'zzz', 0)).toBe(-1);
  });
});

describe('findEdge', () => {
  test('first enabled item', () => {
    expect(findEdge(entries, false)).toBe(0);
  });

  test('last enabled item skips a trailing disabled row', () => {
    const withDisabledTail: ListEntry[] = [...entries, { disabled: true, label: 'zed' }];
    expect(findEdge(withDisabledTail, true)).toBe(4);
  });

  test('first enabled item skips a leading disabled row', () => {
    const withDisabledHead: ListEntry[] = [{ disabled: true, label: 'zed' }, ...entries];
    expect(findEdge(withDisabledHead, false)).toBe(1);
  });
});

describe('flattenText', () => {
  test('reads nested element text', () => {
    const node = createElement('div', null, createElement('span', null, 'Item '), 42);
    expect(flattenText(node)).toBe('Item 42');
  });
});
