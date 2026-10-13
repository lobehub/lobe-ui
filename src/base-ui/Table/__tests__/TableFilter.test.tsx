import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { motion } from 'motion/react';
import { type ReactNode, useState } from 'react';

import ConfigProvider from '@/ConfigProvider';

import Table from '../Table';
import type { TableColumn, TableFilterDropdownProps, TableFilters, TableProps } from '../type';

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
  provider: index % 3 === 0 ? 'OpenAI' : index % 3 === 1 ? 'Anthropic' : 'Google',
}));

const providerFilters = [
  { text: 'OpenAI', value: 'OpenAI' },
  { text: 'Anthropic', value: 'Anthropic' },
  { text: 'Google', value: 'Google' },
];

const providerColumn = (extra: Partial<TableColumn<Row>> = {}): TableColumn<Row> => ({
  dataIndex: 'provider',
  filters: providerFilters,
  onFilter: (value, record) => record.provider === value,
  title: 'Provider',
  ...extra,
});

const columnsWith = (extra?: Partial<TableColumn<Row>>): TableColumn<Row>[] => [
  { dataIndex: 'model', title: 'Model' },
  providerColumn(extra),
];

const renderTable = (props: Partial<TableProps<Row>> = {}) =>
  render(
    <ConfigProvider motion={motion}>
      <Table columns={columnsWith()} dataSource={rows} pagination={false} rowKey="id" {...props} />
    </ConfigProvider>,
  );

const wrap = (node: ReactNode) => <ConfigProvider motion={motion}>{node}</ConfigProvider>;

const bodyModels = () =>
  screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[0].textContent);

const openFilter = (label = 'Provider') =>
  fireEvent.click(screen.getByRole('button', { name: `Filter ${label}` }));

const ok = () => fireEvent.click(screen.getByRole('button', { name: 'OK' }));

const pressEscape = () =>
  act(() => {
    fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
  });

const lastFilters = (onChange: ReturnType<typeof vi.fn>): TableFilters =>
  onChange.mock.calls.at(-1)![1];

const isDisabled = (element: HTMLElement) =>
  (element as HTMLButtonElement).disabled || element.getAttribute('aria-disabled') === 'true';

const OPENAI = ['m-00', 'm-03', 'm-06', 'm-09'];

describe('Table filters', () => {
  afterEach(cleanup);

  describe('confirm panel', () => {
    test('a checked item applies on OK and reports through onChange', () => {
      const onChange = vi.fn();
      renderTable({ onChange });

      openFilter();
      fireEvent.click(screen.getByRole('checkbox', { name: 'OpenAI' }));
      // Draft only: nothing is filtered before OK.
      expect(bodyModels()).toHaveLength(12);
      expect(onChange).not.toHaveBeenCalled();

      ok();

      expect(bodyModels()).toEqual(OPENAI);
      expect(lastFilters(onChange)).toEqual({ provider: ['OpenAI'] });
    });

    test('closing the panel applies the draft by default (filterOnClose)', async () => {
      renderTable();

      openFilter();
      fireEvent.click(screen.getByRole('checkbox', { name: 'OpenAI' }));
      pressEscape();

      await waitFor(() => expect(bodyModels()).toEqual(OPENAI));
    });

    test('filterOnClose: false discards the draft when the panel closes', async () => {
      renderTable({ columns: columnsWith({ filterOnClose: false }) });

      openFilter();
      fireEvent.click(screen.getByRole('checkbox', { name: 'OpenAI' }));
      pressEscape();

      await waitFor(() => expect(screen.queryByRole('button', { name: 'OK' })).toBeNull());
      expect(bodyModels()).toHaveLength(12);

      openFilter();
      expect(screen.getByRole('checkbox', { name: 'OpenAI' }).getAttribute('aria-checked')).toBe(
        'false',
      );
    });

    test('Reset is disabled without a selection and clears the draft', () => {
      renderTable();

      openFilter();
      expect(isDisabled(screen.getByRole('button', { name: 'Reset' }))).toBe(true);
      fireEvent.click(screen.getByRole('checkbox', { name: 'OpenAI' }));
      ok();
      expect(bodyModels()).toEqual(OPENAI);

      openFilter();
      fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
      ok();

      expect(bodyModels()).toHaveLength(12);
    });

    test('filtering from a later page returns to page 1', () => {
      renderTable({ pagination: { defaultCurrent: 3, pageSize: 5 } });
      expect(bodyModels()).toEqual(['m-10', 'm-11']);

      openFilter();
      fireEvent.click(screen.getByRole('checkbox', { name: 'OpenAI' }));
      ok();

      expect(bodyModels()).toEqual(OPENAI);
    });

    test('an empty filters list shows the empty state', () => {
      renderTable({ columns: columnsWith({ filters: [] }) });

      openFilter();

      expect(screen.getByText('No filters')).toBeTruthy();
    });

    test('filters.children render as nested option groups in menu mode', () => {
      const onChange = vi.fn();
      renderTable({
        columns: columnsWith({
          filters: [
            { text: 'OpenAI', value: 'OpenAI' },
            {
              children: [
                { text: 'Anthropic', value: 'Anthropic' },
                { text: 'Google', value: 'Google' },
              ],
              text: 'Others',
              value: 'others',
            },
          ],
        }),
        onChange,
      });

      openFilter();
      const group = screen.getByRole('group');
      expect(within(group).getByText('Others')).toBeTruthy();
      fireEvent.click(within(group).getByRole('checkbox', { name: 'Google' }));
      ok();

      expect(lastFilters(onChange)).toEqual({ provider: ['Google'] });
    });
  });

  test('filterMultiple: false picks a single value with radios', () => {
    const onChange = vi.fn();
    renderTable({ columns: columnsWith({ filterMultiple: false }), onChange });

    openFilter();
    expect(screen.queryByRole('checkbox', { name: 'OpenAI' })).toBeNull();
    fireEvent.click(screen.getByRole('radio', { name: 'OpenAI' }));
    fireEvent.click(screen.getByRole('radio', { name: 'Google' }));
    expect(screen.getByRole('radio', { name: 'OpenAI' }).getAttribute('aria-checked')).toBe(
      'false',
    );
    ok();

    expect(lastFilters(onChange)).toEqual({ provider: ['Google'] });
    expect(bodyModels()).toEqual(['m-02', 'm-05', 'm-08', 'm-11']);
  });

  describe('filterSearch', () => {
    test('true narrows options by their text', () => {
      renderTable({ columns: columnsWith({ filterSearch: true }) });

      openFilter();
      fireEvent.change(screen.getByPlaceholderText('Search in filters'), {
        target: { value: 'goo' },
      });

      expect(screen.getByRole('checkbox', { name: 'Google' })).toBeTruthy();
      expect(screen.queryByRole('checkbox', { name: 'OpenAI' })).toBeNull();
    });

    test('a function decides which options match', () => {
      const filterSearch = vi.fn((input: string, item: { value: unknown }) =>
        String(item.value).toLowerCase().startsWith(input),
      );
      renderTable({ columns: columnsWith({ filterSearch }) });

      openFilter();
      fireEvent.change(screen.getByPlaceholderText('Search in filters'), {
        target: { value: 'An' },
      });

      expect(filterSearch).toHaveBeenCalledWith('an', expect.objectContaining({ value: 'OpenAI' }));
      expect(screen.getByRole('checkbox', { name: 'Anthropic' })).toBeTruthy();
      expect(screen.queryByRole('checkbox', { name: 'Google' })).toBeNull();
    });

    test('no match shows the empty state', () => {
      renderTable({ columns: columnsWith({ filterSearch: true }) });

      openFilter();
      fireEvent.change(screen.getByPlaceholderText('Search in filters'), {
        target: { value: 'zzz' },
      });

      expect(screen.getByText('No filters')).toBeTruthy();
    });
  });

  describe("filterMode: 'tree'", () => {
    const treeFilters = [
      { text: 'OpenAI', value: 'OpenAI' },
      {
        children: [
          { text: 'Anthropic', value: 'Anthropic' },
          { text: 'Google', value: 'Google' },
        ],
        text: 'Others',
        value: 'others',
      },
    ];
    const treeColumns = (extra: Partial<TableColumn<Row>> = {}) =>
      columnsWith({
        filterMode: 'tree',
        filters: treeFilters,
        onFilter: (value, record) =>
          value === 'others' ? record.provider !== 'OpenAI' : record.provider === value,
        ...extra,
      });

    const treeCheckbox = (name: string) =>
      within(
        screen
          .getAllByRole('treeitem')
          .find((item) => item.textContent === name || item.textContent?.endsWith(name))!,
      ).getByRole('checkbox');

    test('renders filters as a checkable tree and checks a parent with its children', () => {
      const onChange = vi.fn();
      renderTable({ columns: treeColumns(), onChange });

      openFilter();
      expect(screen.getAllByRole('treeitem')).toHaveLength(4);
      fireEvent.click(treeCheckbox('Others'));
      ok();

      expect(lastFilters(onChange)).toEqual({ provider: ['others', 'Anthropic', 'Google'] });
      expect(bodyModels()).toHaveLength(8);
    });

    test('Select all checks every node', () => {
      const onChange = vi.fn();
      renderTable({ columns: treeColumns(), onChange });

      openFilter();
      fireEvent.click(screen.getByRole('checkbox', { name: 'Select all items' }));
      ok();

      expect(lastFilters(onChange)).toEqual({
        provider: ['OpenAI', 'others', 'Anthropic', 'Google'],
      });
    });

    test('filterSearch keeps matching nodes and their ancestors', () => {
      renderTable({ columns: treeColumns({ filterSearch: true }) });

      openFilter();
      fireEvent.change(screen.getByPlaceholderText('Search in filters'), {
        target: { value: 'goo' },
      });

      const items = screen.getAllByRole('treeitem').map((item) => item.textContent);
      expect(items).toHaveLength(2);
      expect(items.some((text) => text?.includes('Others'))).toBe(true);
      expect(items.some((text) => text?.includes('Google'))).toBe(true);
    });

    test('checking a node while searching does not check its pruned-away siblings or parent', () => {
      const onChange = vi.fn();
      renderTable({ columns: treeColumns({ filterSearch: true }), onChange });

      openFilter();
      fireEvent.change(screen.getByPlaceholderText('Search in filters'), {
        target: { value: 'goo' },
      });
      fireEvent.click(treeCheckbox('Google'));
      expect(treeCheckbox('Others').getAttribute('aria-checked')).toBe('false');
      ok();

      expect(lastFilters(onChange)).toEqual({ provider: ['Google'] });
      expect(bodyModels()).toEqual(['m-02', 'm-05', 'm-08', 'm-11']);
    });

    test('checking every child checks the parent; unchecking one clears it', () => {
      const onChange = vi.fn();
      renderTable({ columns: treeColumns(), onChange });

      openFilter();
      fireEvent.click(treeCheckbox('Anthropic'));
      fireEvent.click(treeCheckbox('Google'));
      expect(treeCheckbox('Others').getAttribute('aria-checked')).toBe('true');
      fireEvent.click(treeCheckbox('Google'));
      ok();

      expect(lastFilters(onChange)).toEqual({ provider: ['Anthropic'] });
    });

    test('filterMultiple: false checks a single node', () => {
      const onChange = vi.fn();
      renderTable({ columns: treeColumns({ filterMultiple: false }), onChange });

      openFilter();
      expect(screen.queryByRole('checkbox', { name: 'Select all items' })).toBeNull();
      fireEvent.click(treeCheckbox('OpenAI'));
      fireEvent.click(treeCheckbox('Google'));
      ok();

      expect(lastFilters(onChange)).toEqual({ provider: ['Google'] });
    });
  });

  describe('controlled filter', () => {
    test('filteredValue drives the rows and the panel; onChange reports the request', () => {
      const onChange = vi.fn();
      const { rerender } = renderTable({
        columns: columnsWith({ filteredValue: ['OpenAI'] }),
        onChange,
      });
      expect(bodyModels()).toEqual(OPENAI);

      openFilter();
      expect(screen.getByRole('checkbox', { name: 'OpenAI' }).getAttribute('aria-checked')).toBe(
        'true',
      );
      fireEvent.click(screen.getByRole('checkbox', { name: 'Google' }));
      ok();

      expect(lastFilters(onChange)).toEqual({ provider: ['OpenAI', 'Google'] });
      // Still controlled: rows follow the prop, not the click.
      expect(bodyModels()).toEqual(OPENAI);

      rerender(
        wrap(
          <Table
            columns={columnsWith({ filteredValue: null })}
            dataSource={rows}
            pagination={false}
            rowKey="id"
          />,
        ),
      );
      expect(bodyModels()).toHaveLength(12);
    });

    test('a controlled demo can clear filters from outside the table', () => {
      const Demo = () => {
        const [filtered, setFiltered] = useState<TableFilters>({});
        return (
          <ConfigProvider motion={motion}>
            <button type="button" onClick={() => setFiltered({})}>
              Clear filters
            </button>
            <Table
              columns={columnsWith({ filteredValue: filtered.provider ?? null })}
              dataSource={rows}
              pagination={false}
              rowKey="id"
              onChange={(_, filters) => setFiltered(filters)}
            />
          </ConfigProvider>
        );
      };
      render(<Demo />);

      openFilter();
      fireEvent.click(screen.getByRole('checkbox', { name: 'OpenAI' }));
      ok();
      expect(bodyModels()).toEqual(OPENAI);

      fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
      expect(bodyModels()).toHaveLength(12);
    });

    test('defaultFilteredValue sets the initial filter of an uncontrolled column', () => {
      renderTable({ columns: columnsWith({ defaultFilteredValue: ['OpenAI'] }) });

      expect(bodyModels()).toEqual(OPENAI);
    });

    test('filterResetToDefaultFilteredValue resets to defaultFilteredValue', () => {
      const onChange = vi.fn();
      renderTable({
        columns: columnsWith({
          defaultFilteredValue: ['OpenAI'],
          filterResetToDefaultFilteredValue: true,
        }),
        onChange,
      });

      openFilter();
      // At the default already, so there is nothing to reset.
      expect(isDisabled(screen.getByRole('button', { name: 'Reset' }))).toBe(true);
      fireEvent.click(screen.getByRole('checkbox', { name: 'Google' }));
      ok();
      expect(lastFilters(onChange)).toEqual({ provider: ['OpenAI', 'Google'] });

      openFilter();
      fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
      expect(screen.getByRole('checkbox', { name: 'OpenAI' }).getAttribute('aria-checked')).toBe(
        'true',
      );
      expect(screen.getByRole('checkbox', { name: 'Google' }).getAttribute('aria-checked')).toBe(
        'false',
      );
      ok();

      expect(lastFilters(onChange)).toEqual({ provider: ['OpenAI'] });
      expect(bodyModels()).toEqual(OPENAI);
    });
  });

  describe('custom filterDropdown', () => {
    const searchColumn = (
      onRender: (props: TableFilterDropdownProps) => void = () => {},
    ): TableColumn<Row> => ({
      dataIndex: 'model',
      filterDropdown: (props) => {
        onRender(props);
        const { clearFilters, close, confirm, selectedKeys, setSelectedKeys } = props;
        return (
          <div>
            <input
              aria-label="Search model"
              value={String(selectedKeys[0] ?? '')}
              onChange={(event) => setSelectedKeys(event.target.value ? [event.target.value] : [])}
            />
            <button type="button" onClick={() => confirm()}>
              Search
            </button>
            <button type="button" onClick={() => confirm({ closeDropdown: false })}>
              Filter
            </button>
            <button type="button" onClick={() => clearFilters?.({ confirm: true })}>
              Clear
            </button>
            <button type="button" onClick={() => close()}>
              Close
            </button>
          </div>
        );
      },
      onFilter: (value, record) => record.model.includes(String(value)),
      title: 'Model',
    });

    test('receives FilterDropdownProps and applies the keys it confirms', async () => {
      const onChange = vi.fn();
      const onRender = vi.fn();
      renderTable({ columns: [searchColumn(onRender), providerColumn()], onChange });

      openFilter('Model');
      const props = onRender.mock.calls.at(-1)![0] as TableFilterDropdownProps;
      expect(props).toMatchObject({
        filters: undefined,
        prefixCls: expect.any(String),
        selectedKeys: [],
        visible: true,
      });
      expect(props.close).toBeTypeOf('function');

      fireEvent.change(screen.getByLabelText('Search model'), { target: { value: '1' } });
      fireEvent.click(screen.getByRole('button', { name: 'Search' }));

      expect(bodyModels()).toEqual(['m-01', 'm-10', 'm-11']);
      // A filterDropdown column reports its raw keys; untouched filter columns report null.
      expect(lastFilters(onChange)).toEqual({ model: ['1'], provider: null });
      await waitFor(() => expect(screen.queryByLabelText('Search model')).toBeNull());
    });

    test('confirm({ closeDropdown: false }) keeps the panel open; clearFilters resets', () => {
      renderTable({ columns: [searchColumn(), providerColumn()] });

      openFilter('Model');
      fireEvent.change(screen.getByLabelText('Search model'), { target: { value: '0' } });
      fireEvent.click(screen.getByRole('button', { name: 'Filter' }));
      expect(bodyModels()).toEqual([
        'm-00',
        'm-01',
        'm-02',
        'm-03',
        'm-04',
        'm-05',
        'm-06',
        'm-07',
        'm-08',
        'm-09',
        'm-10',
      ]);
      expect(screen.getByLabelText('Search model')).toBeTruthy();

      fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
      expect(bodyModels()).toHaveLength(12);
      expect((screen.getByLabelText('Search model') as HTMLInputElement).value).toBe('');
    });

    test('close() hides the panel without applying the draft', async () => {
      renderTable({ columns: [searchColumn(), providerColumn()] });

      openFilter('Model');
      fireEvent.change(screen.getByLabelText('Search model'), { target: { value: '1' } });
      fireEvent.click(screen.getByRole('button', { name: 'Close' }));

      await waitFor(() => expect(screen.queryByLabelText('Search model')).toBeNull());
      expect(bodyModels()).toHaveLength(12);
    });

    test('a ReactNode filterDropdown renders as is, and its column joins onChange filters', () => {
      const onChange = vi.fn();
      renderTable({
        columns: [
          { dataIndex: 'model', filterDropdown: <div>Custom panel</div>, title: 'Model' },
          providerColumn(),
        ],
        onChange,
      });

      openFilter('Model');
      expect(screen.getByText('Custom panel')).toBeTruthy();
      expect(screen.queryByRole('button', { name: 'OK' })).toBeNull();

      openFilter('Provider');
      fireEvent.click(screen.getByRole('checkbox', { name: 'OpenAI' }));
      ok();

      expect(lastFilters(onChange)).toEqual({ model: null, provider: ['OpenAI'] });
    });

    test('filterDropdownProps.popupRender wraps the panel', () => {
      renderTable({
        columns: columnsWith({
          filterDropdownProps: {
            popupRender: (menu) => (
              <div>
                <span>Wrapped</span>
                {menu}
              </div>
            ),
          },
        }),
      });

      openFilter();

      expect(screen.getByText('Wrapped')).toBeTruthy();
      expect(screen.getByRole('button', { name: 'OK' })).toBeTruthy();
    });
  });

  describe('filter icon', () => {
    test('filterIcon receives the filtered state', () => {
      const filterIcon = vi.fn((filtered: boolean) => (
        <span>{filtered ? 'icon-on' : 'icon-off'}</span>
      ));
      renderTable({ columns: columnsWith({ filterIcon }) });
      expect(screen.getByText('icon-off')).toBeTruthy();

      openFilter();
      fireEvent.click(screen.getByRole('checkbox', { name: 'OpenAI' }));
      ok();

      expect(screen.getByText('icon-on')).toBeTruthy();
      expect(
        screen.getByRole('button', { name: 'Filter Provider' }).getAttribute('data-active'),
      ).toBe('true');
    });

    test('a ReactNode filterIcon replaces the default icon', () => {
      renderTable({ columns: columnsWith({ filterIcon: <span>custom-icon</span> }) });

      expect(
        within(screen.getByRole('button', { name: 'Filter Provider' })).getByText('custom-icon'),
      ).toBeTruthy();
    });

    test('filtered: true forces the active state', () => {
      renderTable({ columns: columnsWith({ filtered: true }) });

      expect(
        screen.getByRole('button', { name: 'Filter Provider' }).getAttribute('data-active'),
      ).toBe('true');
      expect(bodyModels()).toHaveLength(12);
    });
  });

  describe('dropdown open state', () => {
    test('filterDropdownProps.open controls the panel and onOpenChange reports requests', () => {
      const onOpenChange = vi.fn();
      const { rerender } = renderTable({
        columns: columnsWith({ filterDropdownProps: { onOpenChange, open: true } }),
      });
      expect(screen.getByRole('button', { name: 'OK' })).toBeTruthy();

      ok();
      expect(onOpenChange).toHaveBeenLastCalledWith(false);
      // Controlled: stays open until the prop changes.
      expect(screen.getByRole('button', { name: 'OK' })).toBeTruthy();

      rerender(
        wrap(
          <Table
            columns={columnsWith({ filterDropdownProps: { onOpenChange, open: false } })}
            dataSource={rows}
            pagination={false}
            rowKey="id"
          />,
        ),
      );
      return waitFor(() => expect(screen.queryByRole('button', { name: 'OK' })).toBeNull());
    });

    test('opening from the trigger calls onOpenChange(true)', () => {
      const onOpenChange = vi.fn();
      renderTable({ columns: columnsWith({ filterDropdownProps: { onOpenChange } }) });

      openFilter();

      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(screen.getByRole('button', { name: 'OK' })).toBeTruthy();
    });

    test('deprecated filterDropdownOpen / onFilterDropdownOpenChange still work', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const onFilterDropdownOpenChange = vi.fn();
      renderTable({
        columns: columnsWith({ filterDropdownOpen: true, onFilterDropdownOpenChange }),
      });
      expect(screen.getByRole('button', { name: 'OK' })).toBeTruthy();

      ok();

      expect(onFilterDropdownOpenChange).toHaveBeenCalledWith(false);
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('`filterDropdownOpen` is deprecated'),
      );
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('`onFilterDropdownOpenChange` is deprecated'),
      );
      warn.mockRestore();
    });
  });

  test('getPopupContainer receives the trigger and hosts the panel', () => {
    const host = document.createElement('div');
    host.dataset.testid = 'popup-host';
    document.body.append(host);
    const getPopupContainer = vi.fn(() => host);

    renderTable({ getPopupContainer });
    openFilter();

    expect(getPopupContainer).toHaveBeenCalledWith(
      screen.getByRole('button', { name: 'Filter Provider' }),
    );
    expect(within(host).getByRole('button', { name: 'OK' })).toBeTruthy();
    host.remove();
  });

  test('a column-level filterDropdownProps.getPopupContainer wins', () => {
    const tableHost = document.createElement('div');
    const columnHost = document.createElement('div');
    document.body.append(tableHost, columnHost);

    renderTable({
      columns: columnsWith({ filterDropdownProps: { getPopupContainer: () => columnHost } }),
      getPopupContainer: () => tableHost,
    });
    openFilter();

    expect(within(columnHost).getByRole('button', { name: 'OK' })).toBeTruthy();
    expect(within(tableHost).queryByRole('button', { name: 'OK' })).toBeNull();
    tableHost.remove();
    columnHost.remove();
  });

  test('a function title receives the current filters', () => {
    const title = vi.fn(({ filters }: { filters?: TableFilters }) =>
      filters?.provider ? `Provider (${filters.provider.join(',')})` : 'Provider',
    );
    renderTable({ columns: columnsWith({ title }) });
    expect(title).toHaveBeenLastCalledWith(
      expect.objectContaining({ filters: { provider: null } }),
    );

    openFilter();
    fireEvent.click(screen.getByRole('checkbox', { name: 'OpenAI' }));
    ok();

    expect(screen.getByRole('columnheader', { name: /Provider \(OpenAI\)/ })).toBeTruthy();
  });

  test('the measure row renders only a static trigger', () => {
    // A fixed column makes rc-table render its hidden measure row with every column title.
    renderTable({
      columns: [
        { dataIndex: 'model', fixed: 'start', title: 'Model', width: 100 },
        providerColumn({ width: 100 }),
      ],
      scroll: { x: 600 },
    });

    openFilter();

    expect(screen.getAllByRole('button', { name: 'OK' })).toHaveLength(1);
  });
});
