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
}

const rows: Row[] = Array.from({ length: 12 }, (_, index) => ({
  id: String(index),
  model: `m-${String(index).padStart(2, '0')}`,
  provider: index % 3 === 0 ? 'OpenAI' : 'Other',
}));

const columns: TableColumn<Row>[] = [
  { dataIndex: 'model', title: 'Model' },
  {
    dataIndex: 'provider',
    filters: [
      { text: 'OpenAI', value: 'OpenAI' },
      { text: 'Other', value: 'Other' },
    ],
    onFilter: (value, record) => record.provider === value,
    title: 'Provider',
  },
];

const bodyModels = () =>
  screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[0].textContent);

describe('Table filters', () => {
  afterEach(cleanup);

  test('toggling a filter item filters rows and reports through onChange', () => {
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

    fireEvent.click(screen.getByRole('button', { name: 'Filter Provider' }));
    fireEvent.click(screen.getByRole('menuitemcheckbox', { name: 'OpenAI' }));

    expect(bodyModels()).toEqual(['m-00', 'm-03', 'm-06', 'm-09']);
    expect(onChange.mock.calls.at(-1)![1]).toEqual({ provider: ['OpenAI'] });
  });

  test('reset clears the filter', () => {
    render(<Table columns={columns} dataSource={rows} pagination={false} rowKey="id" />);

    fireEvent.click(screen.getByRole('button', { name: 'Filter Provider' }));
    fireEvent.click(screen.getByRole('menuitemcheckbox', { name: 'OpenAI' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Reset' }));

    expect(bodyModels()).toHaveLength(12);
  });

  test('filtering from a later page returns to page 1', () => {
    render(
      <Table
        columns={columns}
        dataSource={rows}
        pagination={{ defaultCurrent: 3, pageSize: 5 }}
        rowKey="id"
      />,
    );
    expect(bodyModels()).toEqual(['m-10', 'm-11']);

    fireEvent.click(screen.getByRole('button', { name: 'Filter Provider' }));
    fireEvent.click(screen.getByRole('menuitemcheckbox', { name: 'OpenAI' }));

    expect(bodyModels()).toEqual(['m-00', 'm-03', 'm-06', 'm-09']);
  });
});
