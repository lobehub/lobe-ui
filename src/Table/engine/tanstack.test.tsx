import { renderHook } from '@testing-library/react';
import type { Key } from 'react';
import { describe, expect, it } from 'vitest';

import type { EngineColumn, TableEngineInput } from './types';
import { useTableEngine, useVirtualModel } from './useTableEngine';

interface Row {
  children?: Row[];
  key: Key;
  name: string;
}

const col = (key: string, extra: Partial<EngineColumn<string>> = {}): EngineColumn<string> => ({
  key,
  source: key,
  ...extra,
});

const EMPTY_KEYS = new Set<Key>();

const run = <T,>(
  input: Partial<TableEngineInput<T, string>> & { columns: EngineColumn<string>[] },
) =>
  renderHook(() =>
    useTableEngine<T, string>({
      columnWidths: [],
      data: [],
      expandedKeys: EMPTY_KEYS,
      getRowKey: (record: any) => record.key,
      ...input,
    }),
  ).result.current;

describe('useTableEngine header rows', () => {
  it('gives a flat header one row of leaf cells', () => {
    const model = run({ columns: [col('a'), col('b')] });
    expect(model.headerRows).toHaveLength(1);
    expect(model.headerRows[0].map((cell) => [cell.key, cell.colSpan, cell.rowSpan])).toEqual([
      ['a', 1, 1],
      ['b', 1, 1],
    ]);
  });

  it('spans groups over their leaves and leaves over the remaining depth', () => {
    const model = run({
      columns: [
        col('name'),
        col('info', {
          children: [col('age'), col('address', { children: [col('street'), col('city')] })],
        }),
      ],
    });
    const shape = model.headerRows.map((row) =>
      row.map((cell) => `${cell.key}:${cell.colSpan}x${cell.rowSpan}@${cell.colStart}`),
    );
    expect(shape).toEqual([
      ['name:1x3@0', 'info:3x1@1'],
      ['age:1x2@1', 'address:2x1@2'],
      ['street:1x1@2', 'city:1x1@3'],
    ]);
    expect(model.leafColumns.map((leaf) => leaf.key)).toEqual(['name', 'age', 'street', 'city']);
  });

  it('applies a header colSpan override and drops cells covered by it', () => {
    const model = run({
      columns: [col('a', { headerColSpan: 2 }), col('b', { headerColSpan: 0 }), col('c')],
    });
    expect(model.headerRows[0].map((cell) => [cell.key, cell.colSpan])).toEqual([
      ['a', 2],
      ['c', 1],
    ]);
  });
});

describe('useTableEngine fixed columns', () => {
  it('stacks start offsets over fixed columns only and marks the last start edge', () => {
    const model = run({
      columnWidths: [40, 100, 80, 60],
      columns: [
        col('select', { fixed: 'start' }),
        col('name', { fixed: 'start' }),
        col('age'),
        col('action', { fixed: 'end' }),
      ],
    });
    const info = model.leafColumns.map((leaf) => leaf.fixedInfo);
    expect(info[0]).toMatchObject({ fixStart: 0, shadowStart: false });
    expect(info[1]).toMatchObject({ fixStart: 40, shadowStart: true });
    expect(info[2].fixStart).toBeUndefined();
    expect(info[2].fixEnd).toBeUndefined();
    expect(info[3]).toMatchObject({ fixEnd: 0, shadowEnd: true });
  });

  it('inherits fixed from a group and pins the group header', () => {
    const model = run({
      columnWidths: [50, 70, 90],
      columns: [col('group', { children: [col('a'), col('b')], fixed: 'start' }), col('c')],
    });
    expect(model.leafColumns.map((leaf) => leaf.fixed)).toEqual(['start', 'start', undefined]);
    expect(model.headerRows[0][0].fixedInfo).toMatchObject({ fixStart: 0, shadowStart: true });
    expect(model.leafColumns[1].fixedInfo.fixStart).toBe(50);
  });

  it('measures the scroll distance before a start shadow shows', () => {
    const model = run({
      columnWidths: [30, 50, 70],
      columns: [col('a'), col('b', { fixed: 'start' }), col('c')],
    });
    expect(model.leafColumns[1].fixedInfo.offsetFixedStartShadow).toBe(30);
  });
});

describe('useTableEngine rows', () => {
  const tree: Row[] = [
    {
      children: [
        { key: 'a-1', name: 'a-1' },
        { children: [{ key: 'a-2-1', name: 'a-2-1' }], key: 'a-2', name: 'a-2' },
      ],
      key: 'a',
      name: 'a',
    },
    { key: 'b', name: 'b' },
  ];

  it('flattens only the expanded branches with depth and per-level render index', () => {
    const model = run<Row>({
      columns: [col('name')],
      data: tree,
      expandedKeys: new Set<Key>(['a', 'a-2']),
      getChildren: (record) => record.children,
    });
    expect(
      model.rows.map((row) => [row.key, row.depth, row.index, row.renderIndex, row.expanded]),
    ).toEqual([
      ['a', 0, 0, 0, true],
      ['a-1', 1, 1, 0, false],
      ['a-2', 1, 2, 1, true],
      ['a-2-1', 2, 3, 0, false],
      ['b', 0, 4, 1, false],
    ]);
    expect(model.rows.map((row) => row.hasChildren)).toEqual([true, false, true, false, false]);
  });

  it('keeps collapsed children out of the rows', () => {
    const model = run<Row>({
      columns: [col('name')],
      data: tree,
      getChildren: (record) => record.children,
    });
    expect(model.rows.map((row) => row.key)).toEqual(['a', 'b']);
  });

  it('follows expanded keys across renders', () => {
    const getChildren = (record: Row) => record.children;
    const getRowKey = (record: Row) => record.key;
    const columns = [col('name')];
    const { rerender, result } = renderHook(
      ({ expandedKeys }: { expandedKeys: ReadonlySet<Key> }) =>
        useTableEngine<Row, string>({
          columnWidths: [],
          columns,
          data: tree,
          expandedKeys,
          getChildren,
          getRowKey,
        }),
      { initialProps: { expandedKeys: EMPTY_KEYS } },
    );
    expect(result.current.rows).toHaveLength(2);
    rerender({ expandedKeys: new Set<Key>(['a']) });
    expect(result.current.rows.map((row) => row.key)).toEqual(['a', 'a-1', 'a-2', 'b']);
    rerender({ expandedKeys: EMPTY_KEYS });
    expect(result.current.rows.map((row) => row.key)).toEqual(['a', 'b']);
  });

  it('keeps record identity', () => {
    const model = run<Row>({ columns: [col('name')], data: tree });
    expect(model.rows[0].record).toBe(tree[0]);
  });
});

describe('useVirtualModel', () => {
  it('sizes the virtual list from the row height', () => {
    const data = Array.from({ length: 100 }, (_, index) => ({ key: index, name: `${index}` }));
    const { rows } = run({ columns: [col('name')], data });
    const { result } = renderHook(() =>
      useVirtualModel({ getScrollElement: () => null, rowHeight: 40 }, rows),
    );
    expect(result.current.totalSize).toBe(4000);
  });
});
