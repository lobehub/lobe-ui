import { getCellValue, getColumnId, toColumnDefs } from '../toColumnDefs';
import type { TableColumn } from '../type';

interface Row {
  id: string;
  name: string;
  spend: number;
}

const fakeRow = (original: Row) => ({ original }) as any;

describe('getColumnId', () => {
  test('prefers key, then dataIndex, then a positional id', () => {
    expect(getColumnId({ dataIndex: 'name', key: 'k' }, 0)).toBe('k');
    expect(getColumnId({ dataIndex: 'name' }, 0)).toBe('name');
    expect(getColumnId({ title: 'Actions' }, 3)).toBe('__column_3');
  });
});

describe('getCellValue', () => {
  test('reads dataIndex and returns undefined without it', () => {
    const record: Row = { id: '1', name: 'Ada', spend: 3 };

    expect(getCellValue(record, { dataIndex: 'name' })).toBe('Ada');
    expect(getCellValue(record, { key: 'actions' })).toBeUndefined();
  });
});

describe('toColumnDefs', () => {
  test('maps id and accessor', () => {
    const [def] = toColumnDefs<Row>([{ dataIndex: 'name', title: 'Name' }]) as any[];

    expect(def.id).toBe('name');
    expect(def.accessorFn({ id: '1', name: 'Ada', spend: 1 })).toBe('Ada');
  });

  test('wires a comparator sorter as an ascending sortFn over originals', () => {
    const [def] = toColumnDefs<Row>([
      { dataIndex: 'spend', sorter: (a, b) => a.spend - b.spend },
    ]) as any[];

    expect(def.enableSorting).toBe(true);
    expect(
      def.sortFn(
        fakeRow({ id: 'a', name: 'a', spend: 1 }),
        fakeRow({ id: 'b', name: 'b', spend: 5 }),
      ),
    ).toBeLessThan(0);
  });

  test('sorter: true enables sorting without a sortFn', () => {
    const [def] = toColumnDefs<Row>([{ dataIndex: 'spend', sorter: true }]) as any[];

    expect(def.enableSorting).toBe(true);
    expect(def.sortFn).toBeUndefined();
  });

  test('sortDirections starting with descend sets sortDescFirst', () => {
    const [def] = toColumnDefs<Row>([
      { dataIndex: 'spend', sortDirections: ['descend', 'ascend'], sorter: true },
    ]) as any[];

    expect(def.sortDescFirst).toBe(true);
  });

  test('filterFn passes when any selected value matches onFilter', () => {
    const [def] = toColumnDefs<Row>([
      {
        dataIndex: 'name',
        filters: [
          { text: 'Ada', value: 'Ada' },
          { text: 'Bob', value: 'Bob' },
        ],
        onFilter: (value, record) => record.name === value,
      },
    ]) as any[];
    const row = fakeRow({ id: '1', name: 'Bob', spend: 0 });

    expect(def.enableColumnFilter).toBe(true);
    expect(def.filterFn(row, 'name', ['Ada', 'Bob'])).toBe(true);
    expect(def.filterFn(row, 'name', ['Ada'])).toBe(false);
    expect(def.filterFn.autoRemove([])).toBe(true);
    expect(def.filterFn.autoRemove(['Ada'])).toBe(false);
  });

  test('throws for a sortable column with neither key nor dataIndex', () => {
    expect(() => toColumnDefs<Row>([{ sorter: true, title: 'x' } as TableColumn<Row>])).toThrow(
      /key.*dataIndex/,
    );
  });
});
