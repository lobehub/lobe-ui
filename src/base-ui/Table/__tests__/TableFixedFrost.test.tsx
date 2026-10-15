import { act, render } from '@testing-library/react';
import { motion } from 'motion/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import ConfigProvider from '@/ConfigProvider';

import Table from '../Table';
import type { TableColumn } from '../type';

beforeAll(() => {
  if (!globalThis.ResizeObserver) {
    globalThis.ResizeObserver = class {
      disconnect() {}
      observe() {}
      unobserve() {}
    } as any;
  }
});

interface Row {
  a: string;
  id: string;
  op: string;
}

const columns: TableColumn<Row>[] = [
  { dataIndex: 'id', fixed: 'start', title: 'ID', width: 100 },
  { dataIndex: 'a', title: 'A', width: 600 },
  { dataIndex: 'op', fixed: 'end', title: 'Op', width: 80 },
];
const data: Row[] = [
  { a: 'x', id: '1', op: '…' },
  { a: 'y', id: '2', op: '…' },
];

const frost = () => document.querySelectorAll('[data-table-frost]');
const flush = () =>
  act(async () => {
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

const renderTable = (props: Partial<Parameters<typeof Table<Row>>[0]>) =>
  render(
    <ConfigProvider motion={motion}>
      <Table<Row> columns={columns} pagination={false} rowKey="id" scroll={{ x: 800 }} {...props} />
    </ConfigProvider>,
  );

describe('Table FixedFrost', () => {
  afterEach(() => document.body.replaceChildren());

  it('draws no frost over the loading skeleton (empty + loading)', async () => {
    renderTable({ dataSource: [], loading: true });
    await flush();
    expect(document.querySelector('[data-table-skeleton]')).not.toBeNull();
    expect(frost()).toHaveLength(0);
  });

  it('draws no frost for an empty table', async () => {
    renderTable({ dataSource: [] });
    await flush();
    expect(frost()).toHaveLength(0);
  });

  it('draws no frost at rest (nothing scrolled under the fixed sides)', async () => {
    renderTable({ dataSource: data });
    await flush();
    expect(frost()).toHaveLength(0);
  });

  it('frosts only the side that has content scrolled under it', async () => {
    // jsdom has no layout: give cells a width so the fixed block measures non-zero.
    const spy = vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(100);
    renderTable({ dataSource: data });
    await flush();
    const startCell = document.querySelector('.lobe-table-cell-fix-start')!;
    await act(async () => {
      startCell.classList.add('lobe-table-cell-fix-start-shadow-show');
    });
    await flush();
    const rails = frost();
    expect(rails.length).toBeGreaterThan(0);
    for (const rail of rails) {
      // start pane only, no end pane
      expect(rail.children).toHaveLength(1);
      expect((rail.children[0] as HTMLElement).style.width).toBe('100px');
    }
    spy.mockRestore();
  });

  it('keeps the rail below the fixed cells while loading with rows', async () => {
    const spy = vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(100);
    renderTable({ dataSource: data, loading: true });
    await flush();
    await act(async () => {
      document
        .querySelector('.lobe-table-cell-fix-end')!
        .classList.add('lobe-table-cell-fix-end-shadow-show');
    });
    await flush();
    const rails = frost();
    expect(rails.length).toBeGreaterThan(0);
    // portaled into the scroll host, not over the loading mask / fixed cells
    for (const rail of rails) expect(rail.closest('[data-table-loading]')).toBeNull();
    spy.mockRestore();
  });

  it('renders the loading indicator inside an outlined Block', async () => {
    renderTable({ dataSource: data, loading: { spinning: true, tip: 'Loading' } as any });
    await flush();
    const box = document.querySelector<HTMLElement>(
      '[data-table-loading] > [data-table-loading-indicator]',
    );
    expect(box).not.toBeNull();
    expect(box!.textContent).toContain('Loading');
  });

  it('sets --columns-count so the loading mask stacks above fixed cells', async () => {
    renderTable({ dataSource: data, loading: true });
    await flush();
    const root = document
      .querySelector<HTMLElement>('[data-table-loading]')!
      .closest<HTMLElement>('[style*="--columns-count"]')!;
    // fixed cells get z-index up to 2 × columns; the mask uses count * 2 + 4
    expect(Number(root.style.getPropertyValue('--columns-count'))).toBeGreaterThanOrEqual(
      columns.length,
    );
  });
});
