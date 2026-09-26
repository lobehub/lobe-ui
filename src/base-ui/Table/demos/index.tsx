import { Table, type TableColumn } from '@lobehub/ui/base-ui';

interface UsageRow {
  calls: number;
  id: string;
  model: string;
  provider: string;
  spend: number;
}

const data: UsageRow[] = [
  { calls: 18420, id: '1', model: 'gpt-5', provider: 'OpenAI', spend: 312.4 },
  { calls: 60210, id: '2', model: 'gpt-5-mini', provider: 'OpenAI', spend: 64.9 },
  { calls: 22105, id: '3', model: 'claude-sonnet-5', provider: 'Anthropic', spend: 287.1 },
  { calls: 41870, id: '4', model: 'claude-haiku-4-5', provider: 'Anthropic', spend: 38.2 },
  { calls: 9310, id: '5', model: 'gemini-3-pro', provider: 'Google', spend: 141.7 },
  { calls: 35620, id: '6', model: 'gemini-3-flash', provider: 'Google', spend: 22.6 },
  { calls: 27540, id: '7', model: 'deepseek-v4', provider: 'DeepSeek', spend: 31.5 },
  { calls: 12090, id: '8', model: 'qwen3-max', provider: 'Qwen', spend: 26.8 },
];

const providers = [...new Set(data.map((row) => row.provider))];

const columns: TableColumn<UsageRow>[] = [
  { dataIndex: 'model', sorter: (a, b) => a.model.localeCompare(b.model), title: 'Model' },
  {
    dataIndex: 'provider',
    filters: providers.map((provider) => ({ text: provider, value: provider })),
    onFilter: (value, record) => record.provider === value,
    title: 'Provider',
  },
  {
    align: 'right',
    dataIndex: 'calls',
    render: (value: number) => value.toLocaleString('en-US'),
    sorter: (a, b) => a.calls - b.calls,
    title: 'Calls',
  },
  {
    align: 'right',
    dataIndex: 'spend',
    defaultSortOrder: 'descend',
    render: (value: number) => `$${value.toFixed(2)}`,
    sortDirections: ['descend', 'ascend'],
    sorter: (a, b) => a.spend - b.spend,
    title: 'Spend',
  },
  {
    fixed: 'right',
    key: 'action',
    render: () => <a href="#">Details</a>,
    title: 'Action',
    width: 90,
  },
];

export default () => (
  <Table
    columns={columns}
    dataSource={data}
    pagination={{ pageSize: 5 }}
    rowKey="id"
    scroll={{ x: 'max-content', y: 260 }}
    size="small"
  />
);
