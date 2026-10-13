import {
  assertColumnKeys,
  fillColumns,
  flattenColumns,
  getCellValue,
  getColumnId,
  getPathValue,
  isColumnVisibleAt,
} from '../columnUtils';
import type { TableColumn } from '../type';
import { filterData, mergeFilterStates } from '../useFilter';

interface Row {
  children?: Row[];
  id: string;
  name: string;
  spend: number;
}

const rows: Row[] = [
  { id: 'a', name: 'Ada', spend: 3 },
  { id: 'b', name: 'Bob', spend: 1 },
  { id: 'c', name: 'Cy', spend: 2 },
];

const ids = (data: Row[]) => data.map((row) => row.id);

describe('getColumnId', () => {
  test('prefers key, then dataIndex, then a positional id', () => {
    expect(getColumnId({ dataIndex: 'name', key: 'k' }, 0)).toBe('k');
    expect(getColumnId({ dataIndex: 'name' }, 0)).toBe('name');
    expect(getColumnId({ title: 'Actions' }, 3)).toBe('__column_3');
  });

  test('joins array dataIndex paths and uses nested positions', () => {
    expect(getColumnId({ dataIndex: ['address', 'city'] }, 0)).toBe('address.city');
    expect(getColumnId({ title: 'Group' }, '1-0')).toBe('__column_1-0');
  });
});

describe('getPathValue', () => {
  test('reads nested paths and stops at missing parents', () => {
    const record = { address: { city: 'Paris' }, tags: ['a', 'b'] };

    expect(getPathValue(record, ['address', 'city'])).toBe('Paris');
    expect(getPathValue(record, ['tags', 1])).toBe('b');
    expect(getPathValue(record, ['missing', 'city'])).toBeUndefined();
    expect(getPathValue(record, undefined)).toBeUndefined();
  });
});

describe('flattenColumns', () => {
  test('lists groups and leaves in pre-order with positional ids', () => {
    const flat = flattenColumns<Row>([
      { dataIndex: 'name' },
      { children: [{ dataIndex: 'spend' }, { title: 'x' }], title: 'Group' },
    ]);

    expect(flat.map(({ id }) => id)).toEqual(['name', '__column_1', 'spend', '__column_1-1']);
  });

  test('assertColumnKeys checks nested columns', () => {
    expect(() =>
      assertColumnKeys([{ children: [{ sorter: true, title: 'x' }], title: 'Group' }]),
    ).toThrow(/key.*dataIndex/);
  });
});

describe('fillColumns', () => {
  test('merges defaults under every column and group, ignoring undefined overrides', () => {
    const filled = fillColumns<Row>(
      [
        { align: undefined, dataIndex: 'name' },
        { children: [{ align: 'right', dataIndex: 'spend' }], title: 'Group' },
      ],
      { align: 'center', ellipsis: true },
    );

    expect(filled[0]).toMatchObject({ align: 'center', dataIndex: 'name', ellipsis: true });
    expect(filled[1]).toMatchObject({ align: 'center', ellipsis: true, title: 'Group' });
    expect((filled[1] as any).children[0]).toMatchObject({ align: 'right', ellipsis: true });
  });

  test('returns the input when there are no defaults', () => {
    const columns: TableColumn<Row>[] = [{ dataIndex: 'name' }];
    expect(fillColumns(columns, undefined)).toBe(columns);
  });
});

describe('isColumnVisibleAt', () => {
  test('hides a responsive column when none of its breakpoints is active', () => {
    const column: TableColumn<Row> = { dataIndex: 'name', responsive: ['md'] };

    expect(isColumnVisibleAt(column, new Set(['xs']))).toBe(false);
    expect(isColumnVisibleAt(column, new Set(['sm', 'md']))).toBe(true);
    expect(isColumnVisibleAt(column, null)).toBe(true);
    expect(isColumnVisibleAt({ dataIndex: 'name' }, new Set())).toBe(true);
  });
});

describe('getCellValue', () => {
  test('reads dataIndex and returns undefined without it', () => {
    const record: Row = { id: '1', name: 'Ada', spend: 3 };

    expect(getCellValue(record, { dataIndex: 'name' })).toBe('Ada');
    expect(getCellValue(record, { key: 'actions' })).toBeUndefined();
    expect(getCellValue({ meta: { id: 7 } }, { dataIndex: ['meta', 'id'] })).toBe(7);
  });
});

describe('filterData', () => {
  const columns: TableColumn<Row>[] = [
    {
      dataIndex: 'name',
      filters: [
        { text: 'Ada', value: 'Ada' },
        { text: 'Bob', value: 'Bob' },
      ],
      onFilter: (value, record) => record.name === value,
    },
  ];
  const statesOf = (filteredKeys?: string[] | null) =>
    mergeFilterStates(columns, { name: filteredKeys });

  test('keeps a record when any selected value matches onFilter', () => {
    expect(ids(filterData(rows, statesOf(['Ada', 'Bob'])))).toEqual(['a', 'b']);
    expect(ids(filterData(rows, statesOf(['Ada'])))).toEqual(['a']);
  });

  test('an empty selection does not filter', () => {
    expect(ids(filterData(rows, statesOf([])))).toEqual(['a', 'b', 'c']);
    expect(ids(filterData(rows, statesOf(null)))).toEqual(['a', 'b', 'c']);
    expect(ids(filterData(rows, statesOf()))).toEqual(['a', 'b', 'c']);
  });

  test('restores option values to their original type before calling onFilter', () => {
    const onFilter = vi.fn(() => true);
    const numeric: TableColumn<Row>[] = [
      { dataIndex: 'spend', filters: [{ text: '3', value: 3 }], onFilter },
    ];
    filterData(rows, mergeFilterStates(numeric, { spend: ['3'] }));
    expect(onFilter).toHaveBeenCalledWith(3, expect.anything());
  });
});

describe('assertColumnKeys', () => {
  test('throws for a sortable column with neither key nor dataIndex', () => {
    expect(() => assertColumnKeys([{ sorter: true, title: 'x' } as TableColumn<Row>])).toThrow(
      /key.*dataIndex/,
    );
    expect(() => assertColumnKeys([{ key: 'x', sorter: true }])).not.toThrow();
  });
});
