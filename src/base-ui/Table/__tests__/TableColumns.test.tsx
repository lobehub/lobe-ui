import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';

import Table from '../Table';
import type { TableColumn, TableColumnTitleProps } from '../type';

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    disconnect() {}
    observe() {}
    unobserve() {}
  } as any;
}

interface Row {
  address: { city: string; street: string };
  age: number;
  key: string;
  name: string;
}

const rows: Row[] = [
  { address: { city: 'Paris', street: 'Rue A' }, age: 32, key: 'a', name: 'Ada' },
  { address: { city: 'Oslo', street: 'Gate B' }, age: 25, key: 'b', name: 'Bob' },
  { address: { city: 'Rome', street: 'Via C' }, age: 41, key: 'c', name: 'Cy' },
];

const headerRows = (container: HTMLElement) =>
  [...container.querySelectorAll('thead > tr')] as HTMLTableRowElement[];
const headerTexts = (row: HTMLTableRowElement) =>
  [...row.querySelectorAll('th')].map((th) => th.textContent);
const bodyRows = (container: HTMLElement) =>
  [...container.querySelectorAll('tbody > tr:not([aria-hidden])')].filter(
    (row) => !row.classList.contains('lobe-table-measure-row'),
  ) as HTMLTableRowElement[];
const bodyTexts = (container: HTMLElement) =>
  bodyRows(container).map((row) => [...row.children].map((cell) => cell.textContent));

const groupedColumns: TableColumn<Row>[] = [
  { dataIndex: 'name', title: 'Name' },
  {
    children: [
      { dataIndex: ['address', 'street'], title: 'Street' },
      { dataIndex: ['address', 'city'], title: 'City' },
    ],
    title: 'Address',
  },
];

describe('Table columns: grouping', () => {
  afterEach(cleanup);

  test('columns.children renders a multi-row header with spans', () => {
    const { container } = render(
      <Table columns={groupedColumns} dataSource={rows} pagination={false} />,
    );

    const [top, bottom] = headerRows(container);
    expect(headerTexts(top)).toEqual(['Name', 'Address']);
    expect(headerTexts(bottom)).toEqual(['Street', 'City']);
    expect(top.querySelectorAll('th')[0].getAttribute('rowspan')).toBe('2');
    expect(top.querySelectorAll('th')[1].getAttribute('colspan')).toBe('2');
    expect(bodyTexts(container)[0]).toEqual(['Ada', 'Rue A', 'Paris']);
  });

  test('Table.Column / Table.ColumnGroup JSX builds the same columns', () => {
    const { container } = render(
      <Table<Row> dataSource={rows} pagination={false}>
        <Table.Column dataIndex="name" key="name" title="Name" />
        <Table.ColumnGroup title="Address">
          <Table.Column dataIndex={['address', 'street']} key="street" title="Street" />
          <Table.Column dataIndex={['address', 'city']} key="city" title="City" />
        </Table.ColumnGroup>
      </Table>,
    );

    const [top, bottom] = headerRows(container);
    expect(headerTexts(top)).toEqual(['Name', 'Address']);
    expect(headerTexts(bottom)).toEqual(['Street', 'City']);
    expect(bodyTexts(container)[1]).toEqual(['Bob', 'Gate B', 'Oslo']);
  });

  test('a sorter inside a group sorts and reports the nested column', () => {
    const onChange = vi.fn();
    const { container } = render(
      <Table
        dataSource={rows}
        pagination={false}
        columns={[
          { dataIndex: 'name', title: 'Name' },
          {
            children: [
              { dataIndex: 'age', sorter: (a: Row, b: Row) => a.age - b.age, title: 'Age' },
            ],
            title: 'Info',
          },
        ]}
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Age' }));

    expect(bodyTexts(container).map((cells) => cells[0])).toEqual(['Bob', 'Ada', 'Cy']);
    expect(onChange.mock.calls.at(-1)![2]).toMatchObject({ columnKey: 'age', order: 'ascend' });
  });
});

describe('Table columns: cell merging', () => {
  afterEach(cleanup);

  test('header colSpan merges header cells and 0 hides one', () => {
    const { container } = render(
      <Table
        dataSource={rows}
        pagination={false}
        columns={[
          { colSpan: 2, dataIndex: 'name', title: 'Person' },
          { colSpan: 0, dataIndex: 'age', title: 'Age' },
        ]}
      />,
    );

    const [header] = headerRows(container);
    expect(headerTexts(header)).toEqual(['Person']);
    expect(header.querySelector('th')!.getAttribute('colspan')).toBe('2');
  });

  test('onCell colSpan / rowSpan of 0 skips the cell', () => {
    const { container } = render(
      <Table
        dataSource={rows}
        pagination={false}
        columns={[
          {
            dataIndex: 'name',
            onCell: (_, index) =>
              index === 0 ? { colSpan: 2 } : index === 1 ? { rowSpan: 2 } : { rowSpan: 0 },
            title: 'Name',
          },
          {
            dataIndex: 'age',
            onCell: (_, index) => (index === 0 ? { colSpan: 0 } : {}),
            title: 'Age',
          },
        ]}
      />,
    );

    const [first, second, third] = bodyRows(container);
    expect(first.children).toHaveLength(1);
    expect(first.children[0].getAttribute('colspan')).toBe('2');
    expect(second.children[0].getAttribute('rowspan')).toBe('2');
    expect([...third.children].map((cell) => cell.textContent)).toEqual(['41']);
  });

  test('render may return a RenderedCell with span props', () => {
    const { container } = render(
      <Table
        dataSource={rows}
        pagination={false}
        columns={[
          {
            dataIndex: 'name',
            render: (value: string, _record, index) =>
              index === 0 ? { children: `${value}!`, props: { colSpan: 2 } } : value,
            title: 'Name',
          },
          {
            dataIndex: 'age',
            render: (value: number, _record, index) =>
              index === 0 ? { children: value, props: { colSpan: 0 } } : value,
            title: 'Age',
          },
        ]}
      />,
    );

    const [first, second] = bodyRows(container);
    expect([...first.children].map((cell) => cell.textContent)).toEqual(['Ada!']);
    expect(first.children[0].getAttribute('colspan')).toBe('2');
    expect(second.children).toHaveLength(2);
  });

  test('rowScope renders row header cells', () => {
    const { container } = render(
      <Table
        dataSource={rows}
        pagination={false}
        columns={[
          { dataIndex: 'name', rowScope: 'row', title: 'Name' },
          { dataIndex: 'age', title: 'Age' },
        ]}
      />,
    );

    const [first] = bodyRows(container);
    expect(first.children[0].tagName).toBe('TH');
    expect(first.children[0].getAttribute('scope')).toBe('row');
    expect(first.children[1].tagName).toBe('TD');
  });
});

describe('Table columns: column props', () => {
  afterEach(cleanup);

  test('onHeaderCell attributes merge with the sort aria attribute', () => {
    const onHeaderCell = vi.fn(() => ({ 'data-testid': 'age-header' }));
    render(
      <Table
        dataSource={rows}
        pagination={false}
        columns={[
          {
            dataIndex: 'age',
            onHeaderCell,
            sorter: (a: Row, b: Row) => a.age - b.age,
            title: 'Age',
          },
        ]}
      />,
    );

    const header = screen.getByTestId('age-header');
    expect(header.getAttribute('aria-sort')).toBe('none');
    expect(onHeaderCell).toHaveBeenCalledWith(expect.objectContaining({ dataIndex: 'age' }));
  });

  test('title can be a function receiving antd ColumnTitleProps', () => {
    const calls: TableColumnTitleProps<Row>[] = [];
    render(
      <Table
        dataSource={rows}
        pagination={false}
        columns={[
          {
            dataIndex: 'age',
            sorter: (a: Row, b: Row) => a.age - b.age,
            title: (props) => {
              calls.push(props);
              return props.sortOrder ? `Age (${props.sortOrder})` : 'Age';
            },
          },
        ]}
      />,
    );

    expect(calls.at(-1)).toEqual({
      filters: {},
      sortColumn: undefined,
      sortColumns: [],
      sortOrder: undefined,
    });

    fireEvent.click(screen.getByRole('button', { name: 'Age' }));

    expect(screen.getByRole('button', { name: 'Age (ascend)' })).toBeTruthy();
    expect(calls.at(-1)!.sortColumns).toEqual([
      { column: expect.objectContaining({ dataIndex: 'age' }), order: 'ascend' },
    ]);
  });

  test('hidden columns are not rendered', () => {
    const { container } = render(
      <Table
        dataSource={rows}
        pagination={false}
        columns={[
          { dataIndex: 'name', title: 'Name' },
          { dataIndex: 'age', hidden: true, title: 'Age' },
        ]}
      />,
    );

    expect(headerTexts(headerRows(container)[0])).toEqual(['Name']);
    expect(bodyTexts(container)[0]).toEqual(['Ada']);
  });

  test('minWidth is applied to the col with auto layout', () => {
    const { container } = render(
      <Table
        columns={[{ dataIndex: 'name', minWidth: 120, title: 'Name' }]}
        dataSource={rows}
        pagination={false}
      />,
    );

    expect(container.querySelector('col')!.getAttribute('style')).toContain('min-width: 120px');
  });

  test('shouldCellUpdate=false skips re-rendering cells for new records', () => {
    const renderName = vi.fn((value: string) => value);
    const renderAge = vi.fn((value: number) => value);
    const columns: TableColumn<Row>[] = [
      { dataIndex: 'name', render: renderName, shouldCellUpdate: () => false, title: 'Name' },
      { dataIndex: 'age', render: renderAge, title: 'Age' },
    ];
    const { rerender } = render(<Table columns={columns} dataSource={rows} pagination={false} />);
    const nameCalls = renderName.mock.calls.length;
    const ageCalls = renderAge.mock.calls.length;

    rerender(
      <Table columns={columns} dataSource={rows.map((row) => ({ ...row }))} pagination={false} />,
    );

    expect(renderName.mock.calls.length).toBe(nameCalls);
    expect(renderAge.mock.calls.length).toBeGreaterThan(ageCalls);
  });

  test('rowKey defaults to the record key', () => {
    const onRow = vi.fn(() => ({}));
    const { container } = render(
      <Table
        columns={[{ dataIndex: 'name', title: 'Name' }]}
        dataSource={rows}
        pagination={false}
        onRow={onRow}
      />,
    );

    expect(bodyRows(container).map((row) => row.dataset.rowKey)).toEqual(['a', 'b', 'c']);
  });

  test('table-level column defaults fill every column; own fields win', () => {
    const { container } = render(
      <Table
        column={{ align: 'center', ellipsis: true }}
        dataSource={rows}
        pagination={false}
        columns={[
          { dataIndex: 'name', title: 'Name' },
          { align: 'right', dataIndex: 'age', title: 'Age' },
        ]}
      />,
    );

    const [name, age] = bodyRows(container)[0].children as unknown as HTMLElement[];
    expect(name.style.textAlign).toBe('center');
    expect(age.style.textAlign).toBe('right');
    expect(name.classList.contains('lobe-table-cell-ellipsis')).toBe(true);
    expect(age.classList.contains('lobe-table-cell-ellipsis')).toBe(true);
  });
});

describe('Table columns: ellipsis', () => {
  afterEach(cleanup);

  test('cells and headers truncate and get a native title', () => {
    const { container } = render(
      <Table
        dataSource={rows}
        pagination={false}
        columns={[
          { dataIndex: 'name', ellipsis: true, title: 'Name' },
          {
            dataIndex: 'age',
            ellipsis: true,
            sorter: (a: Row, b: Row) => a.age - b.age,
            title: 'Age',
          },
        ]}
      />,
    );

    const [nameHeader, ageHeader] = headerRows(container)[0].querySelectorAll('th');
    expect(nameHeader.classList.contains('lobe-table-cell-ellipsis')).toBe(true);
    expect(nameHeader.getAttribute('title')).toBe('Name');
    expect(nameHeader.querySelector('.lobe-table-column-title')).toBeTruthy();
    expect(ageHeader.getAttribute('title')).toBe('Age');

    const [nameCell] = bodyRows(container)[0].children;
    expect(nameCell.classList.contains('lobe-table-cell-ellipsis')).toBe(true);
    expect(nameCell.getAttribute('title')).toBe('Ada');
  });

  test('showTitle: false drops the cell title but still truncates', () => {
    const { container } = render(
      <Table
        columns={[{ dataIndex: 'name', ellipsis: { showTitle: false }, title: 'Name' }]}
        dataSource={rows}
        pagination={false}
      />,
    );

    const [nameCell] = bodyRows(container)[0].children;
    expect(nameCell.classList.contains('lobe-table-cell-ellipsis')).toBe(true);
    expect(nameCell.hasAttribute('title')).toBe(false);
  });
});

describe('Table columns: fixed', () => {
  afterEach(cleanup);

  test.each([
    [true, 'start'],
    ['left', 'start'],
    ['start', 'start'],
    ['right', 'end'],
    ['end', 'end'],
  ] as const)('fixed=%s pins to the %s edge', (fixed, edge) => {
    const { container } = render(
      <Table
        dataSource={rows}
        pagination={false}
        scroll={{ x: 800 }}
        columns={[
          { dataIndex: 'name', fixed, title: 'Name', width: 100 },
          { dataIndex: 'age', title: 'Age' },
        ]}
      />,
    );

    const nameCell = bodyRows(container)[0].children[0] as HTMLElement;
    expect(nameCell.classList.contains(`lobe-table-cell-fix-${edge}`)).toBe(true);
    expect(nameCell.classList.contains('lobe-table-cell-fix')).toBe(true);
    expect(nameCell.getAttribute('style')).toContain(`inset-inline-${edge}: 0`);
  });

  test('non-adjacent start columns stack and the table gets has-fix classes', () => {
    const { container } = render(
      <Table
        dataSource={rows}
        pagination={false}
        scroll={{ x: 'max-content' }}
        columns={[
          { dataIndex: 'name', fixed: 'start', title: 'Name', width: 100 },
          { dataIndex: 'age', title: 'Age', width: 100 },
          { dataIndex: ['address', 'city'], fixed: 'start', title: 'City', width: 100 },
          { dataIndex: ['address', 'street'], fixed: 'end', title: 'Street', width: 100 },
        ]}
      />,
    );

    const cells = bodyRows(container)[0].children as unknown as HTMLElement[];
    const insetStart = (cell: HTMLElement) =>
      /inset-inline-start: ([^;]+)/.exec(cell.getAttribute('style') ?? '')?.[1];
    expect(cells[0].classList.contains('lobe-table-cell-fix-start')).toBe(true);
    expect(insetStart(cells[0])).toBe('0px');
    expect(cells[1].classList.contains('lobe-table-cell-fix')).toBe(false);
    expect(cells[2].classList.contains('lobe-table-cell-fix-start')).toBe(true);
    // Stacked after the first pinned column (widths are 0 in jsdom, so only presence is checked).
    expect(insetStart(cells[2])).toBeDefined();
    expect(cells[3].classList.contains('lobe-table-cell-fix-end')).toBe(true);

    const table = container.querySelector('.lobe-table')!;
    expect(table.classList.contains('lobe-table-has-fix-start')).toBe(true);
    expect(table.classList.contains('lobe-table-has-fix-end')).toBe(true);
  });

  test('fixed in a nested group switches to fixed layout', () => {
    const { container } = render(
      <Table
        dataSource={rows}
        pagination={false}
        columns={[
          {
            children: [{ dataIndex: 'name', fixed: 'start', title: 'Name', width: 100 }],
            title: 'Group',
          },
          { dataIndex: 'age', title: 'Age' },
        ]}
      />,
    );

    expect(container.querySelector('table')!.getAttribute('style')).toContain(
      'table-layout: fixed',
    );
  });
});

describe('Table columns: responsive', () => {
  const listeners = new Set<() => void>();
  let width = 1024;
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    window.matchMedia = ((query: string) => {
      const [, kind, px] = /\((min|max)-width: (\d+)px\)/.exec(query)!;
      return {
        addEventListener: (_: string, listener: () => void) => listeners.add(listener),
        get matches() {
          return kind === 'min' ? width >= Number(px) : width <= Number(px);
        },
        media: query,
        removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
      };
    }) as unknown as typeof window.matchMedia;
  });

  afterEach(() => {
    cleanup();
    listeners.clear();
    window.matchMedia = originalMatchMedia;
    width = 1024;
  });

  test('columns show only at their breakpoints and follow media changes', () => {
    const { container } = render(
      <Table
        dataSource={rows}
        pagination={false}
        columns={[
          { dataIndex: 'name', title: 'Name' },
          { dataIndex: 'age', responsive: ['md'], title: 'Age' },
          { dataIndex: ['address', 'city'], responsive: ['lg'], title: 'City' },
        ]}
      />,
    );

    expect(headerTexts(headerRows(container)[0])).toEqual(['Name', 'Age', 'City']);

    width = 800;
    act(() => listeners.forEach((listener) => listener()));
    expect(headerTexts(headerRows(container)[0])).toEqual(['Name', 'Age']);

    width = 400;
    act(() => listeners.forEach((listener) => listener()));
    expect(headerTexts(headerRows(container)[0])).toEqual(['Name']);
    expect(within(bodyRows(container)[0]).getByText('Ada')).toBeTruthy();
  });
});
