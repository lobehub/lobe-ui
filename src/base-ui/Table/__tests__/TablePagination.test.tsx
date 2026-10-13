import { cleanup, fireEvent, render as rtlRender, screen, within } from '@testing-library/react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

import ConfigProvider from '@/ConfigProvider';

import Table from '../Table';
import type { TableColumn, TablePaginationConfig, TableProps } from '../type';

// Base-ui buttons (ActionIcon in the expand / filter triggers) read the motion component from
// ConfigProvider, so every render (and rerender) goes through it.
const MotionWrapper = ({ children }: { children: ReactNode }) => (
  <ConfigProvider motion={motion}>{children}</ConfigProvider>
);
const render: typeof rtlRender = ((ui: any, options?: any) =>
  rtlRender(ui, { wrapper: MotionWrapper, ...options })) as typeof rtlRender;

vi.mock('@/base-ui/Select', () => ({
  default: ({ onChange, options, value }: any) => (
    <select data-testid="size-changer" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((option: any) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
}));

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

const manyRows = (count: number): Row[] =>
  Array.from({ length: count }, (_, index) => ({
    id: String(index),
    model: `m-${String(index).padStart(2, '0')}`,
    provider: index % 2 === 0 ? 'OpenAI' : 'Google',
    spend: index,
  }));

const columns: TableColumn<Row>[] = [
  { dataIndex: 'model', title: 'Model' },
  {
    dataIndex: 'provider',
    filters: [
      { text: 'OpenAI', value: 'OpenAI' },
      { text: 'Google', value: 'Google' },
    ],
    onFilter: (value, record) => record.provider === value,
    title: 'Provider',
  },
  { dataIndex: 'spend', sorter: (a, b) => a.spend - b.spend, title: 'Spend' },
];

const renderTable = (props: Partial<TableProps<Row>> = {}) =>
  render(
    <ConfigProvider motion={motion}>
      <Table columns={columns} dataSource={manyRows(12)} rowKey="id" {...props} />
    </ConfigProvider>,
  );

const bodyModels = () =>
  screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[0].textContent);

const pagers = () => screen.queryAllByRole('navigation');

const sortBySpend = () =>
  fireEvent.click(
    within(screen.getByRole('columnheader', { name: /Spend/ })).getAllByRole('button')[0],
  );

const filterOpenAI = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Filter Provider' }));
  fireEvent.click(screen.getByRole('checkbox', { name: 'OpenAI' }));
  fireEvent.click(screen.getByRole('button', { name: 'OK' }));
};

const goToPage = (page: number) => fireEvent.click(screen.getByRole('button', { name: `${page}` }));

describe('Table pagination', () => {
  afterEach(cleanup);

  describe('placement', () => {
    test('defaults to a single pager at the bottom end', () => {
      const { container } = renderTable();

      expect(pagers()).toHaveLength(1);
      const wrapper = container.querySelector('.lobe-table-pagination-wrapper')!;
      // Rendered after the table body.
      expect(wrapper.previousElementSibling?.hasAttribute('data-table-wrapper')).toBe(true);
      expect(pagers()[0].className).toContain('lobe-table-pagination-end');
    });

    test.each<[TablePaginationConfig['placement'], string[], string[]]>([
      [['topStart'], ['start'], []],
      [['topCenter', 'bottomCenter'], ['center'], ['center']],
      [['bottomStart'], [], ['start']],
      [['topEnd', 'bottomEnd'], ['end'], ['end']],
    ])('placement %j renders top %j and bottom %j', (placement, top, bottom) => {
      const { container } = renderTable({ pagination: { placement } });
      const table = container.querySelector('[data-table-wrapper]')!;
      const wrappers = [...container.querySelectorAll('.lobe-table-pagination-wrapper')];
      const alignOf = (wrapper: Element) =>
        /lobe-table-pagination-(start|center|end)/.exec(
          wrapper.querySelector('nav')!.className,
        )![1];

      const before = wrappers.filter(
        (wrapper) => table.compareDocumentPosition(wrapper) & Node.DOCUMENT_POSITION_PRECEDING,
      );
      const after = wrappers.filter((wrapper) => !before.includes(wrapper));
      expect(before.map(alignOf)).toEqual(top);
      expect(after.map(alignOf)).toEqual(bottom);
    });

    test("placement ['none'] hides the pager but still paginates", () => {
      renderTable({ pagination: { placement: ['none'] } });

      expect(pagers()).toHaveLength(0);
      expect(bodyModels()).toHaveLength(10);
    });

    test('deprecated position maps left/right to start/end', () => {
      const { container } = renderTable({ pagination: { position: ['topLeft', 'bottomRight'] } });

      expect(pagers()).toHaveLength(2);
      const navs = [...container.querySelectorAll('nav')];
      expect(navs[0].className).toContain('lobe-table-pagination-start');
      expect(navs[1].className).toContain('lobe-table-pagination-end');
    });

    test('placement wins over position', () => {
      const { container } = renderTable({
        pagination: { placement: ['bottomCenter'], position: ['topLeft'] },
      });

      expect(pagers()).toHaveLength(1);
      expect(container.querySelector('nav')!.className).toContain('lobe-table-pagination-center');
    });
  });

  describe('Pagination props', () => {
    test('forwards showTotal with the current range', () => {
      renderTable({
        pagination: {
          defaultCurrent: 2,
          showTotal: (total, [start, end]) => `${start}-${end} of ${total}`,
        },
      });

      expect(screen.getByText('11-12 of 12')).toBeTruthy();
    });

    test('hideOnSinglePage removes the pager when everything fits', () => {
      const { container } = render(
        <Table
          columns={columns}
          dataSource={manyRows(5)}
          pagination={{ hideOnSinglePage: true }}
          rowKey="id"
        />,
      );

      expect(pagers()).toHaveLength(0);
      expect(container.querySelector('.lobe-table-pagination-wrapper')).toBeNull();
    });

    test('disabled disables the page buttons', () => {
      renderTable({ pagination: { disabled: true } });

      expect((screen.getByRole('button', { name: '2' }) as HTMLButtonElement).disabled).toBe(true);
      expect(
        (screen.getByRole('button', { name: 'Next page' }) as HTMLButtonElement).disabled,
      ).toBe(true);
    });

    test('forwards className, style and data attributes to the pager', () => {
      renderTable({
        pagination: {
          'aria-label': 'Models pages',
          'className': 'my-pager',
          'style': { color: 'red' },
        },
      });

      const nav = screen.getByRole('navigation', { name: 'Models pages' });
      expect(nav.className).toContain('my-pager');
      expect(nav.style.color).toBe('red');
    });

    test('size follows the table: small / medium tables get a small pager', () => {
      const pageButtonClass = () => screen.getByRole('button', { name: '1' }).className;

      renderTable();
      const defaultClass = pageButtonClass();
      cleanup();

      renderTable({ size: 'large' });
      expect(pageButtonClass()).toBe(defaultClass);
      cleanup();

      renderTable({ size: 'small' });
      const smallClass = pageButtonClass();
      expect(smallClass).not.toBe(defaultClass);
      cleanup();

      renderTable({ size: 'medium' });
      expect(pageButtonClass()).toBe(smallClass);
      cleanup();

      // An explicit pager size wins.
      renderTable({ pagination: { size: 'middle' }, size: 'small' });
      expect(pageButtonClass()).toBe(defaultClass);
    });

    test('pageSizeOptions accepts strings and numbers', () => {
      const onChange = vi.fn();
      renderTable({
        onChange,
        pagination: { pageSizeOptions: ['5', 20], showSizeChanger: true },
      });

      const select = screen.getByTestId('size-changer');
      expect([...select.querySelectorAll('option')].map((option) => option.textContent)).toEqual([
        '5 / page',
        '20 / page',
      ]);
      fireEvent.change(select, { target: { value: '5' } });

      expect(bodyModels()).toHaveLength(5);
      expect(onChange.mock.calls.at(-1)![0]).toMatchObject({ current: 1, pageSize: 5 });
    });

    test('showSizeChanger defaults on only when total > 50', () => {
      render(<Table columns={columns} dataSource={manyRows(50)} rowKey="id" />);
      expect(screen.queryByTestId('size-changer')).toBeNull();
      cleanup();

      render(<Table columns={columns} dataSource={manyRows(51)} rowKey="id" />);
      expect(screen.getByTestId('size-changer')).toBeTruthy();
      cleanup();

      render(
        <Table
          columns={columns}
          dataSource={manyRows(51)}
          pagination={{ showSizeChanger: false }}
          rowKey="id"
        />,
      );
      expect(screen.queryByTestId('size-changer')).toBeNull();
      cleanup();

      // Server total counts too.
      render(
        <Table
          columns={columns}
          dataSource={manyRows(10)}
          pagination={{ total: 200 }}
          rowKey="id"
        />,
      );
      expect(screen.getByTestId('size-changer')).toBeTruthy();
    });

    test('showQuickJumper jumps on Enter and reports a paginate change', () => {
      const onChange = vi.fn();
      const pageChange = vi.fn();
      render(
        <Table
          columns={columns}
          dataSource={manyRows(40)}
          pagination={{ onChange: pageChange, showQuickJumper: true }}
          rowKey="id"
          onChange={onChange}
        />,
      );

      const input = screen.getByRole('textbox', { name: 'Go to page' });
      fireEvent.change(input, { target: { value: '3' } });
      fireEvent.keyUp(input, { key: 'Enter' });

      expect(bodyModels()[0]).toBe('m-20');
      expect(pageChange).toHaveBeenCalledWith(3, 10);
      expect(onChange.mock.calls.at(-1)![3].action).toBe('paginate');
      expect((input as HTMLInputElement).value).toBe('');
    });

    test('showQuickJumper clamps out-of-range pages and applies on blur', () => {
      render(
        <Table
          columns={columns}
          dataSource={manyRows(40)}
          pagination={{ showQuickJumper: true }}
          rowKey="id"
        />,
      );

      const input = screen.getByRole('textbox', { name: 'Go to page' });
      fireEvent.change(input, { target: { value: '99' } });
      fireEvent.blur(input);

      expect(bodyModels()[0]).toBe('m-30');
    });

    test('showQuickJumper.goButton applies on the button, not on blur', () => {
      render(
        <Table
          columns={columns}
          dataSource={manyRows(40)}
          pagination={{ showQuickJumper: { goButton: true } }}
          rowKey="id"
        />,
      );

      const input = screen.getByRole('textbox', { name: 'Go to page' });
      fireEvent.change(input, { target: { value: '2' } });
      fireEvent.blur(input);
      expect(bodyModels()[0]).toBe('m-00');

      fireEvent.click(screen.getByRole('button', { name: 'Go' }));
      expect(bodyModels()[0]).toBe('m-10');
    });
  });

  describe('page reset (antd)', () => {
    test('sorting keeps the current page and does not call pagination.onChange', () => {
      const pageChange = vi.fn();
      const onChange = vi.fn();
      renderTable({
        onChange,
        pagination: { defaultCurrent: 2, onChange: pageChange, pageSize: 5 },
      });

      sortBySpend();

      expect(bodyModels()).toEqual(['m-05', 'm-06', 'm-07', 'm-08', 'm-09']);
      expect(pageChange).not.toHaveBeenCalled();
      expect(onChange.mock.calls.at(-1)![0]).toMatchObject({ current: 2, pageSize: 5 });
    });

    test('filtering returns to page 1 and calls pagination.onChange(1, pageSize)', () => {
      const pageChange = vi.fn();
      const onChange = vi.fn();
      renderTable({
        onChange,
        pagination: { defaultCurrent: 2, onChange: pageChange, pageSize: 5 },
      });

      filterOpenAI();

      expect(bodyModels()).toEqual(['m-00', 'm-02', 'm-04', 'm-06', 'm-08']);
      expect(pageChange).toHaveBeenCalledTimes(1);
      expect(pageChange).toHaveBeenCalledWith(1, 5);
      expect(onChange.mock.calls.at(-1)![0]).toMatchObject({ current: 1, pageSize: 5 });
    });

    test('filtering tells a controlled pager to go to page 1', () => {
      const pageChange = vi.fn();
      renderTable({ pagination: { current: 2, onChange: pageChange, pageSize: 5 } });

      filterOpenAI();

      expect(pageChange).toHaveBeenCalledWith(1, 5);
    });
  });

  describe('onChange extra', () => {
    test('paginate reports every filtered + sorted record', () => {
      const onChange = vi.fn();
      renderTable({ onChange });

      goToPage(2);

      const [pagination, , , extra] = onChange.mock.calls.at(-1)!;
      expect(pagination).toEqual({ current: 2, pageSize: 10 });
      expect(extra.action).toBe('paginate');
      expect(extra.currentDataSource).toHaveLength(12);
    });

    test('sort reports the sorted data', () => {
      const onChange = vi.fn();
      renderTable({ onChange });

      sortBySpend();
      sortBySpend();

      const extra = onChange.mock.calls.at(-1)![3];
      expect(extra.action).toBe('sort');
      expect(extra.currentDataSource.map((row: Row) => row.spend)).toEqual(
        Array.from({ length: 12 }, (_, index) => 11 - index),
      );
    });

    test('filter reports the filtered (and sorted) data', () => {
      const onChange = vi.fn();
      renderTable({ onChange });

      sortBySpend();
      sortBySpend();
      filterOpenAI();

      const extra = onChange.mock.calls.at(-1)![3];
      expect(extra.action).toBe('filter');
      expect(extra.currentDataSource.map((row: Row) => row.model)).toEqual([
        'm-10',
        'm-08',
        'm-06',
        'm-04',
        'm-02',
        'm-00',
      ]);
    });

    test('pagination argument keeps plain config fields but drops callbacks', () => {
      const onChange = vi.fn();
      renderTable({
        onChange,
        pagination: {
          onChange: () => {},
          placement: ['bottomCenter'],
          showTotal: (total) => total,
          total: 0,
        },
      });

      goToPage(2);

      expect(onChange.mock.calls.at(-1)![0]).toEqual({
        current: 2,
        pageSize: 10,
        placement: ['bottomCenter'],
        // A non-positive total falls back to the data length.
        total: 12,
      });
    });

    test('pagination={false} reports an empty pagination object', () => {
      const onChange = vi.fn();
      renderTable({ onChange, pagination: false });

      sortBySpend();

      expect(onChange.mock.calls.at(-1)![0]).toEqual({});
      expect(onChange.mock.calls.at(-1)![3].currentDataSource).toHaveLength(12);
    });
  });

  describe('scroll.scrollToFirstRowOnChange', () => {
    const scrollTo = vi.fn();
    beforeEach(() => {
      scrollTo.mockReset();
      Element.prototype.scrollTo = scrollTo as any;
    });
    afterEach(() => {
      delete (Element.prototype as any).scrollTo;
    });

    test('scrolls the body to the top on paginate, sort and filter once scroll is set', () => {
      renderTable({ scroll: { y: 200 } });

      goToPage(2);
      expect(scrollTo).toHaveBeenLastCalledWith({ top: 0 });
      sortBySpend();
      filterOpenAI();
      expect(scrollTo).toHaveBeenCalledTimes(3);
    });

    test('does nothing without scroll or when turned off', () => {
      renderTable();
      goToPage(2);
      cleanup();

      renderTable({ scroll: { scrollToFirstRowOnChange: false, y: 200 } });
      goToPage(2);
      sortBySpend();

      expect(scrollTo).not.toHaveBeenCalled();
    });
  });

  describe('PaginationProps pass-through', () => {
    test('simple / itemRender / showTitle reach the pager and drive the table', () => {
      const onChange = vi.fn();
      renderTable({
        dataSource: manyRows(30),
        onChange,
        pagination: {
          itemRender: (_page, type, element) => (type === 'next' ? 'Next →' : element),
          pageSize: 10,
          showTitle: false,
          simple: true,
        },
      });

      expect(screen.getByLabelText('Next page').textContent).toBe('Next →');
      expect(screen.getByLabelText('Next page').hasAttribute('title')).toBe(false);

      const input = screen.getByRole('textbox', { name: 'Current page' });
      fireEvent.change(input, { target: { value: '3' } });
      fireEvent.keyUp(input, { key: 'Enter' });

      expect(bodyModels()).toEqual([
        'm-20',
        'm-21',
        'm-22',
        'm-23',
        'm-24',
        'm-25',
        'm-26',
        'm-27',
        'm-28',
        'm-29',
      ]);
      expect(onChange.mock.calls.at(-1)![0]).toMatchObject({ current: 3, pageSize: 10 });
    });

    test('showLessItems reaches the pager', () => {
      renderTable({
        dataSource: manyRows(200),
        pagination: { current: 10, pageSize: 10, showLessItems: true },
      });

      expect(screen.queryByRole('button', { name: '8' })).toBeNull();
      expect(screen.getByRole('button', { name: '9' })).toBeTruthy();
      expect(screen.getByRole('button', { name: '11' })).toBeTruthy();
    });
  });
});
