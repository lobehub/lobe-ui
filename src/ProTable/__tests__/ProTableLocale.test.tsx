import { cleanup, render, screen } from '@testing-library/react';
import { motion } from 'motion/react';
import { afterEach, describe, expect, expectTypeOf, it } from 'vitest';

import ConfigProvider from '@/ConfigProvider';
import { stubMatchMedia } from '@/FormKit/test-utils';

import {
  PRO_TABLE_LOCALE_EN_US,
  PRO_TABLE_LOCALE_ZH_CN,
  PRO_TABLE_LOCALES,
  resolveProTableLocale,
} from '../locale';
import ProTable, { DEFAULT_PRO_TABLE_LOCALE } from '../ProTable';
import type { ProTableLocale, ProTableProps } from '../type';

stubMatchMedia();

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    disconnect() {}
    observe() {}
    unobserve() {}
  } as any;
}

afterEach(cleanup);

const columns = [{ dataIndex: 'name', title: 'Name' }];

describe('ProTable locale', () => {
  it('resolves built-in presets from a language tag', () => {
    expect(resolveProTableLocale('zh-CN')).toBe(PRO_TABLE_LOCALE_ZH_CN);
    expect(resolveProTableLocale('zh')).toBe(PRO_TABLE_LOCALE_ZH_CN);
    expect(resolveProTableLocale('en-US')).toBe(PRO_TABLE_LOCALE_EN_US);
    expect(resolveProTableLocale(undefined)).toBe(PRO_TABLE_LOCALE_EN_US);
    expect(PRO_TABLE_LOCALES['zh-CN'].alertSelected(2)).toBe('已选择 2 项');
    expect(DEFAULT_PRO_TABLE_LOCALE).toBe(PRO_TABLE_LOCALE_EN_US);
    // Both presets cover the same keys.
    expect(Object.keys(PRO_TABLE_LOCALE_ZH_CN).sort()).toEqual(
      Object.keys(PRO_TABLE_LOCALE_EN_US).sort(),
    );
  });

  it('reads the language from ConfigProvider, the locale prop overrides it', () => {
    const { unmount } = render(
      <ConfigProvider locale="zh-CN" motion={motion}>
        <ProTable columns={columns} dataSource={[{ name: 'a' }]} rowKey="name" />
      </ConfigProvider>,
    );
    expect(screen.getByText('查询')).toBeTruthy();
    expect(screen.getByText('重置')).toBeTruthy();
    unmount();
    render(
      <ConfigProvider locale="zh-CN" motion={motion}>
        <ProTable
          columns={columns}
          dataSource={[{ name: 'a' }]}
          locale={{ search: 'Go' }}
          rowKey="name"
        />
      </ConfigProvider>,
    );
    expect(screen.getByText('Go')).toBeTruthy();
    expect(screen.getByText('重置')).toBeTruthy();
  });

  it('defaults to English and forwards table texts to the Table', () => {
    render(
      <ConfigProvider motion={motion}>
        <ProTable
          columns={columns}
          dataSource={[]}
          locale={{ emptyText: 'Nothing here' }}
          rowKey="name"
        />
      </ConfigProvider>,
    );
    expect(screen.getByText('Search')).toBeTruthy();
    expect(screen.getByText('Nothing here')).toBeTruthy();
  });

  it('accepts a ProTableLocale object (ReactNode collapse / expand) as locale', () => {
    const pro: ProTableLocale = { collapse: <span>less</span>, expand: <span>more</span> };
    expectTypeOf(pro).toMatchTypeOf<NonNullable<ProTableProps['locale']>>();
    expectTypeOf(PRO_TABLE_LOCALE_ZH_CN).toMatchTypeOf<NonNullable<ProTableProps['locale']>>();
    expectTypeOf<NonNullable<ProTableProps['locale']>['collapse']>().toEqualTypeOf<
      ProTableLocale['collapse']
    >();
    expectTypeOf<{ emptyText: string; filterReset: string }>().toMatchTypeOf<
      NonNullable<ProTableProps['locale']>
    >();
    const element = <ProTable columns={columns} locale={{ ...PRO_TABLE_LOCALE_ZH_CN, ...pro }} />;
    expect(element).toBeTruthy();
  });
});
