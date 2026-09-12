import { describe, expect, it } from 'vitest';

import type { TreeDataNode } from '../type';
import { conductCheck, flattenVisible, getAllKeys, getAncestorKeys } from '../utils';

const data: TreeDataNode[] = [
  {
    children: [
      { children: [{ key: 'a-1-x', title: 'a-1-x' }], key: 'a-1', title: 'a-1' },
      { key: 'a-2', title: 'a-2' },
      { checkable: false, key: 'a-3', title: 'a-3' },
    ],
    key: 'a',
    title: 'a',
  },
  { children: [{ key: 'b-1', title: 'b-1' }], key: 'b', title: 'b' },
  { children: [], isLeaf: true, key: 'c', title: 'c' },
];

describe('flattenVisible', () => {
  it('only walks into expanded nodes', () => {
    expect(flattenVisible(data, new Set(['a'])).map((r) => r.node.key)).toEqual([
      'a',
      'a-1',
      'a-2',
      'a-3',
      'b',
      'c',
    ]);
  });

  it('records depth, parentKey, hasChildren and isLast', () => {
    const rows = flattenVisible(data, new Set(['a', 'a-1']));
    const byKey = Object.fromEntries(rows.map((r) => [r.node.key, r]));
    expect(byKey['a-1-x']).toMatchObject({ depth: 2, hasChildren: false, isLast: true, parentKey: 'a-1' });
    expect(byKey['a-1']).toMatchObject({ depth: 1, hasChildren: true, isLast: false, parentKey: 'a' });
    expect(byKey['a-3'].isLast).toBe(true);
    expect(byKey['c']).toMatchObject({ depth: 0, hasChildren: false, isLast: true, parentKey: null });
  });

  it('trail marks ancestors that still have following siblings', () => {
    const rows = flattenVisible(data, new Set(['a', 'a-1', 'b']));
    const byKey = Object.fromEntries(rows.map((r) => [r.node.key, r]));
    expect(byKey['a-1-x'].trail).toEqual([true, true]);
    expect(byKey['b-1'].trail).toEqual([true]);
  });
});

describe('getAllKeys', () => {
  it('returns every key in document order', () => {
    expect(getAllKeys(data)).toEqual(['a', 'a-1', 'a-1-x', 'a-2', 'a-3', 'b', 'b-1', 'c']);
  });
});

describe('conductCheck', () => {
  it('checks every descendant when a parent is checked', () => {
    const { checked, halfChecked } = conductCheck(data, ['b']);
    expect([...checked].sort()).toEqual(['b', 'b-1']);
    expect(halfChecked.size).toBe(0);
  });

  it('marks parent half-checked when only some children are checked', () => {
    const { checked, halfChecked } = conductCheck(data, ['a-2']);
    expect([...checked]).toEqual(['a-2']);
    expect([...halfChecked]).toEqual(['a']);
  });

  it('checks the parent when all checkable children are checked', () => {
    const { checked, halfChecked } = conductCheck(data, ['a-1-x', 'a-2']);
    expect([...checked].sort()).toEqual(['a', 'a-1', 'a-1-x', 'a-2']);
    expect(halfChecked.size).toBe(0);
  });

  it('propagates half-checked through grandparents', () => {
    const { halfChecked } = conductCheck(data, ['a-1-x']);
    expect([...halfChecked].sort()).toEqual(['a']);
  });

  it('ignores disabled and checkable:false nodes', () => {
    const withDisabled: TreeDataNode[] = [
      { children: [{ key: 'p-1', title: 'p-1' }, { disabled: true, key: 'p-2', title: 'p-2' }], key: 'p', title: 'p' },
    ];
    const { checked } = conductCheck(withDisabled, ['p']);
    expect([...checked].sort()).toEqual(['p', 'p-1']);
  });
});

describe('getAncestorKeys', () => {
  it('returns ancestors nearest first', () => {
    expect(getAncestorKeys(data, 'a-1-x')).toEqual(['a-1', 'a']);
    expect(getAncestorKeys(data, 'c')).toEqual([]);
  });
});
