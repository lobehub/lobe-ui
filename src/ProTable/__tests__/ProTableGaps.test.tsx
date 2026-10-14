import {
  act,
  cleanup,
  fireEvent,
  render as rtlRender,
  renderHook,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { motion } from 'motion/react';
import { type ReactNode } from 'react';
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest';

import ConfigProvider from '@/ConfigProvider';
import { stubMatchMedia } from '@/FormKit/test-utils';
import { useSelectSearch } from '@/Select/hooks';

import { useColumnRequest } from '../hooks/useColumnRequest';
import { resolveSpan } from '../parts/SearchForm';
import ProTable from '../ProTable';
import type {
  ProColumns,
  ProTableProps,
  ProTableRequest,
  ProTableRequestFilter,
  ProTableRequestSort,
  SortOrder,
} from '../type';

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

const rows: Row[] = [
  { id: '1', name: 'row-1' },
  { id: '2', name: 'row-2' },
];

const makeRequest = () =>
  vi.fn(async (params: Record<string, any>) => ({
    data: rows.filter((row) => !params.name || row.name.includes(params.name)),
    success: true,
    total: rows.length,
  }));

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('ProTable column request', () => {
  it('loads options with params and re-requests on remote search (debounced, keyWords)', async () => {
    vi.useFakeTimers();
    const request = vi.fn(async ({ keyWords }: { keyWords?: string }) => [
      { label: `opt-${keyWords ?? 'all'}`, value: keyWords ?? 'all' },
    ]);
    const { result, rerender } = renderHook(
      ({ params }) =>
        useColumnRequest({
          dataIndex: 'owner',
          debounceTime: 300,
          fieldProps: { filterOption: false, showSearch: true },
          params,
          request,
        }),
      { initialProps: { params: { team: 'a' } } },
    );
    expect(result.current.enabled).toBe(true);
    expect(request).not.toHaveBeenCalled();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });
    expect(request).toHaveBeenLastCalledWith({ keyWords: undefined, team: 'a' });
    expect(result.current.options).toEqual([{ label: 'opt-all', value: 'all' }]);

    // Typing is debounced: only the last keyword is requested.
    act(() => result.current.onSearch!('a'));
    act(() => result.current.onSearch!('ab'));
    await act(async () => {
      await vi.advanceTimersByTimeAsync(299);
    });
    expect(request).toHaveBeenCalledTimes(1);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });
    expect(request).toHaveBeenCalledTimes(2);
    expect(request).toHaveBeenLastCalledWith({ keyWords: 'ab', team: 'a' });

    // A deep-equal params object does not re-request; a changed one does.
    rerender({ params: { team: 'a' } });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });
    expect(request).toHaveBeenCalledTimes(2);
    rerender({ params: { team: 'b' } });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });
    expect(request).toHaveBeenLastCalledWith({ keyWords: 'ab', team: 'b' });
  });

  it('has no remote search unless showSearch + filterOption: false', () => {
    const request = vi.fn(async () => []);
    const { result } = renderHook(() => useColumnRequest({ dataIndex: 'x', request }));
    expect(result.current.onSearch).toBeUndefined();
  });

  it('requests the options of a search field in the query form', async () => {
    const optionRequest = vi.fn(async () => [{ label: 'Alice', value: 'alice' }]);
    render(
      <ProTable<Row>
        debounceTime={0}
        request={makeRequest()}
        rowKey="id"
        columns={[
          { dataIndex: 'name', title: 'Name' },
          { dataIndex: 'owner', hideInTable: true, request: optionRequest, title: 'Owner' },
        ]}
      />,
    );
    await screen.findByText('row-1');
    await waitFor(() => expect(optionRequest).toHaveBeenCalledWith({ keyWords: undefined }));
    // A `request` column renders a select control, not a text input.
    const form = document.querySelector('[data-pro-table-search]') as HTMLElement;
    expect(within(form).getAllByRole('textbox')).toHaveLength(1);
  });

  it('base-ui Select: filterOption false keeps options and onSearch reports the text', () => {
    const onSearch = vi.fn();
    const options = [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
    ];
    const params = {
      appendTagValues: () => {},
      handleOpenChange: () => {},
      mergedOpen: true,
      mode: undefined,
      removeLastTagValue: () => {},
      resolvedOptions: options,
      showSearch: true,
      tokenSeparators: undefined,
    };
    const remote = renderHook(() => useSelectSearch({ ...params, filterOption: false, onSearch }));
    act(() => remote.result.current.handleSearchChange({ target: { value: 'ban' } } as any));
    expect(onSearch).toHaveBeenCalledWith('ban');
    expect(remote.result.current.filteredOptions).toHaveLength(2);

    const local = renderHook(() => useSelectSearch(params));
    act(() => local.result.current.handleSearchChange({ target: { value: 'ban' } } as any));
    expect(local.result.current.filteredOptions).toEqual([options[1]]);

    const custom = renderHook(() =>
      useSelectSearch({ ...params, filterOption: (_input, option) => option.value === 'apple' }),
    );
    act(() => custom.result.current.handleSearchChange({ target: { value: 'x' } } as any));
    expect(custom.result.current.filteredOptions).toEqual([options[0]]);
  });
});

describe('ProTable form config', () => {
  const ruleColumns: ProColumns<Row>[] = [
    {
      dataIndex: 'name',
      formItemProps: { rules: [{ message: 'Name is required', required: true }] },
      title: 'Name',
    },
  ];

  it('form.ignoreRules skips the column rules', async () => {
    const request = makeRequest();
    render(
      <ProTable<Row>
        columns={ruleColumns}
        debounceTime={0}
        form={{ ignoreRules: true }}
        request={request}
        rowKey="id"
      />,
    );
    await screen.findByText('row-1');
    const calls = request.mock.calls.length;
    const form = document.querySelector('[data-pro-table-search]') as HTMLElement;
    fireEvent.click(within(form).getByText('Search'));
    await waitFor(() => expect(request.mock.calls.length).toBeGreaterThan(calls));
    expect(within(form).queryByText('Name is required')).toBeNull();
  });

  it('search.layout / form.layout vertical lays the query fields out vertically', () => {
    const { unmount } = render(
      <ProTable<Row>
        columns={ruleColumns}
        dataSource={rows}
        form={{ layout: 'vertical' }}
        rowKey="id"
      />,
    );
    const field = () =>
      document.querySelector('[data-pro-table-search] [data-layout]') as HTMLElement;
    expect(field().dataset.layout).toBe('vertical');
    unmount();
    render(
      <ProTable<Row>
        columns={ruleColumns}
        dataSource={rows}
        form={{ layout: 'vertical' }}
        rowKey="id"
        search={{ layout: 'horizontal', span: 8 }}
      />,
    );
    expect(field().dataset.layout).toBe('horizontal');
  });
});

describe('ProTable loading object', () => {
  const overlay = () => document.querySelector('[data-table-loading]');

  it('accepts a Spin config; spinning drives the overlay', () => {
    const { rerender } = render(
      <ProTable<Row>
        columns={[{ dataIndex: 'name', title: 'Name' }]}
        dataSource={rows}
        loading={{ spinning: true }}
        rowKey="id"
        search={false}
      />,
    );
    expect(overlay()).toBeTruthy();
    rerender(
      <ProTable<Row>
        columns={[{ dataIndex: 'name', title: 'Name' }]}
        dataSource={rows}
        loading={{ spinning: false }}
        rowKey="id"
        search={false}
      />,
    );
    expect(overlay()).toBeNull();
  });

  it('delay postpones the overlay', async () => {
    vi.useFakeTimers();
    render(
      <ProTable<Row>
        columns={[{ dataIndex: 'name', title: 'Name' }]}
        dataSource={rows}
        loading={{ delay: 500, spinning: true }}
        rowKey="id"
        search={false}
      />,
    );
    expect(overlay()).toBeNull();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500);
    });
    expect(overlay()).toBeTruthy();
  });
});

describe('ProTable responsive search.span', () => {
  it('resolves a number or a breakpoint object for the form width', () => {
    expect(resolveSpan(8, 300)).toBe(8);
    expect(resolveSpan(undefined, 300)).toBeUndefined();
    const span = { md: 12, xl: 8, xs: 24 };
    expect(resolveSpan(span, 400)).toBe(24);
    expect(resolveSpan(span, 800)).toBe(12);
    expect(resolveSpan(span, 1000)).toBe(12);
    expect(resolveSpan(span, 1300)).toBe(8);
    expect(resolveSpan(span, 2000)).toBe(8);
    // Only a larger breakpoint defined: fall back upwards.
    expect(resolveSpan({ lg: 6 }, 300)).toBe(6);
    expect(resolveSpan({}, 300)).toBeUndefined();
  });
});

describe('ProTable request typing', () => {
  interface User {
    age: number;
    id: string;
  }

  it('infers the row type from request and accepts ProComponents-style wrappers', () => {
    // A wrapper written against ProComponents types: typed params, sort, filter.
    const listUsers = async (
      params: { current?: number; pageSize?: number; status?: string },
      sort: Record<string, SortOrder>,
      filter: Record<string, (string | number)[] | null>,
    ) => {
      void sort;
      void filter;
      return { data: [{ age: 1, id: String(params.current) }] as User[], success: true, total: 1 };
    };
    const table = <ProTable request={listUsers} rowKey="id" />;
    expect(table).toBeTruthy();

    // `request` returning a wider object (extra keys) and inferred rows.
    type Inferred = ProTableProps<User, { status?: string }>['request'];
    expectTypeOf(listUsers).toMatchTypeOf<NonNullable<Inferred>>();

    expectTypeOf<Parameters<ProTableRequest<User>>[1]>().toEqualTypeOf<ProTableRequestSort>();
    expectTypeOf<Parameters<ProTableRequest<User>>[2]>().toEqualTypeOf<ProTableRequestFilter>();
    expectTypeOf<
      Parameters<ProTableRequest<User, { status?: string }>>[0]['status']
    >().toEqualTypeOf<string | undefined>();
    expectTypeOf<ReturnType<ProTableRequest<User>>>().resolves.toMatchTypeOf<{
      data?: User[] | undefined;
      total?: number;
    }>();
  });

  it('column request / loading / span / form props type-check', () => {
    expectTypeOf<ProColumns<User>['request']>().not.toBeAny();
    expectTypeOf<{ delay: 300; tip: 'x' }>().toMatchTypeOf<
      NonNullable<ProTableProps<User>['loading']>
    >();
    expectTypeOf<{ md: 12; xs: 24 }>().toMatchTypeOf<
      NonNullable<NonNullable<Exclude<ProTableProps<User>['search'], false>>['span']>
    >();
    expectTypeOf<{ ignoreRules: true; layout: 'vertical' }>().toMatchTypeOf<
      NonNullable<ProTableProps<User>['form']>
    >();
  });
});
