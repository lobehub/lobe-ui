import type { Key } from 'react';

import type {
  TableColumn,
  TableMultipleSorterResult,
  TableProps,
  TableSorterResult,
} from '../type';
import { getSorterInfo, type SortState } from '../useSorter';

interface Row {
  age: number;
  name: string;
}

type Sorter = Parameters<NonNullable<TableProps<Row>['onChange']>>[2];

const state = (
  column: TableColumn<Row>,
  key: string,
  sortOrder: SortState<Row>['sortOrder'],
  multiplePriority: number | false,
): SortState<Row> => ({ column, key, multiplePriority, sortOrder });

describe('Table onChange sorter compatibility (pre-5.61 single-sorter code)', () => {
  it('types: single-sorter property access compiles, Array.isArray narrows to the array', () => {
    expectTypeOf<Sorter['columnKey']>().toEqualTypeOf<Key | undefined>();
    expectTypeOf<Sorter['order']>().toEqualTypeOf<'ascend' | 'descend' | undefined>();
    expectTypeOf<NonNullable<Sorter['column']>['dataIndex']>().not.toBeNever();
    const narrow = (sorter: Sorter) => {
      if (Array.isArray(sorter)) {
        expectTypeOf(sorter).toEqualTypeOf<TableMultipleSorterResult<Row>>();
        expectTypeOf(sorter[0]).toEqualTypeOf<TableSorterResult<Row>>();
      } else {
        expectTypeOf(sorter).toEqualTypeOf<TableSorterResult<Row>>();
      }
    };
    expect(narrow).toBeTypeOf('function');
  });

  it('runtime: one active sorter is a plain object', () => {
    const name: TableColumn<Row> = { dataIndex: 'name', sorter: { multiple: 1 } };
    const info = getSorterInfo([state(name, 'name', 'ascend', 1)]);
    expect(Array.isArray(info)).toBe(false);
    expect(info.columnKey).toBe('name');
    expect(info.order).toBe('ascend');
  });

  it('runtime: several sorters give an array that also exposes the first entry', () => {
    const name: TableColumn<Row> = { dataIndex: 'name', sorter: { multiple: 2 } };
    const age: TableColumn<Row> = { dataIndex: 'age', key: 'age', sorter: { multiple: 1 } };
    const info = getSorterInfo([state(name, 'name', 'descend', 2), state(age, 'age', 'ascend', 1)]);
    expect(Array.isArray(info)).toBe(true);
    const list = info as TableMultipleSorterResult<Row>;
    expect(list).toHaveLength(2);
    expect(info.columnKey).toBe(list[0].columnKey);
    expect(info.order).toBe(list[0].order);
    expect(info.field).toBe(list[0].field);
    // Non-enumerable: iteration, spread, keys and JSON see a plain array.
    expect(Object.keys(list)).toEqual(['0', '1']);
    expect([...list]).toHaveLength(2);
    expect(JSON.stringify(list).startsWith('[')).toBe(true);
  });
});
