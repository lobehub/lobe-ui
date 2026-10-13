import { cleanup, fireEvent, render as rtlRender, screen, within } from '@testing-library/react';
import { motion } from 'motion/react';
import { type Key, type ReactNode, useState } from 'react';

import ConfigProvider from '@/ConfigProvider';

import Table from '../Table';
import type { TableColumn, TableExpandIconProps, TableProps } from '../type';

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
  age: number;
  children?: Row[];
  key: string;
  name: string;
}

const rows: Row[] = [
  { age: 32, key: '1', name: 'John' },
  { age: 42, key: '2', name: 'Jim' },
  { age: 28, key: '3', name: 'Joe' },
];

const columns: TableColumn<Row>[] = [
  { dataIndex: 'name', key: 'name', title: 'Name' },
  { dataIndex: 'age', key: 'age', title: 'Age' },
];

const tree: Row[] = [
  {
    age: 60,
    children: [
      { age: 30, key: '1-2', name: 'Child B' },
      {
        age: 20,
        children: [{ age: 5, key: '1-1-1', name: 'Grandchild' }],
        key: '1-1',
        name: 'Child A',
      },
    ],
    key: '1',
    name: 'Parent',
  },
  { age: 50, key: '2', name: 'Single' },
];

const expandedRowRender = (record: Row) => <p>detail of {record.name}</p>;

const bodyRows = (container: HTMLElement) =>
  [...container.querySelectorAll('tbody > tr')].filter(
    (row) => !row.classList.contains('lobe-table-measure-row'),
  ) as HTMLTableRowElement[];
const dataRows = (container: HTMLElement) =>
  bodyRows(container).filter((row) => row.hasAttribute('data-row-key'));
const rowKeys = (container: HTMLElement) => dataRows(container).map((row) => row.dataset.rowKey);
const expandedRows = (container: HTMLElement) =>
  [...container.querySelectorAll('tr.lobe-table-expanded-row')] as HTMLTableRowElement[];
const visibleExpanded = (container: HTMLElement) =>
  expandedRows(container)
    .filter((row) => row.style.display !== 'none')
    .map((row) => row.textContent);
const iconOf = (container: HTMLElement, key: string) =>
  container.querySelector<HTMLButtonElement>(
    `tr[data-row-key="${key}"] .lobe-table-row-expand-icon`,
  )!;

const renderTable = (props: Partial<TableProps<Row>> = {}) =>
  render(<Table columns={columns} dataSource={rows} pagination={false} {...props} />);

describe('Table expandable rows', () => {
  afterEach(cleanup);

  test('expandedRowRender adds an expand column whose icon toggles the row', () => {
    const { container } = renderTable({ expandable: { expandedRowRender } });

    expect(container.querySelectorAll('thead th')).toHaveLength(3);
    expect(container.querySelector('col.lobe-table-expand-icon-col')).not.toBeNull();
    expect(container.querySelectorAll('td.lobe-table-row-expand-icon-cell')).toHaveLength(3);
    expect(expandedRows(container)).toHaveLength(0);

    fireEvent.click(iconOf(container, '2'));
    expect(visibleExpanded(container)).toEqual(['detail of Jim']);
    expect(iconOf(container, '2').getAttribute('aria-expanded')).toBe('true');

    fireEvent.click(iconOf(container, '2'));
    expect(visibleExpanded(container)).toEqual([]);
    expect(iconOf(container, '2').getAttribute('aria-expanded')).toBe('false');
  });

  test('the default icon is a lobe button with antd class names and labels', () => {
    const { container } = renderTable({
      expandable: { expandedRowRender, rowExpandable: (record) => record.key !== '3' },
    });

    const icon = iconOf(container, '1');
    expect(icon.tagName).toBe('BUTTON');
    expect(icon.getAttribute('type')).toBe('button');
    expect(icon.getAttribute('aria-label')).toBe('Expand row');
    expect(icon.classList.contains('lobe-table-row-expand-icon-collapsed')).toBe(true);

    fireEvent.click(icon);
    expect(icon.getAttribute('aria-label')).toBe('Collapse row');
    expect(icon.classList.contains('lobe-table-row-expand-icon-expanded')).toBe(true);

    // rowExpandable: false keeps an invisible spacer instead of a toggle.
    expect(iconOf(container, '3').classList.contains('lobe-table-row-expand-icon-spaced')).toBe(
      true,
    );
    expect(container.querySelector('[class*="ant-"]')).toBeNull();
  });

  test('expandedRowRender receives record, index, indent and expanded', () => {
    const render = vi.fn(() => 'content');
    const { container } = renderTable({
      expandable: { defaultExpandedRowKeys: ['2'], expandedRowRender: render },
    });

    expect(render).toHaveBeenCalledWith(rows[1], 1, 1, true);
    expect(visibleExpanded(container)).toEqual(['content']);
  });

  test('defaultExpandedRowKeys is uncontrolled and reports onExpand / onExpandedRowsChange', () => {
    const onExpand = vi.fn();
    const onExpandedRowsChange = vi.fn();
    const { container } = renderTable({
      expandable: {
        defaultExpandedRowKeys: ['1'],
        expandedRowRender,
        onExpand,
        onExpandedRowsChange,
      },
    });

    expect(visibleExpanded(container)).toEqual(['detail of John']);

    fireEvent.click(iconOf(container, '3'));
    expect(onExpand).toHaveBeenLastCalledWith(true, rows[2]);
    expect(onExpandedRowsChange).toHaveBeenLastCalledWith(['1', '3']);
    expect(visibleExpanded(container)).toEqual(['detail of John', 'detail of Joe']);

    fireEvent.click(iconOf(container, '1'));
    expect(onExpand).toHaveBeenLastCalledWith(false, rows[0]);
    expect(onExpandedRowsChange).toHaveBeenLastCalledWith(['3']);
  });

  test('expandedRowKeys is controlled', () => {
    const onExpandedRowsChange = vi.fn();
    const Controlled = () => {
      const [keys, setKeys] = useState<readonly Key[]>(['2']);
      return (
        <>
          <button type="button" onClick={() => setKeys(['1', '3'])}>
            set
          </button>
          <Table
            columns={columns}
            dataSource={rows}
            pagination={false}
            expandable={{
              expandedRowKeys: keys,
              expandedRowRender,
              onExpandedRowsChange: (next) => {
                onExpandedRowsChange(next);
                if (next.length < 3) setKeys(next);
              },
            }}
          />
        </>
      );
    };
    const { container } = render(<Controlled />);

    expect(visibleExpanded(container)).toEqual(['detail of Jim']);

    fireEvent.click(screen.getByText('set'));
    expect(visibleExpanded(container)).toEqual(['detail of John', 'detail of Joe']);

    // The parent refuses a third key: the controlled keys stay as they are.
    fireEvent.click(iconOf(container, '2'));
    expect(onExpandedRowsChange).toHaveBeenLastCalledWith(['1', '3', '2']);
    expect(visibleExpanded(container)).toEqual(['detail of John', 'detail of Joe']);
  });

  test('a fixed expandedRowKeys ignores clicks', () => {
    const { container } = renderTable({
      expandable: { expandedRowKeys: [], expandedRowRender },
    });

    fireEvent.click(iconOf(container, '1'));
    expect(visibleExpanded(container)).toEqual([]);
  });

  test('expandRowByClick toggles from anywhere on the row and keeps onRow clicks', () => {
    const onClick = vi.fn();
    const { container } = renderTable({
      expandable: { expandedRowRender, expandRowByClick: true },
      onRow: () => ({ onClick }),
    });

    fireEvent.click(screen.getByText('Joe'));
    expect(visibleExpanded(container)).toEqual(['detail of Joe']);
    expect(onClick).toHaveBeenCalledTimes(1);

    // The icon still toggles exactly once.
    fireEvent.click(iconOf(container, '3'));
    expect(visibleExpanded(container)).toEqual([]);
  });

  test('a custom expandIcon receives the antd props', () => {
    const expandIcon = vi.fn(({ expanded, onExpand, record }: TableExpandIconProps<Row>) => (
      <button type="button" onClick={(event) => onExpand(record, event)}>
        {expanded ? '-' : '+'}
        {record.name}
      </button>
    ));
    const { container } = renderTable({
      expandable: {
        expandIcon,
        expandedRowRender,
        rowExpandable: (record) => record.key !== '2',
      },
    });

    expect(expandIcon).toHaveBeenCalledWith(
      expect.objectContaining({
        expandable: false,
        expanded: false,
        prefixCls: 'lobe-table',
        record: rows[1],
      }),
    );
    expect(container.querySelector('.lobe-table-row-expand-icon')).toBeNull();

    fireEvent.click(screen.getByText('+John'));
    expect(screen.getByText('-John')).toBeTruthy();
    expect(visibleExpanded(container)).toEqual(['detail of John']);
  });

  test('showExpandColumn: false hides the column but rows still expand', () => {
    const { container } = renderTable({
      expandable: {
        defaultExpandedRowKeys: ['1'],
        expandedRowRender,
        showExpandColumn: false,
      },
    });

    expect(container.querySelectorAll('thead th')).toHaveLength(2);
    expect(container.querySelector('.lobe-table-row-expand-icon-cell')).toBeNull();
    expect(visibleExpanded(container)).toEqual(['detail of John']);
  });

  test('columnTitle, columnWidth and fixed shape the expand column', () => {
    const { container } = renderTable({
      expandable: { columnTitle: 'More', columnWidth: 64, expandedRowRender, fixed: 'right' },
      scroll: { x: 800 },
    });

    const headers = [...container.querySelectorAll('thead th')];
    expect(headers.at(-1)!.textContent).toBe('More');
    expect(headers.at(-1)!.className).toContain('lobe-table-cell-fix-end');
    expect(
      container.querySelector('col.lobe-table-expand-icon-col')!.getAttribute('style'),
    ).toContain('width: 64px');
    const firstRowCells = [...dataRows(container)[0].querySelectorAll('td')];
    expect(firstRowCells.at(-1)!.className).toContain('lobe-table-row-expand-icon-cell');
  });

  test('fixed: left pins the expand column at the start', () => {
    const { container } = renderTable({
      expandable: { expandedRowRender, fixed: 'left' },
      scroll: { x: 800 },
    });

    expect(container.querySelector('thead th')!.className).toContain('lobe-table-cell-fix-start');
  });

  test('expandedRowClassName accepts a string or a function with indent', () => {
    const { container, rerender } = renderTable({
      expandable: { defaultExpandAllRows: true, expandedRowClassName: 'extra', expandedRowRender },
    });
    expect(expandedRows(container).every((row) => row.classList.contains('extra'))).toBe(true);

    const className = vi.fn(
      (record: Row, _index: number, indent: number) => `x-${record.key}-${indent}`,
    );
    rerender(
      <Table
        columns={columns}
        dataSource={rows}
        expandable={{ expandedRowClassName: className, expandedRowRender }}
        pagination={false}
      />,
    );
    expect(
      expandedRows(container).map((row) =>
        row.classList.contains(`x-${row.previousElementSibling!.getAttribute('data-row-key')}-0`),
      ),
    ).toEqual([true, true, true]);
    expect(className).toHaveBeenCalledWith(rows[0], 0, 0);
  });

  test('forceRender mounts collapsed expanded rows hidden', () => {
    const { container } = renderTable({ expandable: { expandedRowRender, forceRender: true } });

    expect(expandedRows(container)).toHaveLength(3);
    expect(visibleExpanded(container)).toEqual([]);
  });

  test('Table.EXPAND_COLUMN places the expand column', () => {
    const { container } = renderTable({
      columns: [columns[0], Table.EXPAND_COLUMN, columns[1]],
      expandable: { expandedRowRender },
    });

    const cells = dataRows(container)[0].querySelectorAll('td');
    expect(cells[0].textContent).toBe('John');
    expect(cells[1].className).toContain('lobe-table-row-expand-icon-cell');
    expect(cells[2].textContent).toBe('32');
  });

  test('Table.EXPAND_COLUMN survives table-level column defaults', () => {
    const { container } = renderTable({
      column: { align: 'center' },
      columns: [columns[0], Table.EXPAND_COLUMN, columns[1]],
      expandable: { expandedRowRender },
    });

    expect(dataRows(container)[0].querySelectorAll('td')[1].className).toContain(
      'lobe-table-row-expand-icon-cell',
    );
  });

  test('expandedRowOffset (deprecated) pins the leading columns and offsets the expanded row', () => {
    const { container } = renderTable({
      columns: [columns[0], Table.EXPAND_COLUMN, columns[1]],
      expandable: { defaultExpandedRowKeys: ['1'], expandedRowOffset: 2, expandedRowRender },
      scroll: { x: 800 },
    });

    const headers = container.querySelectorAll('thead th');
    expect(headers[0].className).toContain('lobe-table-cell-fix-start');
    expect(headers[1].className).toContain('lobe-table-cell-fix-start');
    const expandedCells = [...expandedRows(container)[0].querySelectorAll('td')];
    // The two leading cells span down into the expanded row, which fills the remaining column.
    expect(expandedCells).toHaveLength(1);
    const leading = [...dataRows(container)[0].querySelectorAll('td')].slice(0, 2);
    expect(leading.map((cell) => cell.getAttribute('rowspan'))).toEqual(['2', '2']);
    expect(expandedCells.at(-1)!.textContent).toBe('detail of John');
  });

  test('with horizontal scroll the expanded content sticks beside the offset columns', () => {
    const { container } = renderTable({
      columns: [columns[0], Table.EXPAND_COLUMN, columns[1]],
      expandable: { defaultExpandedRowKeys: ['1'], expandedRowOffset: 2, expandedRowRender },
      scroll: { x: 800 },
    });

    const fixed = expandedRows(container)[0].querySelector<HTMLElement>(
      '.lobe-table-expanded-row-fixed',
    )!;
    expect(fixed.style.position).toBe('sticky');
    expect(fixed.textContent).toBe('detail of John');
  });

  test('legacy top-level expandedRowRender / expandIconColumnIndex still work', () => {
    const { container } = renderTable({ expandIconColumnIndex: 1, expandedRowRender });

    const cells = dataRows(container)[0].querySelectorAll('td');
    expect(cells[1].className).toContain('lobe-table-row-expand-icon-cell');
    fireEvent.click(iconOf(container, '1'));
    expect(visibleExpanded(container)).toEqual(['detail of John']);
  });

  test('a nested Table renders inside the expanded row as its own wrapper', () => {
    const { container } = renderTable({
      variant: 'outlined' as const,
      expandable: {
        defaultExpandedRowKeys: ['1'],
        expandedRowRender: () => (
          <Table
            columns={columns}
            dataSource={rows.slice(0, 2)}
            pagination={false}
            variant="outlined"
          />
        ),
      },
    });

    const cell = expandedRows(container)[0].querySelector('td')!;
    const nested = cell.querySelector(':scope > .lobe-table-wrapper')!;
    expect(nested).not.toBeNull();
    expect(nested.querySelector('.lobe-table-outlined')).not.toBeNull();
    expect(within(nested as HTMLElement).getAllByText('Jim')).toHaveLength(1);
  });
});

describe('Table tree data', () => {
  afterEach(cleanup);

  test('children render as collapsible tree rows with indent', () => {
    const { container } = renderTable({ dataSource: tree });

    expect(rowKeys(container)).toEqual(['1', '2']);
    // Tree data puts the toggle into the first column instead of a separate column.
    expect(container.querySelector('.lobe-table-row-expand-icon-cell')).toBeNull();
    expect(container.querySelectorAll('thead th')).toHaveLength(2);
    expect(iconOf(container, '2').classList.contains('lobe-table-row-expand-icon-spaced')).toBe(
      true,
    );

    fireEvent.click(iconOf(container, '1'));
    expect(rowKeys(container)).toEqual(['1', '1-2', '1-1', '2']);

    const child = container.querySelector<HTMLElement>('tr[data-row-key="1-1"]')!;
    expect(child.classList.contains('lobe-table-row-level-1')).toBe(true);
    const indent = child.querySelector<HTMLElement>('.lobe-table-row-indent')!;
    expect(indent.classList.contains('indent-level-1')).toBe(true);
    expect(indent.style.paddingLeft).toBe('15px');

    fireEvent.click(iconOf(container, '1'));
    expect(rowKeys(container)).toEqual(['1', '2']);
  });

  test('defaultExpandAllRows expands every level; indentSize sets the indent', () => {
    const { container } = renderTable({
      dataSource: tree,
      expandable: { defaultExpandAllRows: true, indentSize: 24 },
    });

    expect(rowKeys(container)).toEqual(['1', '1-2', '1-1', '1-1-1', '2']);
    const grandchild = container.querySelector('tr[data-row-key="1-1-1"] .lobe-table-row-indent')!;
    expect((grandchild as HTMLElement).style.paddingLeft).toBe('48px');
  });

  test('legacy top-level indentSize and childrenColumnName apply', () => {
    const data = [{ age: 1, items: [{ age: 2, key: 'c', name: 'Kid' }], key: 'p', name: 'Mom' }];
    const { container } = render(
      <Table
        childrenColumnName="items"
        columns={columns}
        dataSource={data as Row[]}
        expandable={{ defaultExpandAllRows: true }}
        indentSize={10}
        pagination={false}
      />,
    );

    expect(rowKeys(container)).toEqual(['p', 'c']);
    expect(
      container.querySelector<HTMLElement>('tr[data-row-key="c"] .lobe-table-row-indent')!.style
        .paddingLeft,
    ).toBe('10px');
  });

  test('expandable.childrenColumnName reads a custom children field', () => {
    const data = [{ age: 1, key: 'p', name: 'Mom', sub: [{ age: 2, key: 'c', name: 'Kid' }] }];
    const { container } = render(
      <Table
        columns={columns}
        dataSource={data as Row[]}
        expandable={{ childrenColumnName: 'sub' }}
        pagination={false}
      />,
    );

    expect(rowKeys(container)).toEqual(['p']);
    fireEvent.click(iconOf(container, 'p'));
    expect(rowKeys(container)).toEqual(['p', 'c']);
  });

  test('rowClassName receives the tree indent as its third argument', () => {
    const rowClassName = vi.fn((record: Row, _index: number, indent: number) => `lvl-${indent}`);
    const { container } = renderTable({
      dataSource: tree,
      expandable: { defaultExpandAllRows: true },
      rowClassName,
    });

    expect(container.querySelector('tr[data-row-key="1-1-1"]')!.classList.contains('lvl-2')).toBe(
      true,
    );
    // `index` counts the flattened rows, like antd.
    expect(rowClassName).toHaveBeenCalledWith(tree[0].children![1], 2, 1);
  });

  test('sorting applies to every tree level', () => {
    const { container } = renderTable({
      columns: [
        columns[0],
        { dataIndex: 'age', key: 'age', sorter: (a, b) => a.age - b.age, title: 'Age' },
      ],
      dataSource: tree,
      expandable: { defaultExpandAllRows: true },
    });

    expect(rowKeys(container)).toEqual(['1', '1-2', '1-1', '1-1-1', '2']);
    fireEvent.click(screen.getByText('Age'));
    // Ascending: 50 before 60 at the top, 20 before 30 among the children.
    expect(rowKeys(container)).toEqual(['2', '1', '1-1', '1-1-1', '1-2']);
  });

  test('filtering applies to children before testing their parent', () => {
    const { container } = renderTable({
      columns: [
        {
          dataIndex: 'name',
          filteredValue: ['keep'],
          filters: [{ text: 'keep', value: 'keep' }],
          key: 'name',
          // A parent stays when it or any remaining child matches.
          onFilter: (_value, record) =>
            record.name.startsWith('Child A') ||
            record.name === 'Grandchild' ||
            Boolean(record.children?.length),
          title: 'Name',
        },
        columns[1],
      ],
      dataSource: tree,
      expandable: { defaultExpandAllRows: true },
    });

    expect(rowKeys(container)).toEqual(['1', '1-1', '1-1-1']);
  });

  test('pagination counts top-level records only', () => {
    const many: Row[] = Array.from({ length: 12 }, (_, index) => ({
      age: index,
      children: [{ age: 0, key: `${index}-c`, name: `child ${index}` }],
      key: String(index),
      name: `row ${index}`,
    }));
    const { container } = renderTable({
      dataSource: many,
      expandable: { defaultExpandAllRows: true },
      pagination: { pageSize: 5 },
    });

    expect(rowKeys(container)).toHaveLength(10);
    expect(rowKeys(container).filter((key) => !key!.includes('-'))).toHaveLength(5);
  });
});
