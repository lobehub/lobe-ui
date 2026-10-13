import { cleanup, render as rtlRender } from '@testing-library/react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';

import ConfigProvider from '@/ConfigProvider';

import Table, { resolveTableVariant } from '../Table';
import type { TableColumn } from '../type';

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
  id: string;
  model: string;
}

const rows: Row[] = [{ id: '1', model: 'gpt' }];
const columns: TableColumn<Row>[] = [{ dataIndex: 'model', title: 'Model' }];

const variantOf = (container: HTMLElement) =>
  ['outlined', 'filled', 'borderless'].find((v) => container.querySelector(`.lobe-table-${v}`));

afterEach(cleanup);

describe('Table deprecated `bordered`', () => {
  it('maps bordered to variant, explicit variant wins', () => {
    expect(resolveTableVariant(undefined, undefined)).toBe('borderless');
    expect(resolveTableVariant(undefined, true)).toBe('outlined');
    expect(resolveTableVariant(undefined, false)).toBe('borderless');
    expect(resolveTableVariant('filled', true)).toBe('filled');
    expect(resolveTableVariant('borderless', true)).toBe('borderless');
    expect(resolveTableVariant('outlined', false)).toBe('outlined');
  });

  it('renders bordered as outlined and keeps it off the DOM', () => {
    const { container } = render(
      <Table bordered columns={columns} dataSource={rows} rowKey="id" />,
    );
    expect(variantOf(container)).toBe('outlined');
    expect(container.querySelector('[bordered]')).toBeNull();
  });

  it('bordered={false} keeps the default variant; explicit variant wins over bordered', () => {
    const off = render(<Table bordered={false} columns={columns} dataSource={rows} rowKey="id" />);
    expect(variantOf(off.container)).toBe('borderless');
    off.unmount();
    const { container } = render(
      <Table bordered columns={columns} dataSource={rows} rowKey="id" variant="filled" />,
    );
    expect(variantOf(container)).toBe('filled');
  });
});
