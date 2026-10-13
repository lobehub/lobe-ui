import { Empty } from '@lobehub/ui';
import {
  ActionIcon,
  Button,
  Table,
  type TableColumn,
  type TablePaginationPlacement,
  type TableProps,
  type TableRowSelection,
  type TableSize,
  type TableVariant,
  Tag,
} from '@lobehub/ui/base-ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { DatabaseZap, Ellipsis } from 'lucide-react';

interface UsageRow {
  calls: number;
  description: string;
  id: string;
  model: string;
  provider: string;
  spend: number;
}

const PROVIDERS = ['OpenAI', 'Anthropic', 'Google', 'DeepSeek', 'Qwen'];

// 60 rows: above 50, so the page-size changer shows by default (like antd).
const data: UsageRow[] = Array.from({ length: 60 }, (_, index) => {
  const provider = PROVIDERS[index % PROVIDERS.length];
  return {
    calls: ((index * 7919) % 60_000) + 1000,
    description: `${provider} model #${index + 1}, billed per million tokens and routed through the default gateway.`,
    id: String(index),
    model: `${provider.toLowerCase()}-model-${String(index + 1).padStart(2, '0')}`,
    provider,
    spend: Math.round(((index * 3571) % 30_000) + 500) / 100,
  };
});

const columns: TableColumn<UsageRow>[] = [
  {
    dataIndex: 'model',
    sorter: (a, b) => a.model.localeCompare(b.model),
    title: 'Model',
    width: 200,
  },
  {
    dataIndex: 'provider',
    filters: PROVIDERS.map((provider) => ({ text: provider, value: provider })),
    onFilter: (value, record) => record.provider === value,
    render: (provider: string) => <Tag>{provider}</Tag>,
    title: 'Provider',
    width: 140,
  },
  {
    align: 'right',
    dataIndex: 'calls',
    render: (value: number) => value.toLocaleString('en-US'),
    sorter: (a, b) => a.calls - b.calls,
    title: 'Calls',
    width: 120,
  },
  {
    align: 'right',
    dataIndex: 'spend',
    defaultSortOrder: 'descend',
    render: (value: number) => `$${value.toFixed(2)}`,
    sortDirections: ['descend', 'ascend'],
    sorter: (a, b) => a.spend - b.spend,
    title: 'Spend',
    width: 120,
  },
  { dataIndex: 'description', title: 'Description' },
  {
    align: 'end',
    key: 'action',
    render: () => <ActionIcon icon={Ellipsis} size="small" title="Details" variant="filled" />,
    title: 'Action',
    width: 64,
  },
];

const expandable: TableProps<UsageRow>['expandable'] = {
  expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.description}</p>,
};

type SelectionMode = 'none' | 'checkbox' | 'radio' | 'checkbox + selections';
type ScrollX = 'unset' | 'scroll' | 'fixed columns';

const selectionOf = (mode: SelectionMode): TableRowSelection<UsageRow> | undefined => {
  if (mode === 'none') return undefined;
  if (mode === 'radio') return { type: 'radio' };
  return { selections: mode === 'checkbox + selections', type: 'checkbox' };
};

/**
 * One playground for every table-level switch: size, borders, title / footer, header, loading,
 * empty data, selection, expansion, ellipsis, layout, scrolling (fixed header, horizontal scroll,
 * pinned columns, virtual) and pagination placement / options.
 */
export default () => {
  const store = useCreateStore();
  const table = useControls(
    {
      variant: { options: ['borderless', 'outlined', 'filled'], value: 'borderless' },
      // `locale.emptyText` replaces the empty state (try it with `hasData` off).
      customEmpty: false,
      ellipsis: false,
      expandable: false,
      footer: false,
      hasData: true,
      // `hidden` keeps a column in `columns` but skips rendering it.
      hideDescription: false,
      loading: false,
      rowSelection: {
        options: ['none', 'checkbox', 'radio', 'checkbox + selections'],
        value: 'none',
      },
      showHeader: true,
      size: { options: ['large', 'medium', 'small'], value: 'medium' },
      tableLayout: { options: ['auto', 'fixed'], value: 'auto' },
      title: false,
    },
    { store },
  ) as {
    variant: TableVariant;
    customEmpty: boolean;
    ellipsis: boolean;
    expandable: boolean;
    footer: boolean;
    hasData: boolean;
    hideDescription: boolean;
    loading: boolean;
    rowSelection: SelectionMode;
    showHeader: boolean;
    size: TableSize;
    tableLayout: 'auto' | 'fixed';
    title: boolean;
  };

  const layout = useControls(
    {
      // 0 = no `scroll.y`; otherwise the body scrolls under a fixed header.
      scrollY: { max: 600, min: 0, step: 20, value: 0 },
      // `fixed columns` pins Model at the start and Action at the end.
      scrollX: { options: ['unset', 'scroll', 'fixed columns'], value: 'unset' },
      virtual: false,
      // 0 = full width; try ~300 to see the pager wrap in a narrow box.
      width: { max: 1200, min: 0, step: 20, value: 0 },
    },
    { store },
  ) as { scrollX: ScrollX; scrollY: number; virtual: boolean; width: number };

  const pager = useControls(
    {
      paginationBottom: {
        options: ['bottomStart', 'bottomCenter', 'bottomEnd', 'none'],
        value: 'bottomEnd',
      },
      paginationDisabled: false,
      paginationTop: { options: ['topStart', 'topCenter', 'topEnd', 'none'], value: 'none' },
      pageSize: { options: [5, 10, 20, 50], value: 10 },
      showQuickJumper: false,
      showTotal: true,
    },
    { store },
  ) as {
    pageSize: number;
    paginationBottom: TablePaginationPlacement;
    paginationDisabled: boolean;
    paginationTop: TablePaginationPlacement;
    showQuickJumper: boolean;
    showTotal: boolean;
  };

  const tableColumns = columns.map((column, index) => ({
    ...column,
    ellipsis: table.ellipsis,
    hidden: table.hideDescription && 'dataIndex' in column && column.dataIndex === 'description',
    ...(layout.scrollX === 'fixed columns' && index === 0 && { fixed: 'start' as const }),
    ...(layout.scrollX === 'fixed columns' &&
      index === columns.length - 1 && { fixed: 'end' as const }),
  }));

  const scroll: TableProps<UsageRow>['scroll'] = {};
  if (layout.scrollY > 0) scroll.y = layout.scrollY;
  if (layout.scrollX !== 'unset' || layout.virtual) scroll.x = 1200;
  // `virtual` needs a numeric `scroll.y`.
  if (layout.virtual && !scroll.y) scroll.y = 400;

  return (
    <StoryBook levaStore={store}>
      <div style={{ maxWidth: '100%', width: layout.width || '100%' }}>
        <Table<UsageRow>
          columns={tableColumns}
          dataSource={table.hasData ? data : []}
          expandable={table.expandable ? expandable : undefined}
          footer={table.footer ? (rows) => `${rows.length} rows on this page` : undefined}
          key={pager.pageSize}
          loading={table.loading}
          rowKey="id"
          rowSelection={selectionOf(table.rowSelection)}
          scroll={scroll}
          showHeader={table.showHeader}
          size={table.size}
          tableLayout={table.tableLayout === 'fixed' ? 'fixed' : undefined}
          title={table.title ? () => 'Model usage' : undefined}
          variant={table.variant}
          virtual={layout.virtual}
          locale={
            table.customEmpty
              ? {
                  emptyText: () => (
                    <Empty
                      action={<Button size="small">Connect a source</Button>}
                      description="Connect a data source to see usage here."
                      icon={DatabaseZap}
                      title="No usage yet"
                    />
                  ),
                }
              : undefined
          }
          pagination={{
            disabled: pager.paginationDisabled,
            defaultPageSize: pager.pageSize,
            placement: [pager.paginationTop, pager.paginationBottom],
            showQuickJumper: pager.showQuickJumper,
            showTotal: pager.showTotal
              ? (total, [start, end]) => `${start}-${end} of ${total} items`
              : undefined,
          }}
        />
      </div>
    </StoryBook>
  );
};
