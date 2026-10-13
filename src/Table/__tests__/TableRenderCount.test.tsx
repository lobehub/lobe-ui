import { act, cleanup, fireEvent, render as rtlRender, screen } from '@testing-library/react';
import { motion } from 'motion/react';
import { type HTMLAttributes, type Key, type ReactNode, useState } from 'react';

import ConfigProvider from '@/ConfigProvider';

import Table from '../Table';
import type {
  TableColumn,
  TableComponents,
  TableExpandableConfig,
  TableRowSelection,
} from '../type';

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
  children?: Row[];
  key: string;
  name: string;
  provider: string;
}

const rows: Row[] = [
  { key: '1', name: 'Alpha', provider: 'OpenAI' },
  { key: '2', name: 'Beta', provider: 'Anthropic' },
  { key: '3', name: 'Gamma', provider: 'Google' },
  { key: '4', name: 'Delta', provider: 'OpenAI' },
];

const columns: TableColumn<Row>[] = [
  { dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name), title: 'Name' },
  {
    dataIndex: 'provider',
    filters: [
      { text: 'OpenAI', value: 'OpenAI' },
      { text: 'Google', value: 'Google' },
    ],
    key: 'provider',
    onFilter: (value, record) => record.provider === value,
    title: 'Provider',
  },
];

const renders = new Map<string, number>();
const SpyRow = (props: HTMLAttributes<HTMLTableRowElement> & { 'data-row-key'?: string }) => {
  const key = props['data-row-key'];
  if (key !== undefined) renders.set(key, (renders.get(key) ?? 0) + 1);
  return <tr {...props} />;
};
const components: TableComponents<Row> = { body: { row: SpyRow } };

const renderDetail = (record: Row) => <span>Detail {record.name}</span>;

const total = () => [...renders.values()].reduce((sum, count) => sum + count, 0);

const rowSelection: TableRowSelection<Row> = {};
const rowExpandable: TableExpandableConfig<Row> = {
  expandedRowRender: (record) => <span>Detail {record.name}</span>,
};

beforeEach(() => renders.clear());
afterEach(cleanup);

describe('render granularity', () => {
  test('toggling one row checkbox re-renders at most that row', () => {
    render(
      <Table
        columns={columns}
        components={components}
        dataSource={rows}
        rowSelection={rowSelection}
      />,
    );
    renders.clear();
    act(() => {
      fireEvent.click(screen.getAllByRole('checkbox')[2]);
    });
    expect(screen.getAllByRole('checkbox')[2].getAttribute('aria-checked')).toBe('true');
    expect(total()).toBeLessThanOrEqual(1);
    expect([...renders.keys()].every((key) => key === '2')).toBe(true);
  });

  test('toggling one expandedRowRender row re-renders that row and mounts its expanded row', () => {
    const { container } = render(
      <Table
        columns={columns}
        components={components}
        dataSource={rows}
        expandable={rowExpandable}
      />,
    );
    renders.clear();
    act(() => {
      fireEvent.click(container.querySelector('tr[data-row-key="3"] .lobe-table-row-expand-icon')!);
    });
    expect(screen.getByText('Detail Gamma')).toBeTruthy();
    expect([...renders.keys()]).toEqual(['3']);
    expect(renders.get('3')).toBeLessThanOrEqual(1);
  });

  test('expanding a tree node only mounts its children when no index shifts', () => {
    const tree: Row[] = [
      rows[0],
      rows[1],
      {
        children: [
          { key: '3-1', name: 'Child A', provider: 'OpenAI' },
          { key: '3-2', name: 'Child B', provider: 'Google' },
        ],
        key: '3',
        name: 'Parent',
        provider: 'Anthropic',
      },
    ];
    const { container } = render(
      <Table columns={columns} components={components} dataSource={tree} />,
    );
    renders.clear();
    act(() => {
      fireEvent.click(container.querySelector('tr[data-row-key="3"] .lobe-table-row-expand-icon')!);
    });
    expect(renders.get('1')).toBeUndefined();
    expect(renders.get('2')).toBeUndefined();
    expect(renders.get('3-1')).toBe(1);
    expect(renders.get('3-2')).toBe(1);
  });

  test('opening a filter dropdown renders no body row', () => {
    render(<Table columns={columns} components={components} dataSource={rows} />);
    renders.clear();
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Filter Provider' }));
    });
    expect(total()).toBe(0);
  });

  test('hovering a sorter renders no body row', () => {
    const { container } = render(
      <Table columns={columns} components={components} dataSource={rows} />,
    );
    renders.clear();
    act(() => {
      fireEvent.mouseEnter(container.querySelector('.lobe-table-column-sorters')!);
      fireEvent.pointerEnter(container.querySelector('.lobe-table-column-sorter')!);
    });
    expect(total()).toBe(0);
  });

  test('a parent re-render with a new inline onRow re-renders every row', () => {
    const { rerender } = render(
      <Table columns={columns} components={components} dataSource={rows} onRow={() => ({})} />,
    );
    renders.clear();
    rerender(
      <Table columns={columns} components={components} dataSource={rows} onRow={() => ({})} />,
    );
    expect(renders.size).toBe(rows.length);
  });

  test('toggling one row checkbox renders at most two selection cells', () => {
    let cellRenders = 0;
    const counted: TableRowSelection<Row> = {
      renderCell: (_checked, _record, _index, node) => {
        cellRenders += 1;
        return node;
      },
    };
    render(<Table columns={columns} dataSource={rows} rowSelection={counted} />);
    cellRenders = 0;
    act(() => {
      fireEvent.click(screen.getAllByRole('checkbox')[2]);
    });
    expect(cellRenders).toBeLessThanOrEqual(2);
  });

  test('a controlled inline rowSelection re-renders at most the toggled row', () => {
    const Controlled = () => {
      const [keys, setKeys] = useState<Key[]>([]);
      return (
        <Table
          columns={columns}
          components={components}
          dataSource={rows}
          rowSelection={{ onChange: setKeys, selectedRowKeys: keys }}
        />
      );
    };
    render(<Controlled />);
    renders.clear();
    act(() => {
      fireEvent.click(screen.getAllByRole('checkbox')[2]);
    });
    expect(screen.getAllByRole('checkbox')[2].getAttribute('aria-checked')).toBe('true');
    expect(total()).toBeLessThanOrEqual(1);
  });

  test('an inline expandable with controlled keys re-renders only the toggled row', () => {
    const Controlled = () => {
      const [keys, setKeys] = useState<readonly Key[]>([]);
      return (
        <Table
          columns={columns}
          components={components}
          dataSource={rows}
          expandable={{
            expandedRowKeys: keys,
            expandedRowRender: renderDetail,
            onExpandedRowsChange: setKeys,
          }}
        />
      );
    };
    const { container } = render(<Controlled />);
    renders.clear();
    act(() => {
      fireEvent.click(container.querySelector('tr[data-row-key="3"] .lobe-table-row-expand-icon')!);
    });
    expect(screen.getByText('Detail Gamma')).toBeTruthy();
    expect([...renders.keys()]).toEqual(['3']);
  });
});

describe('virtual scroll granularity', () => {
  test('scrolling the virtual body renders no header cell', async () => {
    let headerRenders = 0;
    const HeaderCell = (props: HTMLAttributes<HTMLTableCellElement>) => {
      headerRenders += 1;
      return <div {...props} />;
    };
    const many: Row[] = Array.from({ length: 500 }, (_, index) => ({
      key: String(index),
      name: `n-${index}`,
      provider: 'OpenAI',
    }));
    const virtualComponents: TableComponents<Row> = { header: { cell: HeaderCell } };
    const { container } = render(
      <Table
        virtual
        columns={columns}
        components={virtualComponents}
        dataSource={many}
        pagination={false}
        scroll={{ x: 600, y: 300 }}
      />,
    );
    const holder = container.querySelector<HTMLDivElement>('.lobe-table-tbody-virtual-holder')!;
    const firstKey = () => holder.querySelector('[data-row-key]')?.getAttribute('data-row-key');
    expect(firstKey()).toBe('0');
    headerRenders = 0;
    await act(async () => {
      holder.scrollTop = 4700;
      holder.dispatchEvent(new Event('scroll'));
      await new Promise((resolve) => setTimeout(resolve, 50));
    });
    expect(firstKey()).not.toBe('0');
    expect(headerRenders).toBe(0);
  });
});
