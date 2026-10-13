import {
  act,
  cleanup,
  fireEvent,
  render as rtlRender,
  screen,
  waitFor,
} from '@testing-library/react';
import { motion } from 'motion/react';
import type { ReactNode, RefObject } from 'react';

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
  borrow: number;
  id: string;
  name: string;
  repayment: number;
}

const rows: Row[] = Array.from({ length: 4 }, (_, index) => ({
  borrow: (index + 1) * 10,
  id: String(index),
  name: `n-${index}`,
  repayment: index + 1,
}));

const columns: TableColumn<Row>[] = [
  { dataIndex: 'name', title: 'Name' },
  { dataIndex: 'borrow', title: 'Borrow' },
  { dataIndex: 'repayment', title: 'Repayment' },
];

const sum = (data: readonly Row[], field: 'borrow' | 'repayment') =>
  data.reduce((total, row) => total + row[field], 0);

const renderSummary = (data: readonly Row[]) => (
  <Table.Summary.Row>
    <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
    <Table.Summary.Cell align="right" index={1}>
      {sum(data, 'borrow')}
    </Table.Summary.Cell>
    <Table.Summary.Cell index={2}>{sum(data, 'repayment')}</Table.Summary.Cell>
  </Table.Summary.Row>
);

describe('summary', () => {
  afterEach(cleanup);

  test('Table.Summary sugar is exposed', () => {
    expect(Table.Summary).toBeDefined();
    expect(Table.Summary.Row).toBeDefined();
    expect(Table.Summary.Cell).toBeDefined();
  });

  test('renders a tfoot with summary cells computed from the current page', () => {
    const summary = vi.fn(renderSummary);
    const { container } = render(
      <Table
        columns={columns}
        dataSource={rows}
        pagination={{ pageSize: 2 }}
        rowKey="id"
        summary={summary}
      />,
    );

    const tfoot = container.querySelector('tfoot.lobe-table-summary')!;
    expect(tfoot).toBeTruthy();
    const cells = tfoot.querySelectorAll('td');
    expect([...cells].map((cell) => cell.textContent)).toEqual(['Total', '30', '3']);
    expect(cells[1].getAttribute('style') ?? '').toContain('text-align: right');
    // Only the first page (2 rows) reaches summary.
    expect(summary).toHaveBeenLastCalledWith(rows.slice(0, 2));
  });

  test('Summary.Cell colSpan / rowSpan and multiple rows', () => {
    const { container } = render(
      <Table
        columns={columns}
        dataSource={rows}
        pagination={false}
        rowKey="id"
        summary={() => (
          <>
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={2} index={0}>
                Span
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2} rowSpan={2}>
                Tall
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={2} index={0}>
                Second
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </>
        )}
      />,
    );

    const trs = container.querySelectorAll('tfoot > tr');
    expect(trs).toHaveLength(2);
    expect(screen.getByText('Span').closest('td')!.getAttribute('colspan')).toBe('2');
    expect(screen.getByText('Tall').closest('td')!.getAttribute('rowspan')).toBe('2');
  });

  test.each([
    [true, 'bottom'],
    ['bottom', 'bottom'],
    ['top', 'top'],
  ] as const)('Summary fixed=%s pins the summary to the %s with scroll.y', (fixed, side) => {
    const { container } = render(
      <Table
        columns={columns}
        dataSource={rows}
        pagination={false}
        rowKey="id"
        scroll={{ y: 100 }}
        summary={(data) => <Table.Summary fixed={fixed}>{renderSummary(data)}</Table.Summary>}
      />,
    );

    // A fixed summary moves out of the scrolling body into a sticky holder.
    expect(container.querySelector('.lobe-table-body tfoot')).toBeNull();
    if (side === 'top') {
      // Rendered with the header, above the body.
      expect(container.querySelector('.lobe-table-header tfoot.lobe-table-summary')).toBeTruthy();
      expect(container.querySelector('div.lobe-table-summary')).toBeNull();
    } else {
      const holder = container.querySelector('div.lobe-table-summary')!;
      expect(holder.querySelector('tfoot')).toBeTruthy();
      const sections = [...container.querySelector('.lobe-table-container')!.children];
      expect(sections.indexOf(holder)).toBeGreaterThan(
        sections.indexOf(container.querySelector('.lobe-table-body')!),
      );
    }
  });

  test.each([true, 'top', 'bottom'] as const)(
    'Summary fixed=%s still renders without scroll or sticky (plain tfoot)',
    (fixed) => {
      const { container } = render(
        <Table
          columns={columns}
          dataSource={rows}
          pagination={false}
          rowKey="id"
          summary={(data) => <Table.Summary fixed={fixed}>{renderSummary(data)}</Table.Summary>}
        />,
      );

      const cells = container.querySelectorAll('table > tfoot.lobe-table-summary td');
      expect([...cells].map((cell) => cell.textContent)).toEqual(['Total', '100', '10']);
    },
  );

  test('a non-fixed summary stays inside the scrolling body', () => {
    const { container } = render(
      <Table
        columns={columns}
        dataSource={rows}
        pagination={false}
        rowKey="id"
        scroll={{ y: 100 }}
        summary={renderSummary}
      />,
    );

    expect(container.querySelector('.lobe-table-body tfoot.lobe-table-summary')).toBeTruthy();
    expect(container.querySelector('div.lobe-table-summary')).toBeNull();
  });
});

describe('sticky', () => {
  afterEach(cleanup);

  // The sticky scrollbar itself needs real layout (scrollWidth > clientWidth); it is checked in the browser.
  test('sticky=true splits the header into a sticky holder at top 0', () => {
    const { container } = render(
      <Table sticky columns={columns} dataSource={rows} pagination={false} rowKey="id" />,
    );

    const holder = container.querySelector<HTMLElement>('.lobe-table-sticky-holder')!;
    expect(holder).toBeTruthy();
    expect(holder.querySelector('thead')).toBeTruthy();
    expect(holder.style.top).toBe('0px');
  });

  test('offsetHeader / offsetSummary / offsetScroll / getContainer are honoured', () => {
    const scroller = document.createElement('div');
    document.body.append(scroller);
    const addListener = vi.spyOn(scroller, 'addEventListener');
    const getContainer = vi.fn(() => scroller);

    const element = (
      <Table
        columns={columns}
        dataSource={rows}
        pagination={false}
        rowKey="id"
        scroll={{ x: 1200 }}
        sticky={{ getContainer, offsetHeader: 64, offsetScroll: 12, offsetSummary: 8 }}
        summary={(data) => <Table.Summary fixed>{renderSummary(data)}</Table.Summary>}
      />
    );
    const { container, rerender } = render(element);
    // The scrollbar mounts once the body element exists.
    rerender(element);

    expect(container.querySelector<HTMLElement>('.lobe-table-sticky-holder')!.style.top).toBe(
      '64px',
    );
    const summaryHolder = container.querySelector<HTMLElement>('div.lobe-table-summary')!;
    expect(summaryHolder.style.bottom).toBe('8px');
    expect(getContainer).toHaveBeenCalled();
    // The sticky scrollbar listens to the custom container.
    expect(addListener).toHaveBeenCalledWith('scroll', expect.any(Function), false);

    scroller.remove();
  });

  test('a fixed summary holder stays position: sticky (summary styles must not override it)', () => {
    const { container } = render(
      <Table
        sticky
        columns={columns}
        dataSource={rows}
        pagination={false}
        rowKey="id"
        summary={(data) => <Table.Summary fixed>{renderSummary(data)}</Table.Summary>}
      />,
    );

    const summaryHolder = container.querySelector<HTMLElement>(
      'div.lobe-table-summary.lobe-table-sticky-holder',
    )!;
    expect(summaryHolder).toBeTruthy();
    expect(getComputedStyle(summaryHolder).position).toBe('sticky');
  });

  test('without sticky there is no sticky holder', () => {
    const { container } = render(
      <Table columns={columns} dataSource={rows} pagination={false} rowKey="id" />,
    );

    expect(container.querySelector('.lobe-table-sticky-holder')).toBeNull();
    expect(container.querySelector('.lobe-table-sticky-scroll')).toBeNull();
  });
});

describe('ref.scrollTo (native body)', () => {
  afterEach(cleanup);

  const renderWithRef = () => {
    const ref: RefObject<TableRef | null> = { current: null };
    const utils = render(
      <Table
        columns={columns}
        dataSource={rows}
        pagination={false}
        ref={ref}
        rowKey="id"
        scroll={{ y: 50 }}
      />,
    );
    return { ...utils, ref };
  };

  test('index scrolls that row into view with the given align, then applies offset', () => {
    const { container, ref } = renderWithRef();
    const body = container.querySelector<HTMLElement>('.lobe-table-body')!;
    body.scrollTo = vi.fn() as any;
    const row = container.querySelector<HTMLElement>('[data-row-key="2"]')!;
    row.scrollIntoView = vi.fn();

    ref.current!.scrollTo({ align: 'start', index: 2, offset: 10 });

    expect(row.scrollIntoView).toHaveBeenCalledWith({ block: 'start' });
    expect(body.scrollTo).toHaveBeenCalledWith({ top: body.scrollTop + 10 });
  });

  test('key targets a row by its rowKey and align defaults to nearest', () => {
    const { container, ref } = renderWithRef();
    const row = container.querySelector<HTMLElement>('[data-row-key="3"]')!;
    row.scrollIntoView = vi.fn();

    ref.current!.scrollTo({ key: '3' });

    expect(row.scrollIntoView).toHaveBeenCalledWith({ block: 'nearest' });
  });
});

describe('virtual', () => {
  afterEach(cleanup);

  const many: Row[] = Array.from({ length: 1000 }, (_, index) => ({
    borrow: index,
    id: String(index),
    name: `n-${index}`,
    repayment: index,
  }));

  const virtualColumns: TableColumn<Row>[] = [
    { dataIndex: 'name', fixed: 'left', title: 'Name', width: 120 },
    { dataIndex: 'borrow', title: 'Borrow', width: 200 },
    { dataIndex: 'repayment', fixed: 'right', title: 'Repayment', width: 120 },
  ];

  test('renders through the virtual body and only mounts a window of rows', () => {
    const { container } = render(
      <Table
        virtual
        columns={virtualColumns}
        dataSource={many}
        pagination={false}
        rowKey="id"
        scroll={{ x: 800, y: 300 }}
      />,
    );

    expect(container.querySelector('.lobe-table-virtual')).toBeTruthy();
    expect(container.querySelector('.lobe-table-tbody-virtual')).toBeTruthy();
    const rendered = container.querySelectorAll('.lobe-table-tbody-virtual .lobe-table-row');
    expect(rendered.length).toBeGreaterThan(0);
    expect(rendered.length).toBeLessThan(many.length);
    // Fixed columns keep their sticky classes in virtual rows.
    expect(
      container.querySelector('.lobe-table-tbody-virtual .lobe-table-cell-fix-start'),
    ).toBeTruthy();
    expect(
      container.querySelector('.lobe-table-tbody-virtual .lobe-table-cell-fix-end'),
    ).toBeTruthy();
  });

  test('without virtual the regular tbody is used', () => {
    const { container } = render(
      <Table columns={columns} dataSource={rows} pagination={false} rowKey="id" />,
    );

    expect(container.querySelector('.lobe-table-virtual')).toBeNull();
    expect(container.querySelector('tbody.lobe-table-tbody')).toBeTruthy();
  });

  test('works with rowSelection and expandable rows', () => {
    const { container } = render(
      <Table
        virtual
        columns={virtualColumns}
        dataSource={many}
        pagination={false}
        rowKey="id"
        rowSelection={{ defaultSelectedRowKeys: ['0'] }}
        scroll={{ x: 800, y: 300 }}
        expandable={{
          defaultExpandedRowKeys: ['1'],
          expandedRowRender: (record) => <span>detail-{record.id}</span>,
        }}
      />,
    );

    const firstRow = container.querySelector('.lobe-table-tbody-virtual [data-row-key="0"]')!;
    expect(firstRow.classList.contains('lobe-table-row-selected')).toBe(true);
    expect(firstRow.querySelector('input[type="checkbox"], [role="checkbox"]')).toBeTruthy();
    expect(screen.getByText('detail-1')).toBeTruthy();

    const secondCheckbox = container.querySelector(
      '.lobe-table-tbody-virtual [data-row-key="2"] [role="checkbox"], .lobe-table-tbody-virtual [data-row-key="2"] input[type="checkbox"]',
    )!;
    fireEvent.click(secondCheckbox);
    expect(
      container
        .querySelector('.lobe-table-tbody-virtual [data-row-key="2"]')!
        .classList.contains('lobe-table-row-selected'),
    ).toBe(true);
  });

  test('selection and expand columns get numeric default widths in virtual rows', () => {
    const { container } = render(
      <Table
        virtual
        columns={virtualColumns}
        dataSource={many}
        expandable={{ expandedRowRender: (record) => record.name }}
        pagination={false}
        rowKey="id"
        variant="outlined"
        rowSelection={{}}
        // Exactly the column sum (48 + 48 + 120 + 200 + 120): no spare width to share out.
        scroll={{ x: 536, y: 300 }}
      />,
    );

    const cells = container.querySelectorAll<HTMLElement>(
      '.lobe-table-tbody-virtual [data-row-key="0"] > .lobe-table-cell',
    );
    // Expand column 48px, outlined selection column 32 + 16px: not stretched to fill scroll.x.
    expect(cells[0].style.width).toBe('48px');
    expect(cells[1].style.width).toBe('48px');
  });

  test('summary renders under a virtual body', () => {
    const { container } = render(
      <Table
        virtual
        columns={virtualColumns}
        dataSource={many}
        pagination={false}
        rowKey="id"
        scroll={{ x: 800, y: 300 }}
        summary={(data) => <Table.Summary fixed>{renderSummary(data)}</Table.Summary>}
      />,
    );

    expect(container.querySelector('.lobe-table-summary')).toBeTruthy();
    expect(screen.getByText('Total')).toBeTruthy();
  });

  test('ref.scrollTo drives the virtual list (index / key / top)', async () => {
    const ref: RefObject<TableRef | null> = { current: null };
    const { container } = render(
      <Table
        virtual
        columns={virtualColumns}
        dataSource={many}
        pagination={false}
        ref={ref}
        rowKey="id"
        scroll={{ x: 800, y: 300 }}
      />,
    );

    const holder = container.querySelector<HTMLElement>('.lobe-table-tbody-virtual-holder')!;
    expect(holder).toBeTruthy();
    // jsdom has no layout: give the viewport its `scroll.y` height so index scrolling can resolve.
    Object.defineProperty(holder, 'clientHeight', { configurable: true, value: 300 });

    act(() => ref.current!.scrollTo({ top: 470 }));
    await waitFor(() => expect(holder.scrollTop).toBe(470));

    // Rows are not measured in jsdom, so the estimated 47px (medium) row height applies.
    act(() => ref.current!.scrollTo({ align: 'start', index: 500 }));
    await waitFor(() => expect(holder.scrollTop).toBe(500 * 47));

    act(() => ref.current!.scrollTo({ align: 'start', key: '800' }));
    await waitFor(() => expect(holder.scrollTop).toBe(800 * 47));

    // `align: 'end'` puts the row's bottom edge at the viewport bottom.
    act(() => ref.current!.scrollTo({ align: 'end', index: 100 }));
    await waitFor(() => expect(holder.scrollTop).toBe(101 * 47 - 300));
  });

  test('listItemHeight follows the size', async () => {
    // Small rows: 8 * 2 + 22 + 1; the first scroll range is seeded by it.
    const ref: RefObject<TableRef | null> = { current: null };
    const { container } = render(
      <Table
        virtual
        columns={virtualColumns}
        dataSource={many}
        pagination={false}
        ref={ref}
        rowKey="id"
        scroll={{ x: 800, y: 300 }}
        size="small"
      />,
    );

    const holder = container.querySelector<HTMLElement>('.lobe-table-tbody-virtual-holder')!;
    Object.defineProperty(holder, 'clientHeight', { configurable: true, value: 300 });
    act(() => ref.current!.scrollTo({ align: 'start', index: 10 }));
    await waitFor(() => expect(holder.scrollTop).toBe(10 * 39));
  });
});

describe('measureRowRender', () => {
  afterEach(cleanup);

  test('wraps the hidden measure row', () => {
    const measureRowRender = vi.fn((measureRow) => (
      <div data-testid="measure-wrapper">{measureRow}</div>
    ));
    const { container } = render(
      <Table
        sticky
        columns={columns.map((column) => ({ ...column, width: 100 }))}
        dataSource={rows}
        measureRowRender={measureRowRender}
        pagination={false}
        rowKey="id"
        scroll={{ x: 600 }}
      />,
    );

    expect(measureRowRender).toHaveBeenCalled();
    expect(container.querySelector('[data-testid="measure-wrapper"]')).toBeTruthy();
  });
});
