import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';

import Table from '../Table';
import type { SortOrder, TableColumn, TableColumnTitleProps, TableSorterResult } from '../type';

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    disconnect() {}
    observe() {}
    unobserve() {}
  } as any;
}

interface Row {
  children?: Row[];
  chinese: number;
  key: string;
  math: number;
  name: string;
}

const rows: Row[] = [
  { chinese: 98, key: '1', math: 60, name: 'John' },
  { chinese: 98, key: '2', math: 66, name: 'Jim' },
  { chinese: 65, key: '3', math: 98, name: 'Joe' },
  { chinese: 88, key: '4', math: 99, name: 'Jane' },
];

const names = () =>
  screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[0].textContent);

const header = (name: RegExp | string) => screen.getByRole('columnheader', { name });
const clickSort = (name: RegExp | string) =>
  fireEvent.click(within(header(name)).getByRole('button'));

const multipleColumns: TableColumn<Row>[] = [
  { dataIndex: 'name', title: 'Name' },
  {
    dataIndex: 'chinese',
    sorter: { compare: (a, b) => a.chinese - b.chinese, multiple: 3 },
    title: 'Chinese',
  },
  {
    dataIndex: 'math',
    sorter: { compare: (a, b) => a.math - b.math, multiple: 2 },
    title: 'Math',
  },
];

describe('Table sorter: controlled sortOrder', () => {
  afterEach(cleanup);

  const Controlled = ({
    onChange,
    order,
  }: {
    onChange?: (sorter: any) => void;
    order: SortOrder;
  }) => (
    <Table
      dataSource={rows}
      pagination={false}
      columns={[
        {
          dataIndex: 'math',
          key: 'math',
          sortOrder: order,
          sorter: (a, b) => a.math - b.math,
          title: 'Math',
        },
        { dataIndex: 'name', title: 'Name' },
      ]}
      onChange={(_p, _f, sorter) => onChange?.(sorter)}
    />
  );

  test('the prop decides the order; clicks only report through onChange', () => {
    const onChange = vi.fn();
    const { rerender } = render(<Controlled order="descend" onChange={onChange} />);

    expect(header(/Math/).getAttribute('aria-sort')).toBe('descending');
    expect(screen.getAllByRole('row').slice(1)[0].textContent).toContain('99');

    clickSort(/Math/);
    // descend → next is "unsorted"; the order stays because it is controlled.
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ columnKey: undefined, order: undefined }),
    );
    expect(header(/Math/).getAttribute('aria-sort')).toBe('descending');

    rerender(<Controlled order={null} onChange={onChange} />);
    expect(header(/Math/).getAttribute('aria-sort')).toBe('none');
    expect(names()).toEqual(['60', '66', '98', '99']);

    rerender(<Controlled order="ascend" onChange={onChange} />);
    clickSort(/Math/);
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ columnKey: 'math', field: 'math', order: 'descend' }),
    );
  });

  test('a controlled null overrides defaultSortOrder', () => {
    render(
      <Table
        dataSource={rows}
        pagination={false}
        columns={[
          {
            dataIndex: 'name',
            defaultSortOrder: 'ascend',
            sortOrder: null,
            sorter: (a, b) => a.name.localeCompare(b.name),
            title: 'Name',
          },
        ]}
      />,
    );

    expect(names()).toEqual(['John', 'Jim', 'Joe', 'Jane']);
  });
});

describe('Table sorter: multiple', () => {
  afterEach(cleanup);

  test('clicks accumulate sorters and onChange reports an array', () => {
    const onChange = vi.fn();
    render(
      <Table columns={multipleColumns} dataSource={rows} pagination={false} onChange={onChange} />,
    );

    clickSort(/Math/);
    expect(onChange.mock.calls.at(-1)![2]).toMatchObject({
      columnKey: 'math',
      field: 'math',
      order: 'ascend',
    });

    clickSort(/Chinese/);
    clickSort(/Chinese/);
    const sorter = onChange.mock.calls.at(-1)![2] as TableSorterResult<Row>[];
    expect(Array.isArray(sorter)).toBe(true);
    expect(sorter.map(({ columnKey, field, order }) => ({ columnKey, field, order }))).toEqual([
      { columnKey: 'math', field: 'math', order: 'ascend' },
      { columnKey: 'chinese', field: 'chinese', order: 'descend' },
    ]);
    expect(sorter[1].column).toMatchObject({ dataIndex: 'chinese' });

    // Chinese (multiple 3) sorts first, ties broken by Math ascending.
    expect(names()).toEqual(['John', 'Jim', 'Jane', 'Joe']);
    expect(header(/Math/).getAttribute('aria-sort')).toBe('ascending');
    expect(header(/Chinese/).getAttribute('aria-sort')).toBe('descending');
  });

  test('defaultSortOrder seeds several multiple sorters', () => {
    render(
      <Table
        dataSource={rows}
        pagination={false}
        columns={[
          multipleColumns[0],
          { ...multipleColumns[1], defaultSortOrder: 'descend' },
          { ...multipleColumns[2], defaultSortOrder: 'descend' },
        ]}
      />,
    );

    expect(names()).toEqual(['Jim', 'John', 'Jane', 'Joe']);
  });

  test('a single sorter click replaces the multiple sort', () => {
    const onChange = vi.fn();
    render(
      <Table
        dataSource={rows}
        pagination={false}
        columns={[
          { dataIndex: 'name', sorter: (a, b) => a.name.localeCompare(b.name), title: 'Name' },
          ...multipleColumns.slice(1),
        ]}
        onChange={onChange}
      />,
    );

    clickSort(/Math/);
    clickSort(/Chinese/);
    clickSort(/Name/);

    expect(onChange.mock.calls.at(-1)![2]).toMatchObject({ columnKey: 'name', order: 'ascend' });
    expect(header(/Math/).getAttribute('aria-sort')).toBe('none');
    expect(header(/Chinese/).getAttribute('aria-sort')).toBe('none');
  });

  test('controlled multiple sortOrder applies every sorter', () => {
    render(
      <Table
        dataSource={rows}
        pagination={false}
        columns={[
          multipleColumns[0],
          { ...multipleColumns[1], sortOrder: 'descend' },
          { ...multipleColumns[2], sortOrder: 'descend' },
        ]}
      />,
    );

    expect(names()).toEqual(['Jim', 'John', 'Jane', 'Joe']);
  });
});

describe('Table sorter: compare function', () => {
  afterEach(cleanup);

  test('receives the sort order as its third argument', () => {
    const compare = vi.fn((a: Row, b: Row, _order?: SortOrder) => a.math - b.math);
    render(
      <Table
        columns={[{ dataIndex: 'math', sorter: compare, title: 'Math' }]}
        dataSource={rows}
        pagination={false}
      />,
    );

    clickSort(/Math/);
    expect(compare.mock.calls.at(-1)![2]).toBe('ascend');
    clickSort(/Math/);
    expect(compare.mock.calls.at(-1)![2]).toBe('descend');
  });
});

describe('Table sorter: sortDirections', () => {
  afterEach(cleanup);

  test('column sortDirections restricts the cycle and the carets', () => {
    const onChange = vi.fn();
    const { container } = render(
      <Table
        dataSource={rows}
        pagination={false}
        columns={[
          {
            dataIndex: 'math',
            sortDirections: ['descend'],
            sorter: (a, b) => a.math - b.math,
            title: 'Math',
          },
        ]}
        onChange={onChange}
      />,
    );

    expect(container.querySelectorAll('.lobe-table-column-sorter svg')).toHaveLength(1);

    clickSort(/Math/);
    expect(header(/Math/).getAttribute('aria-sort')).toBe('descending');
    clickSort(/Math/);
    expect(header(/Math/).getAttribute('aria-sort')).toBe('none');
    clickSort(/Math/);
    expect(header(/Math/).getAttribute('aria-sort')).toBe('descending');
    expect(onChange.mock.calls.map((call) => call[2].order)).toEqual([
      'descend',
      undefined,
      'descend',
    ]);
  });

  test('table sortDirections is the default and a column one wins', () => {
    render(
      <Table
        dataSource={rows}
        pagination={false}
        sortDirections={['descend', 'ascend']}
        columns={[
          { dataIndex: 'math', sorter: (a, b) => a.math - b.math, title: 'Math' },
          {
            dataIndex: 'chinese',
            sortDirections: ['ascend'],
            sorter: (a, b) => a.chinese - b.chinese,
            title: 'Chinese',
          },
        ]}
      />,
    );

    clickSort(/Math/);
    expect(header(/Math/).getAttribute('aria-sort')).toBe('descending');
    clickSort(/Math/);
    expect(header(/Math/).getAttribute('aria-sort')).toBe('ascending');
    clickSort(/Math/);
    expect(header(/Math/).getAttribute('aria-sort')).toBe('none');

    clickSort(/Chinese/);
    expect(header(/Chinese/).getAttribute('aria-sort')).toBe('ascending');
    clickSort(/Chinese/);
    expect(header(/Chinese/).getAttribute('aria-sort')).toBe('none');
  });

  test("['ascend', 'descend', 'ascend'] never returns to unsorted", () => {
    render(
      <Table
        dataSource={rows}
        pagination={false}
        columns={[
          {
            dataIndex: 'math',
            sortDirections: ['ascend', 'descend', 'ascend'],
            sorter: (a, b) => a.math - b.math,
            title: 'Math',
          },
        ]}
      />,
    );

    clickSort(/Math/);
    clickSort(/Math/);
    clickSort(/Math/);
    expect(header(/Math/).getAttribute('aria-sort')).toBe('ascending');
  });
});

describe('Table sorter: sortIcon', () => {
  afterEach(cleanup);

  test('replaces the carets and receives the current order', () => {
    const sortIcon = vi.fn(({ sortOrder }: { sortOrder: unknown }) => (
      <span data-testid="icon">{String(sortOrder)}</span>
    ));
    const { container } = render(
      <Table
        dataSource={rows}
        pagination={false}
        columns={[
          { dataIndex: 'math', sortIcon, sorter: (a, b) => a.math - b.math, title: 'Math' },
        ]}
      />,
    );

    expect(screen.getByTestId('icon').textContent).toBe('null');
    expect(container.querySelector('svg')).toBeNull();
    clickSort(/Math/);
    expect(screen.getByTestId('icon').textContent).toBe('ascend');
  });
});

describe('Table sorter: showSorterTooltip trigger', () => {
  afterEach(cleanup);

  const column: TableColumn<Row> = {
    dataIndex: 'math',
    sorter: (a, b) => a.math - b.math,
    title: 'Math',
  };
  const isOpenTrigger = (element: Element | null) => element!.hasAttribute('data-popup-open');

  test("the whole sort button is the trigger by default ('full-header')", () => {
    const { container } = render(
      <Table
        columns={[column]}
        dataSource={rows}
        pagination={false}
        showSorterTooltip={{ open: true }}
      />,
    );

    expect(isOpenTrigger(within(header(/Math/)).getByRole('button'))).toBe(true);
    expect(isOpenTrigger(container.querySelector('.lobe-table-column-sorter'))).toBe(false);
  });

  test("target: 'sorter-icon' moves the trigger to the icon", () => {
    const { container } = render(
      <Table
        columns={[column]}
        dataSource={rows}
        pagination={false}
        showSorterTooltip={{ open: true, target: 'sorter-icon' }}
      />,
    );

    expect(isOpenTrigger(within(header(/Math/)).getByRole('button'))).toBe(false);
    expect(isOpenTrigger(container.querySelector('.lobe-table-column-sorter'))).toBe(true);
  });

  test('false at the table or column level renders no tooltip trigger', () => {
    render(
      <Table
        dataSource={rows}
        pagination={false}
        showSorterTooltip={{ open: true }}
        columns={[
          column,
          {
            dataIndex: 'chinese',
            showSorterTooltip: false,
            sorter: (a, b) => a.chinese - b.chinese,
            title: 'Chinese',
          },
        ]}
      />,
    );

    expect(isOpenTrigger(within(header(/Math/)).getByRole('button'))).toBe(true);
    expect(
      within(header(/Chinese/))
        .getByRole('button')
        .hasAttribute('data-base-ui-tooltip-trigger'),
    ).toBe(false);
  });
});

describe('Table sorter: title props and tree data', () => {
  afterEach(cleanup);

  test('function titles receive sortColumns / sortColumn / sortOrder for multiple sorters', () => {
    const calls: TableColumnTitleProps<Row>[] = [];
    render(
      <Table
        dataSource={rows}
        pagination={false}
        columns={[
          {
            ...multipleColumns[1],
            title: (props) => {
              calls.push(props);
              return 'Chinese';
            },
          },
          multipleColumns[2],
        ]}
      />,
    );

    clickSort(/Math/);
    clickSort(/Chinese/);

    const last = calls.at(-1)!;
    expect(
      last.sortColumns!.map(({ column, order }) => [
        (column as { dataIndex?: string }).dataIndex,
        order,
      ]),
    ).toEqual([
      ['math', 'ascend'],
      ['chinese', 'ascend'],
    ]);
    expect(last.sortColumn).toMatchObject({ dataIndex: 'math' });
    expect(last.sortOrder).toBe('ascend');
  });

  test('sorts tree children recursively', () => {
    const tree: Row[] = [
      {
        children: [
          { chinese: 0, key: '1-1', math: 9, name: 'Child Z' },
          { chinese: 0, key: '1-2', math: 1, name: 'Child A' },
        ],
        chinese: 0,
        key: '1',
        math: 50,
        name: 'Parent',
      },
      { chinese: 0, key: '2', math: 10, name: 'Solo' },
    ];
    const { container } = render(
      <Table
        columns={[{ dataIndex: 'name', title: 'Name' }, { ...multipleColumns[2] }]}
        dataSource={tree}
        pagination={false}
      />,
    );

    // rc-table renders `children` as collapsible tree rows.
    fireEvent.click(container.querySelector('.lobe-table-row-expand-icon')!);
    expect(names()).toEqual(['Parent', 'Child Z', 'Child A', 'Solo']);

    clickSort(/Math/);
    expect(names()).toEqual(['Solo', 'Parent', 'Child A', 'Child Z']);
    clickSort(/Math/);
    expect(names()).toEqual(['Parent', 'Child Z', 'Child A', 'Solo']);
  });
});
