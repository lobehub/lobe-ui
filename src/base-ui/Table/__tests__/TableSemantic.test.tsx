import { cleanup, render } from '@testing-library/react';

import { normalizeClassNames, normalizeStyles, resolveSemantic } from '../semantic';
import Table from '../Table';
import type { TableClassNames, TableColumn, TableProps, TableStyles } from '../type';

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

  test('function forms receive the table props', () => {
    const classNames = vi.fn(({ props }: { props: TableProps<Row> }) => ({
      root: props.bordered ? 'is-bordered' : 'not-bordered',
    }));
    const styles = vi.fn(({ props }: { props: TableProps<Row> }) => ({
      header: { cell: { color: props.size === 'small' ? 'red' : 'blue' } },
    }));
    const { container } = renderTable({ bordered: true, classNames, size: 'small', styles });

    expect(classNames).toHaveBeenCalledWith({ props: expect.objectContaining({ bordered: true }) });
    expect(styles).toHaveBeenCalledWith({ props: expect.objectContaining({ size: 'small' }) });
    expect(container.firstElementChild!.classList.contains('is-bordered')).toBe(true);
    expect(styleOf(container.querySelector('th'))).toContain('color: red');
  });

  test('legacy flat keys keep working, as classNames and styles', () => {
    const { container } = renderTable({
      classNames: {
        body: 'l-body',
        cell: 'l-cell',
        header: 'l-header',
        row: 'l-row',
        wrapper: 'l-wrapper',
      },
      pagination: false,
      styles: {
        body: { color: 'green' },
        cell: { color: 'red' },
        header: { color: 'pink' },
        row: { color: 'blue' },
        wrapper: { color: 'silver' },
      },
    });

    expect(container.querySelector('tbody.l-body')).toBeTruthy();
    expect(container.querySelectorAll('th.l-header')).toHaveLength(2);
    expect(container.querySelectorAll('tr.l-row')).toHaveLength(12);
    expect(container.querySelectorAll('td.l-cell')).toHaveLength(24);
    expect(container.querySelector('.lobe-table-container.l-wrapper')).toBeTruthy();
    expect(styleOf(container.querySelector('tbody'))).toContain('color: green');
    expect(styleOf(container.querySelector('td'))).toContain('color: red');
    expect(styleOf(container.querySelector('th'))).toContain('color: pink');
    expect(styleOf(container.querySelector('tbody tr'))).toContain('color: blue');
    expect(styleOf(container.querySelector('.lobe-table-container'))).toContain('color: silver');
  });

  test('legacy and nested keys merge', () => {
    const { container } = renderTable({
      classNames: {
        body: { cell: 'n-cell' },
        cell: 'l-cell',
        section: 'n-section',
        wrapper: 'l-wrapper',
      },
    });
    expect(container.querySelector('td.l-cell.n-cell')).toBeTruthy();
    expect(container.querySelector('.lobe-table-container.l-wrapper.n-section')).toBeTruthy();
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
    const info = { props: { bordered: true } };
    expect(resolveSemantic({ root: 'a' }, info)).toEqual({ root: 'a' });
    expect(resolveSemantic(({ props }: any) => ({ root: String(props.bordered) }), info)).toEqual({
      root: 'true',
    });
    expect(resolveSemantic(undefined, info)).toBeUndefined();
  });

  test('normalizeClassNames maps the legacy keys', () => {
    expect(
      normalizeClassNames({ body: 'b', cell: 'c', header: 'h', row: 'r', wrapper: 'w' }),
    ).toEqual({
      body: { cell: 'c', row: 'r', wrapper: 'b' },
      header: { cell: 'h' },
      pagination: {},
      section: 'w',
    });
  });

  test('normalizeStyles tells legacy flat styles from nested ones', () => {
    const styles: TableStyles = {
      body: { color: 'green' },
      header: { cell: { color: 'pink' }, wrapper: { color: 'teal' } },
    };
    const normalized = normalizeStyles(styles);
    expect(normalized.body).toEqual({
      cell: undefined,
      row: undefined,
      wrapper: { color: 'green' },
    });
    expect(normalized.header).toEqual({ cell: { color: 'pink' }, wrapper: { color: 'teal' } });
    expect(normalizeStyles({ header: { color: 'red' } }).header).toEqual({
      cell: { color: 'red' },
    });
  });
});
