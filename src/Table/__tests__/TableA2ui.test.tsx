import { cleanup, fireEvent, render as rtlRender, screen } from '@testing-library/react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

import ConfigProvider from '@/ConfigProvider';

import Table from '../Table';

const MotionWrapper = ({ children }: { children: ReactNode }) => (
  <ConfigProvider motion={motion}>{children}</ConfigProvider>
);
const render: typeof rtlRender = ((ui: any, options?: any) =>
  rtlRender(ui, { wrapper: MotionWrapper, ...options })) as typeof rtlRender;

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    disconnect() {}
    observe() {}
    unobserve() {}
  } as any;
}

interface Row {
  account: string;
  mrr: number;
}

const rows: Row[] = [
  { account: 'Northwind Labs', mrr: 12_400 },
  { account: 'Kestrel Robotics', mrr: 6850 },
  { account: 'Helix Health', mrr: 9800 },
  { account: 'Lumen Studio', mrr: 1240 },
  { account: 'Orbit Freight', mrr: 4300 },
  { account: 'Kestrel AI', mrr: 890 },
];

const columns = [
  { dataIndex: 'account', key: 'account', title: 'Account' },
  { align: 'right' as const, dataIndex: 'mrr', key: 'mrr', title: 'MRR' },
];

const renderA2ui = (props: Record<string, unknown> = {}) =>
  render(
    <Table<Row>
      searchable
      columns={columns}
      dataSource={rows}
      pagination={{ pageSize: 4 }}
      rowKey="account"
      title={() => 'Top accounts'}
      variant="a2ui"
      {...props}
    />,
  );

describe('Table variant="a2ui"', () => {
  afterEach(cleanup);

  it('renders the card header with title, row count and search box', () => {
    const { container } = renderA2ui();
    expect(container.querySelector('.lobe-table-wrapper-a2ui')).toBeTruthy();
    expect(container.querySelector('.lobe-table-a2ui')).toBeTruthy();
    expect(screen.getByText('Top accounts')).toBeTruthy();
    expect(screen.getByText('6 rows')).toBeTruthy();
    expect(screen.getByRole('searchbox', { name: 'Search rows' })).toBeTruthy();
  });

  it('pages with the compact pager', () => {
    renderA2ui();
    expect(screen.getByText('1-4 of 6')).toBeTruthy();
    expect(screen.getByText('1 / 2')).toBeTruthy();
    expect(
      (screen.getByRole('button', { name: 'Previous page' }) as HTMLButtonElement).disabled,
    ).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByText('5-6 of 6')).toBeTruthy();
    expect(screen.getByText('Kestrel AI')).toBeTruthy();
  });

  it('filters rows from the search box and keeps the total count', () => {
    renderA2ui();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'kestrel' } });
    expect(screen.getByText('Kestrel Robotics')).toBeTruthy();
    expect(screen.getByText('Kestrel AI')).toBeTruthy();
    expect(screen.queryByText('Northwind Labs')).toBeNull();
    expect(screen.getByText('6 rows')).toBeTruthy();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'zzz' } });
    expect(screen.getByText('No rows match your search')).toBeTruthy();
  });

  it('marks right-aligned cells and leaves other variants without the a2ui chrome', () => {
    const { container } = renderA2ui();
    expect(container.querySelector('td[data-align="right"]')?.textContent).toBe('12400');
    cleanup();
    const plain = render(
      <Table<Row> searchable columns={columns} dataSource={rows} rowKey="account" />,
    );
    expect(plain.container.querySelector('.lobe-table-wrapper-a2ui')).toBeNull();
    expect(plain.container.querySelector('input[type="search"]')).toBeNull();
  });
});
