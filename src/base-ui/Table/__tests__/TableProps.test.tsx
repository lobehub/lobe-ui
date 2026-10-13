import { cleanup, fireEvent, render as rtlRender, screen, within } from '@testing-library/react';
import { motion } from 'motion/react';
import type { HTMLAttributes, ReactNode, RefObject } from 'react';

import ConfigProvider from '@/ConfigProvider';

import Table from '../Table';
import type { TableColumn, TableRef } from '../type';

// Base-ui buttons (ActionIcon in the expand / filter triggers) read the motion component from
// ConfigProvider, so every render (and rerender) goes through it.
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
  id: string;
  model: string;
  spend: number;
}

const rows: Row[] = Array.from({ length: 12 }, (_, index) => ({
  id: String(index),
  model: `m-${String(index).padStart(2, '0')}`,
  spend: index,
}));

const columns: TableColumn<Row>[] = [
  { dataIndex: 'model', title: 'Model' },
  { align: 'right', dataIndex: 'spend', title: 'Spend' },
];

const rootTable = (container: HTMLElement) => container.querySelector('.lobe-table')!;
const tableStyle = (container: HTMLElement) =>
  container.querySelector('table')!.getAttribute('style') ?? '';

describe('Table-level props', () => {
  afterEach(cleanup);

  test.each([
    ['large', 'lobe-table-large'],
    ['medium', 'lobe-table-medium'],
    ['middle', 'lobe-table-medium'],
    ['small', 'lobe-table-small'],
  ] as const)('size=%s renders %s', (size, className) => {
    const { container } = render(
      <Table columns={columns} dataSource={rows} pagination={false} rowKey="id" size={size} />,
    );

    expect(rootTable(container).classList.contains(className)).toBe(true);
  });

  test('size defaults to medium (middle)', () => {
    const { container } = render(
      <Table columns={columns} dataSource={rows} pagination={false} rowKey="id" />,
    );

    expect(rootTable(container).classList.contains('lobe-table-medium')).toBe(true);
  });

  test('variant outlined adds the outlined class', () => {
    const { container } = render(
      <Table
        columns={columns}
        dataSource={rows}
        pagination={false}
        rowKey="id"
        variant="outlined"
      />,
    );

    expect(rootTable(container).classList.contains('lobe-table-outlined')).toBe(true);
  });

  test('loading accepts a Spin config object and shows its tip', () => {
    const { container } = render(
      <Table
        columns={columns}
        dataSource={rows}
        loading={{ tip: 'Fetching…' }}
        pagination={false}
        rowKey="id"
      />,
    );

    const overlay = container.querySelector('[data-table-loading]')!;
    expect(overlay).toBeTruthy();
    expect(within(overlay as HTMLElement).getByRole('status')).toBeTruthy();
    expect(overlay.textContent).toContain('Fetching…');
  });

  test('loading={{ spinning: false }} hides the overlay', () => {
    const { container } = render(
      <Table
        columns={columns}
        dataSource={rows}
        loading={{ spinning: false }}
        pagination={false}
        rowKey="id"
      />,
    );

    expect(container.querySelector('[data-table-loading]')).toBeNull();
  });

  test('loading with no rows shows the spinner in place of the empty text', () => {
    render(<Table loading columns={columns} dataSource={[]} emptyText="Nothing" rowKey="id" />);

    expect(screen.queryByText('Nothing')).toBeNull();
    expect(screen.getByRole('status')).toBeTruthy();
  });

  test('title and footer receive the current page data', () => {
    const title = vi.fn((data: readonly Row[]) => `title:${data.length}`);
    const footer = vi.fn((data: readonly Row[]) => `footer:${data[0].model}`);
    const { container } = render(
      <Table
        columns={columns}
        dataSource={rows}
        footer={footer}
        pagination={{ defaultCurrent: 2, pageSize: 5 }}
        rowKey="id"
        title={title}
      />,
    );

    expect(container.querySelector('.lobe-table-title')!.textContent).toBe('title:5');
    expect(container.querySelector('.lobe-table-footer')!.textContent).toBe('footer:m-05');
  });

  test('showHeader={false} hides the header row', () => {
    render(
      <Table
        columns={columns}
        dataSource={rows}
        pagination={false}
        rowKey="id"
        showHeader={false}
      />,
    );

    expect(screen.queryByRole('columnheader')).toBeNull();
    expect(screen.getAllByRole('row')).toHaveLength(12);
  });

  test('rowHoverable toggles the hover class on cells', () => {
    const { container, unmount } = render(
      <Table columns={columns} dataSource={rows} pagination={false} rowKey="id" />,
    );
    const cell = container.querySelector('.lobe-table-tbody td')!;
    fireEvent.mouseEnter(cell);
    expect(cell.classList.contains('lobe-table-cell-row-hover')).toBe(true);
    unmount();

    const { container: off } = render(
      <Table
        columns={columns}
        dataSource={rows}
        pagination={false}
        rowHoverable={false}
        rowKey="id"
      />,
    );
    const offCell = off.querySelector('.lobe-table-tbody td')!;
    fireEvent.mouseEnter(offCell);
    expect(offCell.classList.contains('lobe-table-cell-row-hover')).toBe(false);
  });

  test('components overrides body rows and header cells', () => {
    const BodyRow = (props: HTMLAttributes<HTMLTableRowElement>) => (
      <tr data-custom-row="" {...props} />
    );
    const HeaderCell = (props: HTMLAttributes<HTMLTableCellElement>) => (
      <th data-custom-header="" {...props} />
    );
    const { container } = render(
      <Table
        columns={columns}
        components={{ body: { row: BodyRow }, header: { cell: HeaderCell } }}
        dataSource={rows.slice(0, 3)}
        pagination={false}
        rowKey="id"
      />,
    );

    expect(container.querySelectorAll('[data-custom-row]')).toHaveLength(3);
    expect(container.querySelectorAll('[data-custom-header]')).toHaveLength(2);
  });

  test('onHeaderRow props land on the header row', () => {
    const onHeaderRow = vi.fn(() => ({ 'data-header-row': 'yes' }) as any);
    const { container } = render(
      <Table
        columns={columns}
        dataSource={rows}
        pagination={false}
        rowKey="id"
        onHeaderRow={onHeaderRow}
      />,
    );

    expect(onHeaderRow).toHaveBeenCalled();
    expect((onHeaderRow.mock.calls[0] as any[])[0]).toHaveLength(2);
    expect(container.querySelector('thead tr[data-header-row="yes"]')).toBeTruthy();
  });

  test('onScroll fires when the scroll container scrolls', () => {
    const onScroll = vi.fn();
    const { container } = render(
      <Table
        columns={columns}
        dataSource={rows}
        pagination={false}
        rowKey="id"
        scroll={{ y: 100 }}
        onScroll={onScroll}
      />,
    );

    fireEvent.scroll(container.querySelector('.lobe-table-body')!, { target: { scrollTop: 40 } });
    expect(onScroll).toHaveBeenCalled();
  });

  test('scroll.x = true lets the table grow but never narrower than the container', () => {
    const { container } = render(
      <Table
        columns={columns}
        dataSource={rows}
        pagination={false}
        rowKey="id"
        scroll={{ x: true }}
      />,
    );

    expect(tableStyle(container)).toContain('width: auto');
    expect(tableStyle(container)).toContain('min-width: 100%');
    expect(rootTable(container).classList.contains('lobe-table-scroll-horizontal')).toBe(true);
  });

  test('tableLayout defaults to fixed with fixed or ellipsis columns', () => {
    const { container, unmount } = render(
      <Table
        columns={[...columns, { fixed: 'right', key: 'op', render: () => 'Open', width: 80 }]}
        dataSource={rows}
        pagination={false}
        rowKey="id"
      />,
    );
    expect(tableStyle(container)).toContain('table-layout: fixed');
    unmount();

    const { container: ellipsis, unmount: unmountEllipsis } = render(
      <Table
        columns={[{ dataIndex: 'model', ellipsis: true, title: 'Model' }]}
        dataSource={rows}
        pagination={false}
        rowKey="id"
      />,
    );
    expect(tableStyle(ellipsis)).toContain('table-layout: fixed');
    unmountEllipsis();

    const { container: plain } = render(
      <Table columns={columns} dataSource={rows} pagination={false} rowKey="id" />,
    );
    expect(tableStyle(plain)).toContain('table-layout: auto');
  });

  test('explicit tableLayout and scroll.x max-content keep auto layout with fixed columns', () => {
    const fixedColumns: TableColumn<Row>[] = [
      ...columns,
      { fixed: 'right', key: 'op', render: () => 'Open', width: 80 },
    ];
    const { container, unmount } = render(
      <Table
        columns={fixedColumns}
        dataSource={rows}
        pagination={false}
        rowKey="id"
        tableLayout="auto"
      />,
    );
    expect(tableStyle(container)).toContain('table-layout: auto');
    unmount();

    const { container: maxContent } = render(
      <Table
        columns={fixedColumns}
        dataSource={rows}
        pagination={false}
        rowKey="id"
        scroll={{ x: 'max-content' }}
      />,
    );
    expect(tableStyle(maxContent)).toContain('table-layout: auto');
  });

  test('ref exposes nativeElement and scrollTo while staying an HTMLDivElement', () => {
    const ref: RefObject<TableRef | null> = { current: null };
    const { container } = render(
      <Table
        columns={columns}
        dataSource={rows}
        pagination={false}
        ref={ref}
        rowKey="id"
        scroll={{ y: 100 }}
      />,
    );

    const root = container.firstElementChild as HTMLDivElement;
    expect(ref.current!.nativeElement).toBe(root);
    expect(ref.current!.contains(container.querySelector('table'))).toBe(true);
    expect(ref.current!.getBoundingClientRect()).toBeTruthy();

    const body = container.querySelector('.lobe-table-body') as HTMLDivElement;
    body.scrollTo = vi.fn() as any;
    ref.current!.scrollTo({ top: 30 });
    expect(body.scrollTo).toHaveBeenCalledWith({ top: 30 });
  });

  test('a plain HTMLDivElement ref still works', () => {
    const ref: RefObject<HTMLDivElement | null> = { current: null };
    const { container } = render(
      <Table columns={columns} dataSource={rows} pagination={false} ref={ref} rowKey="id" />,
    );

    expect(ref.current!.tagName).toBe('DIV');
    expect(ref.current!.querySelector('table')).toBe(container.querySelector('table'));
  });

  test('measureRowRender wraps the measure row', () => {
    const measureRowRender = vi.fn((node) => node);
    const { container } = render(
      <Table
        columns={columns}
        dataSource={rows}
        measureRowRender={measureRowRender}
        pagination={false}
        rowKey="id"
        scroll={{ x: 600 }}
      />,
    );

    expect(measureRowRender).toHaveBeenCalled();
    expect(container.querySelector('.lobe-table-measure-row')).toBeTruthy();
  });

  test('legacy classNames / styles keys still reach header, row, cell and body', () => {
    const { container } = render(
      <Table
        columns={columns}
        dataSource={rows.slice(0, 2)}
        pagination={false}
        rowKey="id"
        styles={{ cell: { color: 'red' } }}
        classNames={{
          body: 'c-body',
          cell: 'c-cell',
          header: 'c-header',
          row: 'c-row',
          wrapper: 'c-wrapper',
        }}
      />,
    );

    expect(container.querySelector('tbody.c-body')).toBeTruthy();
    expect(container.querySelectorAll('th.c-header')).toHaveLength(2);
    expect(container.querySelectorAll('tr.c-row')).toHaveLength(2);
    expect(container.querySelectorAll('td.c-cell')).toHaveLength(4);
    expect(container.querySelector('.lobe-table-container.c-wrapper')).toBeTruthy();
    expect(container.querySelector('td.c-cell')!.getAttribute('style')).toContain('color: red');
  });
});
