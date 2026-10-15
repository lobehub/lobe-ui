import { render, screen } from '@testing-library/react';
import { motion } from 'motion/react';
import { afterEach, beforeEach, expect, it } from 'vitest';

import ConfigProvider from '@/ConfigProvider';

import Table from '../Table';
import type { TableColumn } from '../type';

// Unlike the other Table suites, this file deliberately leaves ResizeObserver undefined:
// consumers render Table in jsdom without a polyfill, and mounting must not throw there.
const original = globalThis.ResizeObserver;

beforeEach(() => {
  // @ts-expect-error simulate an environment without ResizeObserver
  delete globalThis.ResizeObserver;
});

afterEach(() => {
  globalThis.ResizeObserver = original;
});

interface Row {
  id: string;
  model: string;
}

const columns: TableColumn<Row>[] = [{ dataIndex: 'model', fixed: 'start', title: 'Model' }];

it('renders without ResizeObserver', () => {
  expect(globalThis.ResizeObserver).toBeUndefined();

  render(
    <ConfigProvider motion={motion}>
      <Table columns={columns} dataSource={[{ id: '1', model: 'gpt-5' }]} rowKey="id" />
    </ConfigProvider>,
  );

  expect(screen.getByText('gpt-5')).toBeTruthy();
});
