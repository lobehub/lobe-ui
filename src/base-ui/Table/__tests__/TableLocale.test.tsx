import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { motion } from 'motion/react';
import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';

import ConfigProvider from '@/ConfigProvider';
import * as zhCnResources from '@/i18n/resources/zhCn';

import Table from '../Table';
import type { TableColumn, TableProps } from '../type';

// The base-ui popup does not portal under jsdom; expose the tooltip title instead.
vi.mock('@/base-ui/Tooltip', () => ({
  default: ({ children, title }: { children: ReactNode; title: ReactNode }) =>
    isValidElement(children)
      ? cloneElement(children as ReactElement<any>, { 'data-tooltip-title': String(title) })
      : children,
}));

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    disconnect() {}
    observe() {}
    unobserve() {}
  } as any;
}

interface Row {
  age: number;
  children?: Row[];
  key: string;
  name: string;
}

const rows: Row[] = [
  { age: 32, children: [{ age: 3, key: '1-1', name: 'Kid' }], key: '1', name: 'John' },
  { age: 42, key: '2', name: 'Jim' },
];

const columns: TableColumn<Row>[] = [
  {
    dataIndex: 'name',
    // Tree mode shows the "check all" box, like antd.
    filterMode: 'tree',
    filterSearch: true,
    filters: [
      { text: 'John', value: 'John' },
      { text: 'Jim', value: 'Jim' },
    ],
    onFilter: (value, record) => record.name === value,
    title: 'Name',
  },
  { dataIndex: 'age', sorter: (a, b) => a.age - b.age, title: 'Age' },
];

const renderTable = (props: Partial<TableProps<Row>> = {}, zh = false) =>
  render(
    <ConfigProvider
      locale={zh ? 'zh-CN' : undefined}
      motion={motion}
      resources={zh ? zhCnResources : undefined}
    >
      <Table<Row>
        columns={columns}
        dataSource={rows}
        pagination={false}
        rowSelection={{ selections: true }}
        {...props}
      />
    </ConfigProvider>,
  );

const sortButton = () =>
  within(screen.getByRole('columnheader', { name: /Age/ })).getByRole('button');
const filterTrigger = () => screen.getByRole('button', { name: 'Filter Name' });
const expandIcon = () => document.querySelector<HTMLButtonElement>('.lobe-table-row-expand-icon')!;
const headerCheckbox = () =>
  document.querySelector('.lobe-table-selection')!.querySelector('[role="checkbox"]')!;

const openSelections = async () => {
  fireEvent.click(screen.getByRole('button', { name: 'Selection options' }));
  await waitFor(() => expect(screen.getAllByRole('menuitem').length).toBeGreaterThan(0));
};
const menuTexts = () => screen.getAllByRole('menuitem').map((item) => item.textContent);

describe('Table locale', () => {
  afterEach(cleanup);

  test('defaults to the English i18n texts (antd en_US)', async () => {
    renderTable();

    expect(sortButton().dataset.tooltipTitle).toBe('Click to sort ascending');
    fireEvent.click(sortButton());
    expect(sortButton().dataset.tooltipTitle).toBe('Click to sort descending');
    fireEvent.click(sortButton());
    expect(sortButton().dataset.tooltipTitle).toBe('Click to cancel sorting');

    expect(expandIcon().getAttribute('aria-label')).toBe('Expand row');
    fireEvent.click(expandIcon());
    expect(expandIcon().getAttribute('aria-label')).toBe('Collapse row');

    expect(headerCheckbox().getAttribute('aria-label')).toBe('Custom selection');
    await openSelections();
    expect(menuTexts()).toEqual(['Select all data', 'Invert current page', 'Clear all data']);

    expect(filterTrigger().getAttribute('title')).toBe('Filter menu');
    fireEvent.click(filterTrigger());
    expect(screen.getByPlaceholderText('Search in filters')).toBeTruthy();
    expect(screen.getByRole('checkbox', { name: 'Select all items' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Reset' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'OK' })).toBeTruthy();
  });

  test('follows the i18n resources of ConfigProvider (zh-CN)', async () => {
    renderTable({}, true);

    expect(sortButton().dataset.tooltipTitle).toBe('点击升序');
    expect(expandIcon().getAttribute('aria-label')).toBe('展开行');
    await openSelections();
    expect(menuTexts()).toEqual(['全选所有', '反选当页', '清空所有']);

    fireEvent.click(filterTrigger());
    expect(screen.getByPlaceholderText('在筛选项中搜索')).toBeTruthy();
    expect(screen.getByRole('checkbox', { name: '全选' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '重置' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '确定' })).toBeTruthy();
  });

  test('the zh-CN empty text comes from i18n', () => {
    renderTable({ dataSource: [] }, true);
    expect(screen.getByText('暂无数据')).toBeTruthy();
  });

  test('every locale field can be overridden by the `locale` prop, over i18n', async () => {
    renderTable(
      {
        locale: {
          cancelSort: 'L-cancel',
          collapse: 'L-collapse',
          expand: 'L-expand',
          filterCheckAll: 'L-check-all',
          filterConfirm: 'L-ok',
          filterEmptyText: 'L-no-filters',
          filterReset: 'L-reset',
          filterSearchPlaceholder: 'L-search',
          filterTitle: 'L-filter-title',
          selectAll: 'L-select-page',
          selectInvert: 'L-invert',
          selectionAll: 'L-all',
          selectNone: 'L-none',
          sortTitle: 'L-sort',
          triggerAsc: 'L-asc',
          triggerDesc: 'L-desc',
        },
      },
      true,
    );

    expect(sortButton().dataset.tooltipTitle).toBe('L-asc');
    fireEvent.click(sortButton());
    expect(sortButton().dataset.tooltipTitle).toBe('L-desc');
    fireEvent.click(sortButton());
    expect(sortButton().dataset.tooltipTitle).toBe('L-cancel');

    expect(expandIcon().getAttribute('aria-label')).toBe('L-expand');
    fireEvent.click(expandIcon());
    expect(expandIcon().getAttribute('aria-label')).toBe('L-collapse');

    await openSelections();
    expect(menuTexts()).toEqual(['L-all', 'L-invert', 'L-none']);

    expect(filterTrigger().getAttribute('title')).toBe('L-filter-title');
    fireEvent.click(filterTrigger());
    expect(screen.getByPlaceholderText('L-search')).toBeTruthy();
    expect(screen.getByRole('checkbox', { name: 'L-check-all' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'L-reset' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'L-ok' })).toBeTruthy();
  });

  test('selectAll labels the header checkbox; sortTitle titles the sorter without a tooltip', () => {
    renderTable({
      locale: { selectAll: 'L-select-page', sortTitle: 'L-sort' },
      rowSelection: {},
      showSorterTooltip: false,
    });
    expect(screen.getByRole('checkbox', { name: 'L-select-page' })).toBe(headerCheckbox());
    expect(sortButton().getAttribute('title')).toBe('L-sort');
  });

  test('the default selectAll label is "Select current page"', () => {
    renderTable({ rowSelection: {} });
    expect(headerCheckbox().getAttribute('aria-label')).toBe('Select current page');
  });

  test('filterEmptyText shows when a column has an empty filters list', () => {
    renderTable({
      columns: [{ ...columns[0], filters: [] }],
      locale: { filterEmptyText: 'L-no-filters' },
    });
    fireEvent.click(filterTrigger());
    expect(screen.getByText('L-no-filters')).toBeTruthy();
  });

  test('the deprecated filterCheckall still works; filterCheckAll wins', () => {
    renderTable({ locale: { filterCheckall: 'Old check all' } });
    fireEvent.click(filterTrigger());
    expect(screen.getByRole('checkbox', { name: 'Old check all' })).toBeTruthy();
    cleanup();

    renderTable({ locale: { filterCheckAll: 'New', filterCheckall: 'Old' } });
    fireEvent.click(filterTrigger());
    expect(screen.getByRole('checkbox', { name: 'New' })).toBeTruthy();
  });

  describe('emptyText', () => {
    test('defaults to the Empty state with "No data"', () => {
      renderTable({ dataSource: [] });
      expect(screen.getByText('No data')).toBeTruthy();
    });

    test('locale.emptyText replaces it, as a node or a function', () => {
      renderTable({ dataSource: [], locale: { emptyText: <b>Nothing here</b> } });
      expect(screen.getByText('Nothing here').tagName).toBe('B');
      expect(screen.queryByText('No data')).toBeNull();
      cleanup();

      const emptyText = vi.fn(() => 'From function');
      renderTable({ dataSource: [], locale: { emptyText } });
      expect(screen.getByText('From function')).toBeTruthy();
      expect(emptyText).toHaveBeenCalled();
    });

    test('the `emptyText` prop is an alias that also takes a function', () => {
      renderTable({ dataSource: [], emptyText: 'Alias node' });
      expect(screen.getByText('Alias node')).toBeTruthy();
      cleanup();

      renderTable({ dataSource: [], emptyText: () => 'Alias function' });
      expect(screen.getByText('Alias function')).toBeTruthy();
    });

    test('locale.emptyText wins over the alias', () => {
      renderTable({ dataSource: [], emptyText: 'Alias', locale: { emptyText: 'Locale' } });
      expect(screen.getByText('Locale')).toBeTruthy();
      expect(screen.queryByText('Alias')).toBeNull();
    });

    test('loading still shows the spinner instead of the empty text', () => {
      const { container } = renderTable({
        dataSource: [],
        loading: true,
        locale: { emptyText: 'Locale' },
      });
      expect(screen.queryByText('Locale')).toBeNull();
      expect(container.querySelector('.lobe-table-placeholder')).toBeTruthy();
    });
  });

  test('locale changes re-render the texts', () => {
    const { rerender } = renderTable({ locale: { triggerAsc: 'First' } });
    expect(sortButton().dataset.tooltipTitle).toBe('First');
    act(() => {
      rerender(
        <ConfigProvider motion={motion}>
          <Table<Row>
            columns={columns}
            dataSource={rows}
            locale={{ triggerAsc: 'Second' }}
            pagination={false}
          />
        </ConfigProvider>,
      );
    });
    expect(sortButton().dataset.tooltipTitle).toBe('Second');
  });
});
