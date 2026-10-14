import { render, waitFor } from '@testing-library/react';
import { motion } from 'motion/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

import ConfigProvider from '@/ConfigProvider';

import Table from '../Table';
import type { TableColumn } from '../type';

interface Row {
  id: string;
  model: string;
  provider: string;
  vendor: string;
}

const dataSource: Row[] = [{ id: '1', model: 'gpt-5', provider: 'openai', vendor: 'x' }];

// jsdom has no layout: give every box a width so the fixed sides measure non-zero.
beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(120);
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(40);
});

afterEach(() => {
  vi.restoreAllMocks();
});

const renderTable = (columns: TableColumn<Row>[]) =>
  render(
    <ConfigProvider motion={motion}>
      <Table columns={columns} dataSource={dataSource} rowKey="id" scroll={{ x: 800 }} />
    </ConfigProvider>,
  );

it('portals one frost rail with a pane per fixed side into the scroll host', async () => {
  const { container } = renderTable([
    { dataIndex: 'model', fixed: 'start', title: 'Model', width: 120 },
    { dataIndex: 'provider', title: 'Provider' },
    { dataIndex: 'vendor', fixed: 'end', title: 'Vendor', width: 120 },
  ]);

  await waitFor(() => {
    expect(container.querySelectorAll('[data-table-frost]')).toHaveLength(1);
  });

  const rail = container.querySelector<HTMLElement>('[data-table-frost]')!;
  expect(rail.parentElement?.classList.contains('lobe-table-content')).toBe(true);
  expect(rail.getAttribute('aria-hidden')).toBe('true');
  const panes = Array.from(rail.children) as HTMLElement[];
  expect(panes.map((pane) => pane.style.width)).toEqual(['120px', '120px']);
});

it('renders no frost rail without fixed columns', async () => {
  const { container } = renderTable([
    { dataIndex: 'model', title: 'Model' },
    { dataIndex: 'provider', title: 'Provider' },
  ]);

  await waitFor(() => {
    expect(container.querySelector('.lobe-table-content')).toBeTruthy();
  });
  expect(container.querySelector('[data-table-frost]')).toBeNull();
});

it('portals a filling rail into the virtual row layer', async () => {
  const { container } = render(
    <ConfigProvider motion={motion}>
      <Table
        virtual
        dataSource={dataSource}
        rowKey="id"
        scroll={{ x: 920, y: 300 }}
        columns={[
          { dataIndex: 'model', fixed: 'start', title: 'Model', width: 120 },
          { dataIndex: 'provider', title: 'Provider', width: 400 },
          { dataIndex: 'vendor', title: 'Vendor', width: 400 },
        ]}
      />
    </ConfigProvider>,
  );

  await waitFor(() => {
    expect(
      container.querySelector('.lobe-table-tbody-virtual-holder-inner > [data-table-frost]'),
    ).toBeTruthy();
  });
  const rail = container.querySelector<HTMLElement>(
    '.lobe-table-tbody-virtual-holder-inner > [data-table-frost]',
  )!;
  expect(rail.style.inset).toBe('0px');
  expect((rail.firstElementChild as HTMLElement).style.width).toBe('120px');

  // Fixed cells (z >= 2) must sit above the rail (z 1): nothing between them and the rail's
  // host may open a stacking context, or the rail blurs the fixed cells' own content.
  const fixedCell = container.querySelector<HTMLElement>(
    '.lobe-table-tbody-virtual .lobe-table-cell-fix-start',
  )!;
  for (let el = fixedCell.parentElement; el && el !== rail.parentElement; el = el.parentElement) {
    expect(el.style.transform).toBe('');
  }
});

it('marks the merged virtual cell with its rowspan so it gets side dividers', async () => {
  const rows: Row[] = Array.from({ length: 4 }, (_, i) => ({
    id: String(i),
    model: `m${i}`,
    provider: 'p',
    vendor: 'v',
  }));
  const { container } = render(
    <ConfigProvider motion={motion}>
      <Table
        virtual
        dataSource={rows}
        rowKey="id"
        scroll={{ x: 920, y: 300 }}
        columns={[
          {
            dataIndex: 'provider',
            onCell: (_, index = 0) => ({ rowSpan: index % 2 === 0 ? 2 : 0 }),
            title: 'Provider',
            width: 400,
          },
          { dataIndex: 'model', title: 'Model', width: 400 },
        ]}
      />
    </ConfigProvider>,
  );

  await waitFor(() => {
    expect(container.querySelector('.lobe-table-row-extra')).toBeTruthy();
  });
  const merged = container.querySelector('.lobe-table-row-extra .lobe-table-cell[rowspan]');
  expect(merged?.getAttribute('rowspan')).toBe('2');
  expect(merged?.textContent).toBe('p');
});
