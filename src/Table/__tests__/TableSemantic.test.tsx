import { cleanup, render as rtlRender } from '@testing-library/react';
import { motion } from 'motion/react';
import type { HTMLAttributes, ReactNode, TdHTMLAttributes } from 'react';

import ConfigProvider from '@/ConfigProvider';

import { TableExpandedRow } from '../atoms';
import { resolveSemantic } from '../semantic';
import Table from '../Table';
import type { TableClassNames, TableColumn, TableProps } from '../type';

// Base-ui buttons (ActionIcon in the expand / filter triggers) read the motion component from
// ConfigProvider, so every render (and rerender) goes through it.
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
  spend: number;
}

const rows: Row[] = Array.from({ length: 12 }, (_, index) => ({
  id: String(index),
  model: `m-${index}`,
  spend: index,
}));

const columns: TableColumn<Row>[] = [
  { dataIndex: 'model', title: 'Model' },
  { dataIndex: 'spend', title: 'Spend' },
];

const renderTable = (props: Partial<TableProps<Row>> = {}) =>
  render(
    <Table<Row>
      columns={columns}
      dataSource={rows}
      footer={() => 'Footer'}
      pagination={{ pageSize: 5 }}
      rowKey="id"
      title={() => 'Title'}
      {...props}
    />,
  );

const nestedClassNames: TableClassNames = {
  body: { cell: 'b-cell', row: 'b-row', wrapper: 'b-wrapper' },
  content: 'c-content',
  footer: 'c-footer',
  header: { cell: 'h-cell', row: 'h-row', wrapper: 'h-wrapper' },
  pagination: { item: 'p-item', root: 'p-root' },
  root: 'c-root',
  section: 'c-section',
  title: 'c-title',
};

const styleOf = (element: Element | null) => element?.getAttribute('style') ?? '';

describe('Table semantic classNames / styles', () => {
  afterEach(cleanup);

  test('antd 6 nested classNames reach every semantic part', () => {
    const { container } = renderTable({ classNames: nestedClassNames });

    expect(container.firstElementChild!.classList.contains('c-root')).toBe(true);
    expect(container.querySelector('.lobe-table-container.c-section')).toBeTruthy();
    expect(container.querySelector('.lobe-table-title.c-title')).toBeTruthy();
    expect(container.querySelector('.lobe-table-footer.c-footer')).toBeTruthy();
    expect(container.querySelector('.lobe-table-content.c-content')).toBeTruthy();
    expect(container.querySelector('thead.h-wrapper')).toBeTruthy();
    expect(container.querySelectorAll('thead tr.h-row')).toHaveLength(1);
    expect(container.querySelectorAll('th.h-cell')).toHaveLength(2);
    expect(container.querySelector('tbody.b-wrapper')).toBeTruthy();
    expect(container.querySelectorAll('tbody tr.b-row')).toHaveLength(5);
    expect(container.querySelectorAll('td.b-cell')).toHaveLength(10);
    expect(container.querySelector('nav.p-root')).toBeTruthy();
    expect(container.querySelectorAll('nav button.p-item')).toHaveLength(3);
  });

  test('antd 6 nested styles reach every semantic part', () => {
    const { container } = renderTable({
      styles: {
        body: { cell: { color: 'red' }, row: { color: 'blue' }, wrapper: { color: 'green' } },
        content: { color: 'olive' },
        footer: { color: 'navy' },
        header: { cell: { color: 'pink' }, row: { color: 'gray' }, wrapper: { color: 'teal' } },
        pagination: { item: { color: 'orange' }, root: { color: 'purple' } },
        root: { color: 'maroon' },
        section: { color: 'silver' },
        title: { color: 'lime' },
      },
    });

    expect(styleOf(container.firstElementChild)).toContain('color: maroon');
    expect(styleOf(container.querySelector('.lobe-table-container'))).toContain('color: silver');
    expect(styleOf(container.querySelector('.lobe-table-title'))).toContain('color: lime');
    expect(styleOf(container.querySelector('.lobe-table-footer'))).toContain('color: navy');
    expect(styleOf(container.querySelector('.lobe-table-content'))).toContain('color: olive');
    expect(styleOf(container.querySelector('thead'))).toContain('color: teal');
    expect(styleOf(container.querySelector('thead tr'))).toContain('color: gray');
    expect(styleOf(container.querySelector('th'))).toContain('color: pink');
    expect(styleOf(container.querySelector('tbody'))).toContain('color: green');
    expect(styleOf(container.querySelector('tbody tr'))).toContain('color: blue');
    expect(styleOf(container.querySelector('td'))).toContain('color: red');
    expect(styleOf(container.querySelector('nav'))).toContain('color: purple');
    expect(styleOf(container.querySelector('nav button[aria-current="page"]'))).toContain(
      'color: orange',
    );
  });

  test.each([undefined, { x: 480, y: 200 }])(
    'empty rows and cells receive the body slots with scroll=%j',
    (scroll) => {
      const { container } = renderTable({
        classNames: nestedClassNames,
        dataSource: [],
        locale: { emptyText: 'No records' },
        pagination: false,
        rowSelection: {},
        scroll,
        styles: {
          body: {
            cell: { borderWidth: 0, paddingInline: 24 },
            row: { color: 'blue' },
          },
        },
      });
      const placeholder = container.querySelector<HTMLTableRowElement>(
        'tr.lobe-table-placeholder',
      )!;
      const cell = placeholder.querySelector<HTMLTableCellElement>('td')!;

      expect(placeholder.classList.contains('b-row')).toBe(true);
      expect(placeholder.classList.contains('lobe-table__body-row')).toBe(true);
      expect(placeholder.style.color).toBe('blue');
      expect(cell.classList.contains('b-cell')).toBe(true);
      expect(cell.classList.contains('lobe-table__body-cell')).toBe(true);
      expect(cell.style.borderWidth).toBe('0px');
      expect(cell.style.paddingInline).toBe('24px');
      expect(cell.colSpan).toBe(3);
      expect(cell.textContent).toBe('No records');
      expect(container.querySelector('.lobe-table-measure-row .b-cell')).toBeNull();
    },
  );

  test('custom body components and function-form slots survive empty/data transitions', () => {
    const BodyRow = (props: HTMLAttributes<HTMLTableRowElement>) => (
      <tr data-custom-row="" {...props} />
    );
    const BodyCell = (props: TdHTMLAttributes<HTMLTableCellElement>) => (
      <td data-custom-cell="" {...props} />
    );
    const props: TableProps<Row> = {
      classNames: ({ props }) => ({
        body: { cell: props.dataSource?.length ? 'data-cell' : 'empty-cell', row: 'custom-row' },
      }),
      columns,
      components: { body: { cell: BodyCell, row: BodyRow } },
      locale: { emptyText: 'No records' },
      pagination: false,
      rowKey: 'id',
      styles: ({ props }) => ({
        body: { cell: { paddingInline: props.dataSource?.length ? 8 : 24 } },
      }),
    };
    const { container, rerender } = render(<Table {...props} dataSource={[]} />);
    const expectCell = (className: string, padding: string) => {
      const cell = container.querySelector<HTMLTableCellElement>(`.${className}`)!;
      expect(cell.hasAttribute('data-custom-cell')).toBe(true);
      expect(cell.style.paddingInline).toBe(padding);
      expect(cell.parentElement!.classList.contains('custom-row')).toBe(true);
      expect(cell.parentElement!.hasAttribute('data-custom-row')).toBe(true);
      return cell;
    };

    expect(expectCell('empty-cell', '24px').textContent).toBe('No records');
    rerender(<Table {...props} dataSource={rows.slice(0, 1)} />);
    expect(expectCell('data-cell', '8px').textContent).toBe('m-0');
    expect(container.querySelector('.lobe-table-placeholder')).toBeNull();
    rerender(<Table {...props} dataSource={[]} />);
    expect(expectCell('empty-cell', '24px').colSpan).toBe(2);
  });

  test('expanded-row cell slots do not override collapsed visibility', () => {
    const { container, rerender } = render(
      <table>
        <tbody>
          <TableExpandedRow
            cellClassName="expanded-cell"
            cellStyle={{ paddingInline: 24 }}
            colSpan={2}
            expanded={false}
            style={{ color: 'blue', display: 'table-row' }}
          >
            Expanded content
          </TableExpandedRow>
        </tbody>
      </table>,
    );
    expect(container.querySelector('tr')!.style.display).toBe('none');
    expect(container.querySelector('tr')!.style.color).toBe('blue');
    expect(
      container.querySelector<HTMLTableCellElement>('.expanded-cell')!.style.paddingInline,
    ).toBe('24px');
    rerender(
      <table>
        <tbody>
          <TableExpandedRow colSpan={2} style={{ display: 'table-row' }}>
            Expanded content
          </TableExpandedRow>
        </tbody>
      </table>,
    );
    expect(container.querySelector('tr')!.style.display).toBe('table-row');
  });

  test('function forms receive the table props', () => {
    const classNames = vi.fn(({ props }: { props: TableProps<Row> }) => ({
      root: props.variant === 'outlined' ? 'is-outlined' : 'not-outlined',
    }));
    const styles = vi.fn(({ props }: { props: TableProps<Row> }) => ({
      header: { cell: { color: props.size === 'small' ? 'red' : 'blue' } },
    }));
    const { container } = renderTable({
      variant: 'outlined' as const,
      classNames,
      size: 'small',
      styles,
    });

    expect(classNames).toHaveBeenCalledWith({
      props: expect.objectContaining({ variant: 'outlined' as const }),
    });
    expect(styles).toHaveBeenCalledWith({ props: expect.objectContaining({ size: 'small' }) });
    expect(container.firstElementChild!.classList.contains('is-outlined')).toBe(true);
    expect(styleOf(container.querySelector('th'))).toContain('color: red');
  });

  test('rootClassName, className and style sit on the root next to classNames.root', () => {
    const { container } = renderTable({
      className: 'my-class',
      classNames: { root: 'semantic-root' },
      rootClassName: 'my-root',
      style: { color: 'red' },
      styles: { root: { color: 'blue', margin: 4 } },
    });
    const root = container.firstElementChild!;
    expect([...root.classList]).toEqual(
      expect.arrayContaining(['lobe-table-wrapper', 'my-root', 'my-class', 'semantic-root']),
    );
    // Like antd: `style` wins over `styles.root`.
    expect(styleOf(root)).toContain('color: red');
    expect(styleOf(root)).toContain('margin: 4px');
  });

  test('pagination semantic keys merge with pagination.classNames / styles', () => {
    const { container } = renderTable({
      classNames: { pagination: { item: 't-item', root: 't-root' } },
      pagination: {
        classNames: { item: 'p-item', root: 'p-root' },
        pageSize: 5,
        styles: { root: { color: 'red', margin: 2 } },
      },
      styles: { pagination: { root: { color: 'blue' } } },
    });
    const nav = container.querySelector('nav')!;
    expect(nav.classList.contains('t-root')).toBe(true);
    expect(nav.classList.contains('p-root')).toBe(true);
    expect(container.querySelector('button.t-item.p-item')).toBeTruthy();
    // Like antd: the table's `styles.pagination` wins.
    expect(styleOf(nav)).toContain('color: blue');
    expect(styleOf(nav)).toContain('margin: 2px');
  });

  test('virtual tables take the semantic class names too', () => {
    const { container } = renderTable({
      classNames: { body: { row: 'v-row' }, header: { cell: 'v-th' }, root: 'v-root' },
      pagination: false,
      scroll: { y: 200 },
      virtual: true,
    });
    expect(container.firstElementChild!.classList.contains('v-root')).toBe(true);
    expect(container.querySelector('.v-th')).toBeTruthy();
  });
});

describe('semantic helpers', () => {
  test('resolveSemantic calls functions with the info and passes objects through', () => {
    const info = { props: { variant: 'outlined' as const } };
    expect(resolveSemantic({ root: 'a' }, info)).toEqual({ root: 'a' });
    expect(
      resolveSemantic(({ props }: any) => ({ root: String(props.variant === 'outlined') }), info),
    ).toEqual({
      root: 'true',
    });
    expect(resolveSemantic(undefined, info)).toBeUndefined();
  });
});
