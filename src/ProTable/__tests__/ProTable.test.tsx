import {
  act,
  cleanup,
  fireEvent,
  render as rtlRender,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
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

// base-ui Form reads `useResponsive` (matchMedia).
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
  spend: number;
  status: string;
}

const data: Row[] = Array.from({ length: 25 }, (_, index) => ({
  id: String(index + 1),
  name: `row-${index + 1}`,
  spend: index * 10,
  status: index % 2 ? 'open' : 'closed',
}));

const statusEnum = {
  closed: { status: 'Default' as const, text: 'Closed' },
  open: { status: 'Success' as const, text: 'Open' },
};

const columns: ProColumns<Row>[] = [
  { dataIndex: 'name', title: 'Name' },
  { dataIndex: 'status', title: 'Status', valueEnum: statusEnum },
  { dataIndex: 'spend', hideInSearch: true, title: 'Spend', valueType: 'money' },
];

const makeRequest = () =>
  vi.fn(async (params: Record<string, any>) => {
    const { current = 1, pageSize = 10 } = params;
    const list = data.filter((row) => !params.name || row.name.includes(params.name));
    return {
      data: list.slice((current - 1) * pageSize, current * pageSize),
      success: true,
      total: list.length,
    };
  });

afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe('ProTable', () => {
  it('requests with pagination params and renders value types', async () => {
    const request = makeRequest();
    render(<ProTable columns={columns} debounceTime={0} request={request} rowKey="id" />);
    await screen.findByText('row-1');
    expect(request).toHaveBeenCalledTimes(1);
    expect(request.mock.calls[0][0]).toMatchObject({ current: 1, pageSize: 10 });
    expect(screen.getAllByText('Open').length).toBeGreaterThan(0);
    expect(screen.getByText('¥10.00')).toBeTruthy();
  });

  it('submits the search form and resets it', async () => {
    const request = makeRequest();
    const onSubmit = vi.fn();
    const onReset = vi.fn();
    render(
      <ProTable
        columns={columns}
        debounceTime={0}
        request={request}
        rowKey="id"
        onReset={onReset}
        onSubmit={onSubmit}
      />,
    );
    await screen.findByText('row-1');
    const form = document.querySelector('[data-pro-table-search]') as HTMLElement;
    const input = within(form).getAllByRole('textbox')[0];
    fireEvent.change(input, { target: { value: 'row-2' } });
    fireEvent.click(within(form).getByText('Search'));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ name: 'row-2' }));
    await waitFor(() =>
      expect(request.mock.lastCall?.[0]).toMatchObject({ current: 1, name: 'row-2' }),
    );
    await screen.findByText('row-20');
    expect(screen.queryByText('row-1')).toBeNull();

    fireEvent.click(within(form).getByText('Reset'));
    expect(onReset).toHaveBeenCalled();
    await waitFor(() => expect(request.mock.lastCall?.[0].name).toBeUndefined());
  });

  it('hides hideInTable / hideInSearch columns and skips option columns in the form', async () => {
    render(
      <ProTable<Row>
        dataSource={data}
        rowKey="id"
        columns={[
          { dataIndex: 'name', title: 'Name' },
          { dataIndex: 'status', hideInTable: true, title: 'StatusField' },
          {
            key: 'option',
            render: () => [<span key="a">act</span>],
            title: 'Op',
            valueType: 'option',
          },
        ]}
      />,
    );
    const form = document.querySelector('[data-pro-table-search]') as HTMLElement;
    expect(within(form).getByText('StatusField')).toBeTruthy();
    expect(within(form).queryByText('Op')).toBeNull();
    const table = document.querySelector('table') as HTMLElement;
    expect(within(table).queryByText('StatusField')).toBeNull();
    expect(within(table).getAllByText('act').length).toBe(10);
  });

  it('re-fetches from page 1 when params change', async () => {
    const request = makeRequest();
    const { rerender } = render(
      <ProTable
        columns={columns}
        debounceTime={0}
        params={{ tag: 'a' }}
        request={request}
        rowKey="id"
      />,
    );
    await screen.findByText('row-1');
    rerender(
      <ProTable
        columns={columns}
        debounceTime={0}
        params={{ tag: 'b' }}
        request={request}
        rowKey="id"
      />,
    );
    await waitFor(() => expect(request.mock.lastCall?.[0]).toMatchObject({ current: 1, tag: 'b' }));
  });

  it('exposes actionRef and formRef', async () => {
    const request = makeRequest();
    const actionRef = { current: undefined } as any;
    const formRef = { current: undefined } as any;
    render(
      <ProTable
        actionRef={actionRef}
        columns={columns}
        debounceTime={0}
        formRef={formRef}
        request={request}
        rowKey="id"
      />,
    );
    await screen.findByText('row-1');
    await act(async () => {
      actionRef.current.setPageInfo({ current: 2 });
    });
    await screen.findByText('row-11');
    expect(request.mock.lastCall?.[0]).toMatchObject({ current: 2 });

    await act(async () => {
      formRef.current.setFieldsValue({ name: 'row-25' });
      formRef.current.submit();
    });
    await screen.findByText('row-25');
    expect(formRef.current.getFieldsValue()).toEqual({ name: 'row-25' });

    const calls = request.mock.calls.length;
    let settled = false;
    act(() => {
      void actionRef.current.reload().then(() => {
        settled = true;
      });
    });
    await waitFor(() => expect(settled).toBe(true));
    expect(request.mock.calls.length).toBe(calls + 1);

    await act(async () => {
      actionRef.current.reset();
    });
    await waitFor(() => expect(request.mock.lastCall?.[0].name).toBeUndefined());
    expect(formRef.current.getFieldsValue()).toEqual({});
  });

  it('does not request on mount with manualRequest', async () => {
    const request = makeRequest();
    const actionRef = { current: undefined } as any;
    render(
      <ProTable
        manualRequest
        actionRef={actionRef}
        columns={columns}
        debounceTime={0}
        request={request}
        rowKey="id"
      />,
    );
    await new Promise((resolve) => setTimeout(resolve, 30));
    expect(request).not.toHaveBeenCalled();
    act(() => {
      void actionRef.current.reload();
    });
    await waitFor(() => expect(request).toHaveBeenCalledTimes(1));
  });

  it('applies postData and search.transform', async () => {
    const request = vi.fn(async (_params: Record<string, any>) => ({
      data: data.slice(0, 2),
      success: true,
      total: 2,
    }));
    const formRef = { current: undefined } as any;
    render(
      <ProTable<Row>
        debounceTime={0}
        formRef={formRef}
        postData={(list) => list.map((row) => ({ ...row, name: row.name.toUpperCase() }))}
        request={request}
        rowKey="id"
        columns={[
          {
            dataIndex: 'name',
            search: { transform: (value) => ({ keywordName: value }) },
            title: 'Name',
          },
        ]}
      />,
    );
    await screen.findByText('ROW-1');
    await act(async () => {
      formRef.current.setFieldValue('name', 'x');
      formRef.current.submit();
    });
    await waitFor(() => expect(request.mock.lastCall?.[0]).toMatchObject({ keywordName: 'x' }));
    expect(request.mock.lastCall?.[0].name).toBeUndefined();
  });

  it('formats dates with dateFormatter', async () => {
    const formRef = { current: undefined } as any;
    render(
      <ProTable<Row>
        columns={[{ dataIndex: 'created', title: 'Created', valueType: 'dateRange' }]}
        dataSource={data}
        formRef={formRef}
        rowKey="id"
      />,
    );
    formRef.current.setFieldValue('created', [new Date(2026, 0, 2), new Date(2026, 1, 3)]);
    expect(formRef.current.getFieldsFormatValue()).toEqual({
      created: ['2026-01-02', '2026-02-03'],
    });
  });

  it('shows the selection alert and clears it', async () => {
    const onChange = vi.fn();
    render(
      <ProTable<Row>
        columns={columns}
        dataSource={data}
        rowKey="id"
        rowSelection={{ onChange }}
        search={false}
        tableAlertOptionRender={({ onCleanSelected }) => (
          <button onClick={onCleanSelected}>wipe</button>
        )}
      />,
    );
    expect(screen.queryByRole('status')).toBeNull();
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);
    expect(screen.getByRole('status').textContent).toContain('1 selected');
    fireEvent.click(screen.getByText('wipe'));
    expect(screen.queryByRole('status')).toBeNull();
    expect(onChange).toHaveBeenLastCalledWith([], [], { type: 'none' });
  });

  it('respects columnsState (hidden and ordered) and persists it', () => {
    render(
      <ProTable<Row>
        columns={columns}
        dataSource={data}
        rowKey="id"
        search={false}
        columnsState={{
          defaultValue: { name: { order: 2 }, spend: { order: 0 }, status: { show: false } },
          persistenceKey: 'pro-table-test',
        }}
      />,
    );
    const headers = [...document.querySelectorAll('thead th')].map((th) => th.textContent);
    expect(headers).toEqual(['Spend', 'Name']);
  });

  it('reads the persisted columns state', () => {
    localStorage.setItem('pro-table-persist', JSON.stringify({ name: { show: false } }));
    render(
      <ProTable<Row>
        columns={columns}
        columnsState={{ persistenceKey: 'pro-table-persist' }}
        dataSource={data}
        rowKey="id"
        search={false}
      />,
    );
    const headers = [...document.querySelectorAll('thead th')].map((th) => th.textContent);
    expect(headers).toEqual(['Status', 'Spend']);
  });

  it('renders the toolbar title, actions and hides options', () => {
    render(
      <ProTable<Row>
        columns={columns}
        dataSource={data}
        headerTitle="My table"
        options={false}
        rowKey="id"
        search={false}
        toolBarRender={() => [<button key="new">New</button>]}
      />,
    );
    expect(screen.getByText('My table')).toBeTruthy();
    expect(screen.getByText('New')).toBeTruthy();
    expect(screen.queryByLabelText('Column settings')).toBeNull();
  });

  it('renders index columns across pages and the empty text', () => {
    render(
      <ProTable<Row>
        dataSource={[...data.slice(0, 1), { ...data[1], name: '' }]}
        rowKey="id"
        search={false}
        columns={[
          { dataIndex: 'index', title: '#', valueType: 'index' },
          { dataIndex: 'name', title: 'Name' },
        ]}
      />,
    );
    const cells = [...document.querySelectorAll('tbody tr')].map((tr) => tr.textContent);
    expect(cells).toEqual(['1row-1', '2-']);
  });

  it('collapses the query form', () => {
    render(
      <ProTable<Row>
        columns={['a', 'b', 'c', 'd'].map((name) => ({ dataIndex: name, title: `F-${name}` }))}
        dataSource={data}
        rowKey="id"
        search={{ span: 8 }}
      />,
    );
    const form = document.querySelector('[data-pro-table-search]') as HTMLElement;
    expect(within(form).queryByText('F-c')).toBeNull();
    fireEvent.click(within(form).getByText('Expand'));
    expect(within(form).getByText('F-d')).toBeTruthy();
  });

  it('validates formItemProps.rules through the base-ui Form before querying', async () => {
    const request = makeRequest();
    render(
      <ProTable<Row>
        debounceTime={0}
        request={request}
        rowKey="id"
        columns={[
          {
            dataIndex: 'name',
            formItemProps: {
              rules: [
                { message: 'Name is required', required: true },
                { message: 'Starts with row-', pattern: /^row-/ },
              ],
            },
            title: 'Name',
          },
        ]}
      />,
    );
    await screen.findByText('row-1');
    const calls = request.mock.calls.length;
    const form = document.querySelector('[data-pro-table-search]') as HTMLElement;
    fireEvent.click(within(form).getByText('Search'));
    expect(await within(form).findByText('Name is required')).toBeTruthy();
    fireEvent.change(within(form).getByRole('textbox'), { target: { value: 'abc' } });
    fireEvent.click(within(form).getByText('Search'));
    expect(await within(form).findByText('Starts with row-')).toBeTruthy();
    expect(request.mock.calls.length).toBe(calls);

    fireEvent.change(within(form).getByRole('textbox'), { target: { value: 'row-3' } });
    fireEvent.click(within(form).getByText('Search'));
    await waitFor(() => expect(request.mock.lastCall?.[0]).toMatchObject({ name: 'row-3' }));
  });

  it('exposes base-ui Form instance methods on formRef', async () => {
    const formRef = { current: undefined } as any;
    render(
      <ProTable<Row>
        columns={[{ dataIndex: 'name', formItemProps: { required: true }, title: 'Name' }]}
        dataSource={data}
        formRef={formRef}
        rowKey="id"
      />,
    );
    for (const method of [
      'getValue',
      'getValues',
      'setValue',
      'setValues',
      'reset',
      'validate',
      'submit',
      'setErrors',
      'isDirty',
      'subscribe',
    ]) {
      expect(typeof formRef.current[method]).toBe('function');
    }
    let result: any;
    await act(async () => {
      result = await formRef.current.validate();
    });
    expect(result.valid).toBe(false);
    await act(async () => {
      formRef.current.setValue('name', 'x', { asUser: true });
    });
    expect(formRef.current.isDirty()).toBe(true);
    await expect(formRef.current.validateFields()).resolves.toEqual({ name: 'x' });
  });

  it('uses light filter in the toolbar', () => {
    render(
      <ProTable<Row>
        columns={columns}
        dataSource={data}
        rowKey="id"
        search={{ filterType: 'light' }}
      />,
    );
    expect(document.querySelector('[data-pro-table-search]')).toBeNull();
    expect(document.querySelector('[data-pro-table-light-filter]')).not.toBeNull();
  });
});
