import { cleanup, render as rtlRender, screen, waitFor } from '@testing-library/react';
import { motion } from 'motion/react';
import { type ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import ConfigProvider from '@/ConfigProvider';
import { stubMatchMedia } from '@/FormKit/test-utils';

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
  status: string;
}

const columns: ProColumns<Row>[] = [
  { dataIndex: 'name', title: 'Name' },
  {
    dataIndex: 'status',
    fieldProps: { placeholder: '全部' },
    title: 'Status',
    valueEnum: { active: { text: 'Active' }, banned: { text: 'Banned' } },
  },
];

afterEach(cleanup);

describe('ProTable request resolving null / undefined', () => {
  it.each([null, undefined])('treats %s as empty data without throwing', async (result) => {
    const onRequestError = vi.fn();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const request = vi.fn(async () => result as any);
    render(
      <ProTable<Row>
        columns={columns}
        request={request}
        rowKey="id"
        search={false}
        onRequestError={onRequestError}
      />,
    );
    await waitFor(() => expect(request).toHaveBeenCalled());
    await waitFor(() => expect(document.querySelector('[aria-busy="true"]')).toBeNull());
    expect(onRequestError).not.toHaveBeenCalled();
    expect(consoleError.mock.calls.flat().join(' ')).not.toContain("reading 'success'");
    consoleError.mockRestore();
  });

  it('keeps showing rows after a later null response clears them to empty', async () => {
    let result: any = { data: [{ id: '1', name: 'Alice', status: 'active' }], total: 1 };
    const { rerender } = render(
      <ProTable<Row> columns={columns} request={async () => result} rowKey="id" search={false} />,
    );
    expect(await screen.findByText('Alice')).toBeTruthy();
    result = null;
    rerender(
      <ProTable<Row>
        columns={columns}
        params={{ k: 2 }}
        request={async () => result}
        rowKey="id"
        search={false}
      />,
    );
    await waitFor(() => expect(screen.queryByText('Alice')).toBeNull());
  });
});

describe('ProTable light filter label', () => {
  it('always shows the field label next to the placeholder / value', async () => {
    render(
      <ProTable<Row>
        columns={columns}
        request={async () => ({ data: [] })}
        rowKey="id"
        search={{ filterType: 'light' }}
      />,
    );
    const bar = document.querySelector('[data-pro-table-light-filter]')!;
    const labels = [...bar.querySelectorAll('[data-pro-table-light-label]')].map(
      (node) => node.textContent,
    );
    expect(labels).toEqual(['Name', 'Status']);
    // the custom placeholder no longer replaces the label
    expect(bar.textContent).toContain('全部');
  });
});
