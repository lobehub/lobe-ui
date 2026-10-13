import { act, cleanup, fireEvent, render as rtlRender, screen } from '@testing-library/react';
import { motion } from 'motion/react';
import type { HTMLAttributes, ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import ConfigProvider from '@/ConfigProvider';
import { stubMatchMedia } from '@/FormKit/test-utils';
import type { TableComponents } from '@/Table/type';

import ProTable from '../ProTable';
import type { ProColumns } from '../type';

const Wrapper = ({ children }: { children: ReactNode }) => (
  <ConfigProvider motion={motion}>{children}</ConfigProvider>
);
const render: typeof rtlRender = ((ui: any, options?: any) =>
  rtlRender(ui, { wrapper: Wrapper, ...options })) as typeof rtlRender;

stubMatchMedia();
if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    disconnect() {}
    observe() {}
    unobserve() {}
  } as any;
}

interface Row {
  id: string;
  name: string;
}

const data: Row[] = Array.from({ length: 5 }, (_, index) => ({
  id: String(index + 1),
  name: `row-${index + 1}`,
}));
const columns: ProColumns<Row>[] = [{ dataIndex: 'name', hideInSearch: true, title: 'Name' }];

const renders = new Map<string, number>();
const SpyRow = (props: HTMLAttributes<HTMLTableRowElement> & { 'data-row-key'?: string }) => {
  const key = props['data-row-key'];
  if (key !== undefined) renders.set(key, (renders.get(key) ?? 0) + 1);
  return <tr {...props} />;
};
const components: TableComponents<Row> = { body: { row: SpyRow } };
const rowSelection = {};
const options = { fullScreen: true };
const total = () => [...renders.values()].reduce((sum, count) => sum + count, 0);

const renderTable = (extra?: { loading?: boolean }) => (
  <ProTable<Row>
    columns={columns}
    components={components}
    dataSource={data}
    options={options}
    rowKey="id"
    rowSelection={rowSelection}
    search={false}
    {...extra}
  />
);

beforeEach(() => renders.clear());
afterEach(cleanup);

describe('ProTable render granularity', () => {
  it('toggling loading renders no body row', () => {
    const { rerender } = render(renderTable({ loading: false }));
    renders.clear();
    rerender(renderTable({ loading: true }));
    rerender(renderTable({ loading: false }));
    expect(total()).toBe(0);
  });

  it('opening the density menu renders no body row', () => {
    const { container } = render(renderTable());
    renders.clear();
    const [, density] = container.querySelectorAll('.lobe-pro-table-options button');
    act(() => {
      fireEvent.click(density);
    });
    expect(screen.getByRole('menu')).toBeTruthy();
    expect(total()).toBe(0);
  });

  it('selecting a row shows the alert and re-renders at most that row', () => {
    render(renderTable());
    renders.clear();
    act(() => {
      fireEvent.click(screen.getAllByRole('checkbox')[2]);
    });
    expect(screen.getByRole('status').textContent).toContain('1 selected');
    expect(total()).toBeLessThanOrEqual(1);
    expect([...renders.keys()].every((key) => key === '2')).toBe(true);
  });

  it('clearing from the alert empties the selection', () => {
    render(renderTable());
    act(() => {
      fireEvent.click(screen.getAllByRole('checkbox')[1]);
    });
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    });
    expect(screen.queryByRole('status')).toBeNull();
    expect(screen.getAllByRole('checkbox')[1].getAttribute('aria-checked')).toBe('false');
  });

  it('entering fullscreen renders no body row', () => {
    const { container } = render(renderTable());
    renders.clear();
    const root = container.querySelector('.lobe-pro-table') as HTMLElement;
    Object.defineProperty(document, 'fullscreenElement', { configurable: true, value: root });
    act(() => {
      document.dispatchEvent(new Event('fullscreenchange'));
    });
    expect(root.dataset.fullscreen).toBe('true');
    expect(total()).toBe(0);
    Object.defineProperty(document, 'fullscreenElement', { configurable: true, value: null });
  });
});
