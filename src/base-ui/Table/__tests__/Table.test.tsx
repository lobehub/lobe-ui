import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';

import Table from '../Table';
import type { TableColumn } from '../type';

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    disconnect() {}
    observe() {}
    unobserve() {}
  } as any;
}

interface Row {
  id: string;
  model: string;
  provider: string;
  spend: number;
}

const rows: Row[] = [
  { id: '1', model: 'gpt-5', provider: 'OpenAI', spend: 30 },
  { id: '2', model: 'claude-sonnet-5', provider: 'Anthropic', spend: 10 },
  { id: '3', model: 'gemini-3-pro', provider: 'Google', spend: 20 },
];

const columns: TableColumn<Row>[] = [
  { dataIndex: 'model', sorter: (a, b) => a.model.localeCompare(b.model), title: 'Model' },
  { dataIndex: 'provider', title: 'Provider' },
  { align: 'right', dataIndex: 'spend', sorter: (a, b) => a.spend - b.spend, title: 'Spend' },
];

const bodyModels = () =>
  screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[0].textContent);

const manyRows = (count: number): Row[] =>
  Array.from({ length: count }, (_, index) => ({
    id: String(index),
    model: `m-${String(index).padStart(2, '0')}`,
    provider: 'P',
    spend: index,
  }));

describe('Table', () => {
  afterEach(cleanup);

  test('renders headers and rows', () => {
    render(<Table columns={columns} dataSource={rows} pagination={false} rowKey="id" />);

    expect(screen.getByRole('columnheader', { name: /Model/ })).toBeTruthy();
    expect(bodyModels()).toEqual(['gpt-5', 'claude-sonnet-5', 'gemini-3-pro']);
  });

  test('rowKey accepts a function', () => {
    const rowKey = vi.fn((row: Row) => row.id);
    render(<Table columns={columns} dataSource={rows} pagination={false} rowKey={rowKey} />);

    expect(rowKey).toHaveBeenCalled();
  });

  test('render receives value, record and index', () => {
    render(
      <Table
        dataSource={rows}
        pagination={false}
        rowKey="id"
        columns={[
          {
            dataIndex: 'spend',
            render: (value, record, index) => `${record.model}:${value}:${index}`,
            title: 'X',
          },
        ]}
      />,
    );

    expect(screen.getByText('gpt-5:30:0')).toBeTruthy();
    expect(screen.getByText('gemini-3-pro:20:2')).toBeTruthy();
  });

  test('header click cycles ascend → descend → none and follows aria-sort', () => {
    render(<Table columns={columns} dataSource={rows} pagination={false} rowKey="id" />);
    const header = screen.getByRole('columnheader', { name: /Spend/ });
    const button = within(header).getByRole('button');

    expect(header.getAttribute('aria-sort')).toBe('none');

    fireEvent.click(button);
    expect(header.getAttribute('aria-sort')).toBe('ascending');
    expect(bodyModels()).toEqual(['claude-sonnet-5', 'gemini-3-pro', 'gpt-5']);

    fireEvent.click(button);
    expect(header.getAttribute('aria-sort')).toBe('descending');
    expect(bodyModels()).toEqual(['gpt-5', 'gemini-3-pro', 'claude-sonnet-5']);

    fireEvent.click(button);
    expect(header.getAttribute('aria-sort')).toBe('none');
    expect(bodyModels()).toEqual(['gpt-5', 'claude-sonnet-5', 'gemini-3-pro']);
  });

  test('defaultSortOrder seeds the sort', () => {
    render(
      <Table
        columns={[{ ...columns[2], defaultSortOrder: 'descend' }]}
        dataSource={rows}
        pagination={false}
        rowKey="id"
      />,
    );

    expect(
      screen
        .getAllByRole('row')
        .slice(1)
        .map((row) => row.textContent),
    ).toEqual(['30', '20', '10']);
  });

  test('sorter: true keeps row order and reports the sort through onChange', () => {
    const onChange = vi.fn();
    render(
      <Table
        columns={[{ dataIndex: 'spend', key: 'spend', sorter: true, title: 'Spend' }]}
        dataSource={rows}
        pagination={false}
        rowKey="id"
        onChange={onChange}
      />,
    );

    fireEvent.click(
      within(screen.getByRole('columnheader', { name: /Spend/ })).getByRole('button'),
    );

    expect(
      screen
        .getAllByRole('row')
        .slice(1)
        .map((row) => row.textContent),
    ).toEqual(['30', '10', '20']);
    const sorter = onChange.mock.calls.at(-1)![2];
    expect(sorter).toMatchObject({ columnKey: 'spend', order: 'ascend' });
  });

  test('paginates locally with the default page size of 10', () => {
    render(<Table columns={columns} dataSource={manyRows(12)} rowKey="id" />);

    expect(screen.getAllByRole('row')).toHaveLength(11);
  });

  test('defaultCurrent and pageSize select the page', () => {
    render(
      <Table
        columns={columns}
        dataSource={manyRows(12)}
        pagination={{ defaultCurrent: 2, pageSize: 5 }}
        rowKey="id"
      />,
    );

    expect(bodyModels()).toEqual(['m-05', 'm-06', 'm-07', 'm-08', 'm-09']);
  });

  test('sorting resets to page 1', () => {
    render(
      <Table
        columns={columns}
        dataSource={manyRows(12)}
        pagination={{ defaultCurrent: 2, pageSize: 5 }}
        rowKey="id"
      />,
    );

    const spend = screen.getByRole('columnheader', { name: /Spend/ });
    fireEvent.click(within(spend).getByRole('button'));
    fireEvent.click(within(spend).getByRole('button'));

    expect(bodyModels()[0]).toBe('m-11');
  });

  test('shrinking dataSource clamps the page to the last existing page', () => {
    const { rerender } = render(
      <Table
        columns={columns}
        dataSource={manyRows(12)}
        pagination={{ defaultCurrent: 3, pageSize: 5 }}
        rowKey="id"
      />,
    );
    expect(bodyModels()).toEqual(['m-10', 'm-11']);

    rerender(
      <Table
        columns={columns}
        dataSource={manyRows(8)}
        pagination={{ defaultCurrent: 3, pageSize: 5 }}
        rowKey="id"
      />,
    );

    expect(bodyModels()).toEqual(['m-05', 'm-06', 'm-07']);
  });

  test('pagination.total switches to server pagination and keeps rows as given', () => {
    render(
      <Table
        columns={columns}
        dataSource={manyRows(5)}
        pagination={{ current: 3, pageSize: 5, total: 40 }}
        rowKey="id"
      />,
    );

    expect(bodyModels()).toEqual(['m-00', 'm-01', 'm-02', 'm-03', 'm-04']);
  });

  test('pagination={false} renders every row and no pager', () => {
    render(<Table columns={columns} dataSource={manyRows(15)} pagination={false} rowKey="id" />);

    expect(screen.getAllByRole('row')).toHaveLength(16);
    expect(screen.queryByRole('navigation')).toBeNull();
  });

  test('onRow click fires and rowClassName applies', () => {
    const onClick = vi.fn();
    render(
      <Table
        columns={columns}
        dataSource={rows}
        pagination={false}
        rowClassName={(record) => `row-${record.id}`}
        rowKey="id"
        onRow={(record) => ({ onClick: () => onClick(record.id) })}
      />,
    );

    const firstRow = screen.getAllByRole('row')[1];
    fireEvent.click(firstRow);

    expect(onClick).toHaveBeenCalledWith('1');
    expect(firstRow.className).toContain('row-1');
  });

  test('loading keeps rows and shows the overlay', () => {
    const { container } = render(
      <Table loading columns={columns} dataSource={rows} pagination={false} rowKey="id" />,
    );

    expect(bodyModels()).toHaveLength(3);
    expect(container.querySelector('[data-table-loading]')).toBeTruthy();
  });

  test('empty data shows emptyText', () => {
    render(<Table columns={columns} dataSource={[]} emptyText="Nothing here" rowKey="id" />);

    expect(screen.getByText('Nothing here')).toBeTruthy();
  });

  test('scroll.y limits the wrapper height', () => {
    const { container } = render(
      <Table
        columns={columns}
        dataSource={rows}
        pagination={false}
        rowKey="id"
        scroll={{ y: 200 }}
      />,
    );

    expect(container.querySelector('[data-table-wrapper]')!.getAttribute('style')).toContain(
      'max-height: 200px',
    );
  });

  test('controlled current past the last page renders the last page and asks the parent to move', () => {
    const onPageChange = vi.fn();
    render(
      <Table
        columns={columns}
        dataSource={manyRows(5)}
        pagination={{ current: 3, onChange: onPageChange, pageSize: 5 }}
        rowKey="id"
      />,
    );

    expect(bodyModels()).toEqual(['m-00', 'm-01', 'm-02', 'm-03', 'm-04']);
    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(onPageChange).toHaveBeenCalledWith(1, 5);
  });

  test('shift-click does not add a second sorted column', () => {
    const onChange = vi.fn();
    render(
      <Table
        columns={columns}
        dataSource={rows}
        pagination={false}
        rowKey="id"
        onChange={onChange}
      />,
    );
    const spend = screen.getByRole('columnheader', { name: /Spend/ });
    const model = screen.getByRole('columnheader', { name: /Model/ });

    fireEvent.click(within(spend).getByRole('button'));
    fireEvent.click(within(model).getByRole('button'), { shiftKey: true });

    expect(spend.getAttribute('aria-sort')).toBe('none');
    expect(model.getAttribute('aria-sort')).toBe('ascending');
    expect(onChange.mock.calls.at(-1)![2]).toMatchObject({ columnKey: 'model', order: 'ascend' });
  });

  test('a key-only column with a comparator sorts', () => {
    render(
      <Table
        dataSource={rows}
        pagination={false}
        rowKey="id"
        columns={[
          {
            key: 'double',
            render: (_, record) => String(record.spend * 2),
            sorter: (a, b) => a.spend - b.spend,
            title: 'Double',
          },
        ]}
      />,
    );

    fireEvent.click(
      within(screen.getByRole('columnheader', { name: /Double/ })).getByRole('button'),
    );

    expect(
      screen
        .getAllByRole('row')
        .slice(1)
        .map((row) => row.textContent),
    ).toEqual(['20', '40', '60']);
  });

  test('fixed right columns are sticky at the right edge', () => {
    render(
      <Table
        dataSource={rows}
        pagination={false}
        rowKey="id"
        columns={[
          ...columns,
          { fixed: 'right', key: 'action', render: () => 'Open', title: 'Action', width: 80 },
        ]}
      />,
    );

    const cell = screen.getAllByText('Open')[0].closest('td')!;
    expect(cell.getAttribute('style')).toContain('position: sticky');
    expect(cell.getAttribute('style')).toContain('right: 0px');
  });
});
