import { cleanup, fireEvent, render as rtlRender, screen, within } from '@testing-library/react';
import { motion } from 'motion/react';
import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';

import ConfigProvider from '@/ConfigProvider';

import Table from '../Table';
import type { TableColumn } from '../type';

// Base-ui buttons (ActionIcon in the expand / filter triggers) read the motion component from
// ConfigProvider, so every render (and rerender) goes through it.
const MotionWrapper = ({ children }: { children: ReactNode }) => (
  <ConfigProvider motion={motion}>{children}</ConfigProvider>
);
const render: typeof rtlRender = ((ui: any, options?: any) =>
  rtlRender(ui, { wrapper: MotionWrapper, ...options })) as typeof rtlRender;

// The base-ui popup does not portal under jsdom; expose the props the Table passes instead.
vi.mock('@/base-ui/Tooltip', () => ({
  default: ({ children, title, ...props }: { children: ReactNode; title: ReactNode }) =>
    isValidElement(children)
      ? cloneElement(children as ReactElement<any>, {
          'data-tooltip-props': JSON.stringify(props),
          'data-tooltip-title': String(title),
        })
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
  key: string;
  math: number;
}

const rows: Row[] = [
  { key: '1', math: 2 },
  { key: '2', math: 1 },
];

const column: TableColumn<Row> = {
  dataIndex: 'math',
  sorter: (a, b) => a.math - b.math,
  title: 'Math',
};

const sortHeader = () => screen.getByRole('columnheader', { name: /Math/ });
// Full-header tooltip sits on `.lobe-table-column-sorters`; the ActionIcon is the click target.
const sortGroup = () => sortHeader().querySelector<HTMLElement>('.lobe-table-column-sorters')!;
const sortButton = () => within(sortHeader()).getByRole('button');

describe('Table sorter tooltip content', () => {
  afterEach(cleanup);

  test('tells what the next click does, following sortDirections', () => {
    render(<Table columns={[column]} dataSource={rows} pagination={false} />);

    expect(sortGroup().dataset.tooltipTitle).toBe('Click to sort ascending');
    fireEvent.click(sortButton());
    expect(sortGroup().dataset.tooltipTitle).toBe('Click to sort descending');
    fireEvent.click(sortButton());
    expect(sortGroup().dataset.tooltipTitle).toBe('Click to cancel sorting');
  });

  test('descend-first directions start with the descending tip', () => {
    render(
      <Table
        columns={[{ ...column, sortDirections: ['descend'] }]}
        dataSource={rows}
        pagination={false}
      />,
    );

    expect(sortGroup().dataset.tooltipTitle).toBe('Click to sort descending');
    fireEvent.click(sortButton());
    expect(sortGroup().dataset.tooltipTitle).toBe('Click to cancel sorting');
  });

  test('tooltip props pass through (minus target) and may override the title', () => {
    const { container } = render(
      <Table
        columns={[column]}
        dataSource={rows}
        pagination={false}
        showSorterTooltip={{ placement: 'bottom', target: 'sorter-icon', title: 'Sort me' }}
      />,
    );
    const icon = container.querySelector<HTMLElement>('.lobe-table-column-sorter')!;

    expect(sortGroup().dataset.tooltipTitle).toBeUndefined();
    expect(icon.dataset.tooltipTitle).toBe('Sort me');
    expect(JSON.parse(icon.dataset.tooltipProps!)).toMatchObject({ placement: 'bottom' });
  });

  test('a column showSorterTooltip overrides the table one', () => {
    render(
      <Table
        columns={[{ ...column, showSorterTooltip: { title: 'Column tip' } }]}
        dataSource={rows}
        pagination={false}
        showSorterTooltip={false}
      />,
    );

    expect(sortGroup().dataset.tooltipTitle).toBe('Column tip');
  });
});
