import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { type Key, useState } from 'react';

import Table from '../Table';
import type { TableColumn, TableProps, TableRowSelection } from '../type';

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
  { age: 18, key: '4', name: 'Jack' },
];

const columns: TableColumn<Row>[] = [
  { dataIndex: 'name', key: 'name', title: 'Name' },
  { dataIndex: 'age', key: 'age', title: 'Age' },
];

const tree: Row[] = [
  {
    age: 60,
    children: [
      { age: 30, key: '1-1', name: 'Child A' },
      {
        age: 20,
        children: [{ age: 5, key: '1-2-1', name: 'Grandchild' }],
        key: '1-2',
        name: 'Child B',
      },
    ],
    key: '1',
    name: 'Parent',
  },
  { age: 50, key: '2', name: 'Single' },
];

const renderTable = (props: Partial<TableProps<Row>>) =>
  render(<Table<Row> columns={columns} dataSource={rows} pagination={false} {...props} />);

const dataRows = (container: HTMLElement) =>
  [...container.querySelectorAll('tbody > tr[data-row-key]')] as HTMLTableRowElement[];
const rowOf = (container: HTMLElement, key: string) =>
  container.querySelector(`tbody > tr[data-row-key="${key}"]`) as HTMLTableRowElement;
const boxOf = (container: HTMLElement, key: string) =>
  rowOf(container, key).querySelector('[role="checkbox"], [role="radio"]') as HTMLElement;
const headerBox = () =>
  screen.getByRole('checkbox', { name: /select (all|current page)|custom selection/i });
const isChecked = (box: HTMLElement) => box.getAttribute('aria-checked') === 'true';
const isMixed = (box: HTMLElement) => box.getAttribute('aria-checked') === 'mixed';
const selectedKeys = (container: HTMLElement) =>
  dataRows(container)
    .filter((row) => row.classList.contains('lobe-table-row-selected'))
    .map((row) => row.dataset.rowKey);

afterEach(cleanup);

describe('Table rowSelection', () => {
  it('renders a selection column of checkboxes, first by default', () => {
    const { container } = renderTable({ rowSelection: {} });
    const headerCells = container.querySelectorAll('thead th');
    expect(headerCells[0].classList.contains('lobe-table-selection-column')).toBe(true);
    expect(within(headerCells[0] as HTMLElement).getByRole('checkbox')).toBeTruthy();
    expect(dataRows(container).every((row) => within(row).queryByRole('checkbox'))).toBe(true);
    expect(container.querySelector('col.lobe-table-selection-col')).toBeTruthy();
  });

  it('selects a row and reports onChange (type single) and onSelect', () => {
    const onChange = vi.fn();
    const onSelect = vi.fn();
    const { container } = renderTable({ rowSelection: { onChange, onSelect } });

    fireEvent.click(boxOf(container, '2'));
    expect(onChange).toHaveBeenLastCalledWith(['2'], [rows[1]], { type: 'single' });
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0].slice(0, 3)).toEqual([rows[1], true, [rows[1]]]);
    expect(onSelect.mock.calls[0][3]).toBeInstanceOf(Event);
    expect(isChecked(boxOf(container, '2'))).toBe(true);
    expect(selectedKeys(container)).toEqual(['2']);

    fireEvent.click(boxOf(container, '2'));
    expect(onChange).toHaveBeenLastCalledWith([], [], { type: 'single' });
    expect(onSelect.mock.calls[1].slice(0, 3)).toEqual([rows[1], false, []]);
    expect(selectedKeys(container)).toEqual([]);
  });

  it('starts from defaultSelectedRowKeys', () => {
    const { container } = renderTable({ rowSelection: { defaultSelectedRowKeys: ['1', '3'] } });
    expect(selectedKeys(container)).toEqual(['1', '3']);
    expect(isMixed(headerBox())).toBe(true);
  });

  it('follows controlled selectedRowKeys', () => {
    const onChange = vi.fn();
    const { container, rerender } = renderTable({
      rowSelection: { onChange, selectedRowKeys: ['1'] },
    });
    fireEvent.click(boxOf(container, '2'));
    expect(onChange).toHaveBeenLastCalledWith(['1', '2'], [rows[0], rows[1]], { type: 'single' });
    // Still controlled: nothing changes until the prop does.
    expect(selectedKeys(container)).toEqual(['1']);

    rerender(
      <Table<Row>
        columns={columns}
        dataSource={rows}
        pagination={false}
        rowSelection={{ onChange, selectedRowKeys: ['1', '2'] }}
      />,
    );
    expect(selectedKeys(container)).toEqual(['1', '2']);
  });

  it('renders radios with type radio and keeps a single key', () => {
    const onChange = vi.fn();
    const { container } = renderTable({ rowSelection: { onChange, type: 'radio' } });
    expect(screen.queryByRole('checkbox')).toBeNull();
    expect(screen.getAllByRole('radio')).toHaveLength(rows.length);

    fireEvent.click(boxOf(container, '1'));
    expect(onChange).toHaveBeenLastCalledWith(['1'], [rows[0]], { type: 'single' });
    fireEvent.click(boxOf(container, '3'));
    expect(onChange).toHaveBeenLastCalledWith(['3'], [rows[2]], { type: 'single' });
    expect(selectedKeys(container)).toEqual(['3']);
    expect(boxOf(container, '3').getAttribute('aria-checked')).toBe('true');
    expect(boxOf(container, '1').getAttribute('aria-checked')).toBe('false');
  });

  it('selects all enabled rows from the header and reports onSelectAll (type all)', () => {
    const onChange = vi.fn();
    const onSelectAll = vi.fn();
    const { container } = renderTable({
      rowSelection: {
        getCheckboxProps: (record) => ({ disabled: record.key === '4', name: record.name }),
        onChange,
        onSelectAll,
      },
    });
    expect(boxOf(container, '4').hasAttribute('data-disabled')).toBe(true);

    fireEvent.click(headerBox());
    expect(onChange).toHaveBeenLastCalledWith(['1', '2', '3'], rows.slice(0, 3), { type: 'all' });
    expect(onSelectAll).toHaveBeenLastCalledWith(true, rows.slice(0, 3), rows.slice(0, 3));
    expect(isChecked(headerBox())).toBe(true);

    fireEvent.click(headerBox());
    expect(onChange).toHaveBeenLastCalledWith([], [], { type: 'all' });
    expect(onSelectAll).toHaveBeenLastCalledWith(false, [], rows.slice(0, 3));
  });

  it('disables the header checkbox when every row is disabled', () => {
    renderTable({ rowSelection: { getCheckboxProps: () => ({ disabled: true }) } });
    expect(headerBox().hasAttribute('data-disabled')).toBe(true);
  });

  it('applies getTitleCheckboxProps to the header checkbox', () => {
    const onTitleChange = vi.fn();
    renderTable({
      rowSelection: {
        getTitleCheckboxProps: () => ({ 'aria-label': 'Select all', 'onChange': onTitleChange }),
      },
    });
    fireEvent.click(headerBox());
    expect(onTitleChange).toHaveBeenCalledWith(true);
  });

  it('hides the header checkbox with hideSelectAll', () => {
    renderTable({ rowSelection: { hideSelectAll: true, selections: true } });
    expect(
      screen.queryByRole('checkbox', { name: /select (all|current page)|custom selection/i }),
    ).toBeNull();
    expect(screen.queryByRole('button', { name: 'Selection options' })).toBeNull();
  });

  it('accepts columnTitle as a node or a function of the checkbox', () => {
    renderTable({ rowSelection: { columnTitle: <span>Pick</span> } });
    expect(screen.getByText('Pick')).toBeTruthy();
    expect(screen.queryByRole('checkbox', { name: 'Select all' })).toBeNull();
    cleanup();

    renderTable({
      rowSelection: { columnTitle: (checkbox) => <label data-testid="wrap">{checkbox}All</label> },
    });
    expect(within(screen.getByTestId('wrap')).getByRole('checkbox')).toBeTruthy();
  });

  it('passes columnWidth, align, fixed and onCell to the selection column', () => {
    const { container } = renderTable({
      rowSelection: {
        align: 'right',
        columnWidth: 64,
        fixed: true,
        onCell: (record) => ({ 'data-cell': record.key }) as any,
      },
      scroll: { x: 800 },
    });
    const col = container.querySelector('col.lobe-table-selection-col') as HTMLElement;
    expect(col.style.width).toBe('64px');
    const cell = rowOf(container, '1').querySelector('td') as HTMLElement;
    expect(cell.dataset.cell).toBe('1');
    expect(cell.style.textAlign).toBe('right');
    expect(cell.classList.contains('lobe-table-cell-fix-start')).toBe(true);
  });

  it('inherits fixed from the neighbour column', () => {
    const { container } = renderTable({
      columns: [{ ...columns[0], fixed: 'left', width: 100 }, columns[1]],
      rowSelection: {},
      scroll: { x: 800 },
    });
    const cell = rowOf(container, '1').querySelector('td') as HTMLElement;
    expect(cell.classList.contains('lobe-table-cell-fix-start')).toBe(true);
  });

  it('lets renderCell wrap the box or return a RenderedCell', () => {
    const renderCell = vi.fn((checked: boolean, record: Row, index: number, node: any) =>
      index === 0 ? (
        { children: <div data-testid="spanned">{node}</div>, props: { rowSpan: 2 } }
      ) : index === 1 ? (
        { children: node, props: { rowSpan: 0 } }
      ) : (
        <span data-checked={String(checked)} data-testid={`cell-${record.key}`}>
          {node}
        </span>
      ),
    );
    const { container } = renderTable({
      rowSelection: { defaultSelectedRowKeys: ['3'], renderCell },
    });
    expect(screen.getByTestId('cell-3').dataset.checked).toBe('true');
    expect(screen.getByTestId('cell-4').dataset.checked).toBe('false');
    const first = rowOf(container, '1').querySelector('td') as HTMLTableCellElement;
    expect(first.rowSpan).toBe(2);
    expect(within(screen.getByTestId('spanned')).getByRole('checkbox')).toBeTruthy();
    expect(within(rowOf(container, '2')).queryByRole('checkbox')).toBeNull();
  });

  it('places the column at Table.SELECTION_COLUMN and drops it without rowSelection', () => {
    const ordered: TableColumn<Row>[] = [columns[0], Table.SELECTION_COLUMN, columns[1]];
    const { container, rerender } = renderTable({ columns: ordered, rowSelection: {} });
    const headers = [...container.querySelectorAll('thead th')];
    expect(headers[0].textContent).toBe('Name');
    expect(headers[1].classList.contains('lobe-table-selection-column')).toBe(true);
    expect(headers[2].textContent).toBe('Age');

    rerender(<Table<Row> columns={ordered} dataSource={rows} pagination={false} />);
    expect(container.querySelectorAll('thead th')).toHaveLength(2);
    expect(container.querySelector('.lobe-table-selection-column')).toBeNull();
  });

  it('puts the selection column after a leading expand column', () => {
    const { container } = renderTable({
      expandable: { expandedRowRender: (record) => <p>{record.name}</p> },
      rowSelection: {},
    });
    const cells = rowOf(container, '1').querySelectorAll('td');
    expect(cells[0].classList.contains('lobe-table-row-expand-icon-cell')).toBe(true);
    expect(cells[1].classList.contains('lobe-table-selection-column')).toBe(true);
  });

  it('places tree toggles in the column after the selection column', () => {
    const { container } = renderTable({ dataSource: tree, rowSelection: {} });
    const cells = rowOf(container, '1').querySelectorAll('td');
    expect(cells[0].querySelector('.lobe-table-row-expand-icon')).toBeNull();
    expect(cells[1].querySelector('.lobe-table-row-expand-icon')).toBeTruthy();
  });

  it('does not trigger row clicks from the checkbox', () => {
    const onClick = vi.fn();
    const { container } = renderTable({ onRow: () => ({ onClick }), rowSelection: {} });
    fireEvent.click(boxOf(container, '1'));
    expect(onClick).not.toHaveBeenCalled();
    expect(selectedKeys(container)).toEqual(['1']);
  });

  it('removes the uncontrolled selection when rowSelection goes away', () => {
    const { container, rerender } = renderTable({ rowSelection: {} });
    fireEvent.click(boxOf(container, '1'));
    rerender(<Table<Row> columns={columns} dataSource={rows} pagination={false} />);
    rerender(
      <Table<Row> columns={columns} dataSource={rows} pagination={false} rowSelection={{}} />,
    );
    expect(selectedKeys(container)).toEqual([]);
  });

  describe('Shift multiple selection', () => {
    it('selects and deselects the range from the last click', () => {
      const onChange = vi.fn();
      const onSelectMultiple = vi.fn();
      const { container } = renderTable({ rowSelection: { onChange, onSelectMultiple } });

      fireEvent.click(boxOf(container, '1'));
      fireEvent.click(boxOf(container, '3'), { shiftKey: true });
      expect(onChange).toHaveBeenLastCalledWith(['1', '2', '3'], rows.slice(0, 3), {
        type: 'multiple',
      });
      expect(onSelectMultiple).toHaveBeenLastCalledWith(true, rows.slice(0, 3), [rows[1], rows[2]]);

      // From the anchor (row 3) back to row 1: every row is selected, so the range clears.
      fireEvent.click(boxOf(container, '1'), { shiftKey: true });
      expect(onChange).toHaveBeenLastCalledWith([], [], { type: 'multiple' });
      expect(selectedKeys(container)).toEqual([]);
    });

    it('is a single toggle without any selection yet', () => {
      const onChange = vi.fn();
      const { container } = renderTable({ rowSelection: { onChange } });
      fireEvent.click(boxOf(container, '3'), { shiftKey: true });
      expect(onChange).toHaveBeenLastCalledWith(['3'], [rows[2]], { type: 'single' });
    });
  });

  describe('selections', () => {
    const openSelections = async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Selection options' }));
      await waitFor(() => expect(screen.getAllByRole('menuitem').length).toBeGreaterThan(0));
    };
    const clickItem = (name: string) =>
      act(() => {
        fireEvent.click(screen.getByRole('menuitem', { name }));
      });

    const paged = Array.from({ length: 12 }, (_, index) => ({
      age: index,
      key: String(index),
      name: `Row ${index}`,
    }));

    it('offers all / invert / none with selections: true', async () => {
      const onChange = vi.fn();
      const onSelectInvert = vi.fn();
      const onSelectNone = vi.fn();
      const { container } = render(
        <Table<Row>
          columns={columns}
          dataSource={paged}
          pagination={{ pageSize: 5 }}
          rowSelection={{
            getCheckboxProps: (record) => ({ disabled: record.key === '1' }),
            onChange,
            onSelectInvert,
            onSelectNone,
            selections: true,
          }}
        />,
      );
      expect(container.querySelector('col.lobe-table-selection-col-with-dropdown')).toBeTruthy();
      expect(headerBox().getAttribute('aria-label')).toBe('Custom selection');

      await openSelections();
      expect(screen.getAllByRole('menuitem').map((item) => item.textContent)).toEqual([
        'Select all data',
        'Invert current page',
        'Clear all data',
      ]);

      // Select all data: every page; the disabled row (on this page) is skipped.
      clickItem('Select all data');
      const allKeys = paged.map(({ key }) => key).filter((key) => key !== '1');
      expect(onChange).toHaveBeenLastCalledWith(allKeys, expect.any(Array), { type: 'all' });

      await openSelections();
      clickItem('Invert current page');
      const afterInvert = allKeys.filter((key) => Number(key) >= 5);
      expect(onChange).toHaveBeenLastCalledWith(afterInvert, expect.any(Array), {
        type: 'invert',
      });
      expect(onSelectInvert).toHaveBeenLastCalledWith(afterInvert);

      await openSelections();
      clickItem('Clear all data');
      expect(onChange).toHaveBeenLastCalledWith([], [], { type: 'none' });
      expect(onSelectNone).toHaveBeenCalledTimes(1);
    });

    it('takes presets and custom items; custom onSelect gets the page keys', async () => {
      const onSelect = vi.fn();
      render(
        <Table<Row>
          columns={columns}
          dataSource={paged}
          pagination={{ pageSize: 5 }}
          rowSelection={{
            selections: [Table.SELECTION_NONE, { key: 'odd', onSelect, text: 'Odd rows' }],
          }}
        />,
      );
      await openSelections();
      expect(screen.getAllByRole('menuitem').map((item) => item.textContent)).toEqual([
        'Clear all data',
        'Odd rows',
      ]);
      clickItem('Odd rows');
      expect(onSelect).toHaveBeenCalledWith(['0', '1', '2', '3', '4']);
    });

    it('exposes the preset constants', () => {
      expect(Table.SELECTION_ALL).toBe('SELECT_ALL');
      expect(Table.SELECTION_INVERT).toBe('SELECT_INVERT');
      expect(Table.SELECTION_NONE).toBe('SELECT_NONE');
    });
  });

  describe('preserveSelectedRowKeys', () => {
    const Remote = ({ preserve, ...rest }: { preserve: boolean } & TableRowSelection<Row>) => {
      const [data, setData] = useState(rows.slice(0, 2));
      return (
        <>
          <button type="button" onClick={() => setData(rows.slice(2))}>
            next
          </button>
          <Table<Row>
            columns={columns}
            dataSource={data}
            pagination={false}
            rowSelection={{ preserveSelectedRowKeys: preserve, ...rest }}
          />
        </>
      );
    };

    it('keeps keys (and their records) of rows that left dataSource', () => {
      const onChange = vi.fn();
      const { container } = render(<Remote preserve onChange={onChange} />);
      fireEvent.click(boxOf(container, '1'));
      fireEvent.click(screen.getByText('next'));
      fireEvent.click(boxOf(container, '3'));
      expect(onChange).toHaveBeenLastCalledWith(['1', '3'], [rows[0], rows[2]], {
        type: 'single',
      });
    });

    it('drops them otherwise', () => {
      const onChange = vi.fn();
      const { container } = render(<Remote preserve={false} onChange={onChange} />);
      fireEvent.click(boxOf(container, '1'));
      fireEvent.click(screen.getByText('next'));
      fireEvent.click(boxOf(container, '3'));
      expect(onChange).toHaveBeenLastCalledWith(['3'], [rows[2]], { type: 'single' });
    });
  });

  describe('tree data', () => {
    const renderTree = (rowSelection: TableRowSelection<Row>) =>
      render(
        <Table<Row>
          columns={columns}
          dataSource={tree}
          expandable={{ defaultExpandAllRows: true }}
          pagination={false}
          rowSelection={rowSelection}
        />,
      );

    it('keeps parents and children independent by default', () => {
      const onChange = vi.fn();
      const { container } = renderTree({ onChange });
      fireEvent.click(boxOf(container, '1'));
      expect(onChange).toHaveBeenLastCalledWith(['1'], [tree[0]], { type: 'single' });
    });

    it('cascades with checkStrictly: false', () => {
      const onChange = vi.fn();
      const { container } = renderTree({ checkStrictly: false, onChange });

      fireEvent.click(boxOf(container, '1'));
      expect([...onChange.mock.lastCall![0]].sort()).toEqual(['1', '1-1', '1-2', '1-2-1']);
      expect(isChecked(boxOf(container, '1-2-1'))).toBe(true);

      // Unchecking a grandchild clears its ancestors and leaves them half checked.
      fireEvent.click(boxOf(container, '1-2-1'));
      expect(onChange.mock.lastCall![0]).toEqual(['1-1']);
      expect(isMixed(boxOf(container, '1'))).toBe(true);
      expect(isChecked(boxOf(container, '1-2'))).toBe(false);

      // Checking the last missing leaf checks every ancestor again.
      fireEvent.click(boxOf(container, '1-2-1'));
      expect([...onChange.mock.lastCall![0]].sort()).toEqual(['1', '1-1', '1-2', '1-2-1']);
    });

    it('skips disabled rows when cascading', () => {
      const onChange = vi.fn();
      const { container } = renderTree({
        checkStrictly: false,
        getCheckboxProps: (record) => ({ disabled: record.key === '1-1' }),
        onChange,
      });
      fireEvent.click(boxOf(container, '1-2-1'));
      // Child B's only enabled child is checked, so Child B and Parent follow.
      expect([...onChange.mock.lastCall![0]].sort()).toEqual(['1', '1-2', '1-2-1']);
      expect(isChecked(boxOf(container, '1-1'))).toBe(false);
    });

    it('counts tree children in select all', () => {
      const onChange = vi.fn();
      renderTree({ onChange });
      fireEvent.click(headerBox());
      expect([...onChange.mock.lastCall![0]].sort()).toEqual(['1', '1-1', '1-2', '1-2-1', '2']);
    });
  });

  it('keeps sort / filter / page working next to the selection column', () => {
    const { container } = render(
      <Table<Row>
        dataSource={rows}
        pagination={{ pageSize: 2 }}
        rowSelection={{}}
        columns={[
          {
            dataIndex: 'age',
            key: 'age',
            sorter: (a: Row, b: Row) => a.age - b.age,
            title: 'Age',
          },
        ]}
      />,
    );
    fireEvent.click(screen.getByText('Age'));
    expect(dataRows(container).map((row) => row.dataset.rowKey)).toEqual(['4', '3']);
    fireEvent.click(headerBox());
    expect(selectedKeys(container)).toEqual(['4', '3']);
  });

  it('types keys as React keys', () => {
    const keys: Key[] = [1, 'a'];
    const selection: TableRowSelection<Row> = { selectedRowKeys: keys };
    expect(selection.selectedRowKeys).toBe(keys);
  });
});
