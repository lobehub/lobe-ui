import type { SortOrder, TableColumn } from '../type';
import {
  collectSortStates,
  getNextSortOrder,
  getSorterInfo,
  getSortTitleProps,
  getTriggeredSortStates,
  mergeSortStates,
  sortData,
  type SortState,
} from '../useSorter';

interface Row {
  age: number;
  children?: Row[];
  id: string;
  name: string;
  spend: number;
}

const rows: Row[] = [
  { age: 30, id: 'a', name: 'Ada', spend: 3 },
  { age: 20, id: 'b', name: 'Bob', spend: 1 },
  { age: 30, id: 'c', name: 'Cy', spend: 2 },
  { age: 20, id: 'd', name: 'Dee', spend: 4 },
];

const ids = (data: Row[]) => data.map((row) => row.id);

const state = (
  column: TableColumn<Row>,
  key: string,
  sortOrder: SortState['sortOrder'],
  multiplePriority: number | false = false,
): SortState<Row> => ({ column, key, multiplePriority, sortOrder });

const spendColumn: TableColumn<Row> = { dataIndex: 'spend', sorter: (a, b) => a.spend - b.spend };

describe('sortData', () => {
  test('a comparator sorts ascending and reverses for descend', () => {
    expect(ids(sortData(rows, [state(spendColumn, 'spend', 'ascend')]))).toEqual([
      'b',
      'c',
      'a',
      'd',
    ]);
    expect(ids(sortData(rows, [state(spendColumn, 'spend', 'descend')]))).toEqual([
      'd',
      'a',
      'c',
      'b',
    ]);
  });

  test('sorter: true and a null order leave the order alone', () => {
    expect(
      ids(sortData(rows, [state({ dataIndex: 'name', sorter: true }, 'name', 'descend')])),
    ).toEqual(['a', 'b', 'c', 'd']);
    expect(ids(sortData(rows, [state(spendColumn, 'spend', null)]))).toEqual(['a', 'b', 'c', 'd']);
  });

  test('{ compare } sorts and the comparator receives the sort order', () => {
    const compare = vi.fn((a: Row, b: Row, _order?: SortOrder) => a.spend - b.spend);
    const column: TableColumn<Row> = { dataIndex: 'spend', sorter: { compare } };

    expect(ids(sortData(rows, [state(column, 'spend', 'descend')]))).toEqual(['d', 'a', 'c', 'b']);
    expect(compare.mock.calls.every((call) => call[2] === 'descend')).toBe(true);
  });

  test('multiple sorters apply by descending `multiple` priority', () => {
    const age: TableColumn<Row> = {
      dataIndex: 'age',
      sorter: { compare: (a, b) => a.age - b.age, multiple: 2 },
    };
    const spend: TableColumn<Row> = {
      dataIndex: 'spend',
      sorter: { compare: (a, b) => a.spend - b.spend, multiple: 1 },
    };

    // Order in the state list does not matter; age (priority 2) sorts first.
    expect(
      ids(sortData(rows, [state(spend, 'spend', 'descend', 1), state(age, 'age', 'ascend', 2)])),
    ).toEqual(['d', 'b', 'a', 'c']);
  });

  test('does not mutate the input and sorts tree children recursively', () => {
    const tree: Row[] = [
      {
        age: 0,
        children: [
          {
            age: 0,
            children: [
              { age: 0, id: 'a1y', name: '', spend: 8 },
              { age: 0, id: 'a1x', name: '', spend: 7 },
            ],
            id: 'a2',
            name: '',
            spend: 9,
          },
          { age: 0, id: 'a1', name: '', spend: 1 },
        ],
        id: 'a',
        name: '',
        spend: 5,
      },
      { age: 0, id: 'b', name: '', spend: 0 },
    ];
    const sorted = sortData(tree, [state(spendColumn, 'spend', 'ascend')]);

    expect(ids(sorted)).toEqual(['b', 'a']);
    expect(ids(sorted[1].children!)).toEqual(['a1', 'a2']);
    expect(ids(sorted[1].children![1].children!)).toEqual(['a1x', 'a1y']);
    expect(ids(tree[0].children!)).toEqual(['a2', 'a1']);
  });

  test('a custom childrenColumnName is followed', () => {
    const tree = [
      {
        id: 'p',
        items: [
          { id: 'y', spend: 2 },
          { id: 'x', spend: 1 },
        ],
        spend: 0,
      },
    ] as unknown as Row[];
    const sorted = sortData(tree, [state(spendColumn, 'spend', 'ascend')], 'items') as any[];

    expect(sorted[0].items.map((row: Row) => row.id)).toEqual(['x', 'y']);
  });
});

describe('getNextSortOrder', () => {
  test('cycles ascend → descend → none by default', () => {
    const directions = ['ascend', 'descend'] as const;

    expect(getNextSortOrder([...directions], undefined)).toBe('ascend');
    expect(getNextSortOrder([...directions], null)).toBe('ascend');
    expect(getNextSortOrder([...directions], 'ascend')).toBe('descend');
    expect(getNextSortOrder([...directions], 'descend')).toBeUndefined();
  });

  test('follows custom directions strictly', () => {
    expect(getNextSortOrder(['descend', 'ascend'], undefined)).toBe('descend');
    expect(getNextSortOrder(['descend', 'ascend'], 'descend')).toBe('ascend');
    expect(getNextSortOrder(['descend', 'ascend'], 'ascend')).toBeUndefined();
    // A single direction toggles between it and unsorted.
    expect(getNextSortOrder(['descend'], undefined)).toBe('descend');
    expect(getNextSortOrder(['descend'], 'descend')).toBeUndefined();
    // antd's trick to forbid un-sorting.
    expect(getNextSortOrder(['ascend', 'descend', 'ascend'], 'descend')).toBe('ascend');
  });
});

describe('collectSortStates', () => {
  test('collects every defaultSortOrder at init, including nested ones', () => {
    const columns: TableColumn<Row>[] = [
      { dataIndex: 'name', defaultSortOrder: 'ascend', sorter: { multiple: 1 } },
      {
        children: [{ dataIndex: 'age', defaultSortOrder: 'descend', sorter: { multiple: 2 } }],
        title: 'Group',
      },
      { dataIndex: 'spend', defaultSortOrder: null, sorter: true },
      { dataIndex: 'id', defaultSortOrder: 'ascend' },
    ];

    expect(
      collectSortStates(columns, true).map(({ key, multiplePriority, sortOrder }) => ({
        key,
        multiplePriority,
        sortOrder,
      })),
    ).toEqual([
      { key: 'name', multiplePriority: 1, sortOrder: 'ascend' },
      { key: 'age', multiplePriority: 2, sortOrder: 'descend' },
    ]);
    expect(collectSortStates(columns, false)).toEqual([]);
  });

  test('a controlled sortOrder (even null) wins over defaultSortOrder', () => {
    const columns: TableColumn<Row>[] = [
      { dataIndex: 'name', defaultSortOrder: 'ascend', sortOrder: null, sorter: true },
    ];

    expect(collectSortStates(columns, true).map(({ sortOrder }) => sortOrder)).toEqual([null]);
  });
});

describe('mergeSortStates', () => {
  test('uncontrolled: keeps inner states of existing columns with fresh column objects', () => {
    const fresh: TableColumn<Row> = { ...spendColumn };
    const merged = mergeSortStates(
      [fresh],
      [state(spendColumn, 'spend', 'ascend'), state({ dataIndex: 'gone' }, 'gone', 'ascend')],
    );

    expect(merged).toHaveLength(1);
    expect(merged[0].column).toBe(fresh);
  });

  test('controlled single sorter nulls every later controlled column', () => {
    const merged = mergeSortStates(
      [
        { dataIndex: 'name', sortOrder: 'ascend', sorter: true },
        { dataIndex: 'age', sortOrder: 'descend', sorter: true },
      ],
      [],
    );

    expect(merged.map(({ key, sortOrder }) => [key, sortOrder])).toEqual([
      ['name', 'ascend'],
      ['age', null],
    ]);
  });

  test('controlled multiple sorters all apply', () => {
    const merged = mergeSortStates(
      [
        { dataIndex: 'name', sortOrder: 'ascend', sorter: { multiple: 1 } },
        { dataIndex: 'age', sortOrder: 'descend', sorter: { multiple: 2 } },
        { dataIndex: 'spend', sortOrder: 'ascend', sorter: true },
      ],
      [],
    );

    expect(merged.map(({ key, sortOrder }) => [key, sortOrder])).toEqual([
      ['name', 'ascend'],
      ['age', 'descend'],
      ['spend', null],
    ]);
  });
});

describe('getTriggeredSortStates', () => {
  const name = state({ dataIndex: 'name', sorter: { multiple: 1 } }, 'name', 'ascend', 1);
  const age = state({ dataIndex: 'age', sorter: { multiple: 2 } }, 'age', 'descend', 2);
  const spend = state(spendColumn, 'spend', 'ascend');

  test('multiple sorters accumulate; the clicked one moves to the end', () => {
    expect(getTriggeredSortStates([name], age)).toEqual([name, age]);
    const nameDesc = { ...name, sortOrder: 'descend' as const };
    expect(getTriggeredSortStates([name, age], nameDesc)).toEqual([age, nameDesc]);
  });

  test('a single sorter replaces the sort, and replaces a single sort', () => {
    expect(getTriggeredSortStates([name, age], spend)).toEqual([spend]);
    expect(getTriggeredSortStates([spend], name)).toEqual([name]);
  });
});

describe('getSorterInfo', () => {
  const name: TableColumn<Row> = { dataIndex: 'name', key: 'n', sorter: { multiple: 1 } };
  const age: TableColumn<Row> = { dataIndex: 'age', sorter: { multiple: 2 } };

  test('a single active sorter is an object with field / columnKey / column / order', () => {
    expect(getSorterInfo([state(name, 'n', 'ascend', 1)])).toEqual({
      column: name,
      columnKey: 'n',
      field: 'name',
      order: 'ascend',
    });
  });

  test('several active sorters are reported as an array', () => {
    expect(getSorterInfo([state(name, 'n', 'ascend', 1), state(age, 'age', 'descend', 2)])).toEqual(
      [
        { column: name, columnKey: 'n', field: 'name', order: 'ascend' },
        { column: age, columnKey: 'age', field: 'age', order: 'descend' },
      ],
    );
  });

  test('no active sorter reports empty fields; no state reports {}', () => {
    expect(getSorterInfo([state(name, 'n', undefined, 1)])).toEqual({
      column: undefined,
      columnKey: undefined,
      field: undefined,
      order: undefined,
    });
    expect(getSorterInfo([])).toEqual({});
  });
});

describe('getSortTitleProps', () => {
  test('lists every sort state and the legacy first column', () => {
    const age: TableColumn<Row> = { dataIndex: 'age', sorter: { multiple: 2 } };
    expect(
      getSortTitleProps([state(spendColumn, 'spend', 'ascend'), state(age, 'age', null)]),
    ).toEqual({
      sortColumn: spendColumn,
      sortColumns: [
        { column: spendColumn, order: 'ascend' },
        { column: age, order: null },
      ],
      sortOrder: 'ascend',
    });
  });
});
