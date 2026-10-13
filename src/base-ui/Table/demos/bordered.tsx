import { Table, type TableColumn } from '@lobehub/ui/base-ui';

interface UsageRow {
  calls: number;
  id: string;
  model: string;
  spend: number;
}

const columns: TableColumn<UsageRow>[] = [
  { dataIndex: 'model', render: (value: string) => <a href="#">{value}</a>, title: 'Model' },
  {
    align: 'right',
    dataIndex: 'calls',
    render: (value: number) => value.toLocaleString('en-US'),
    title: 'Calls',
  },
  {
    align: 'right',
    dataIndex: 'spend',
    render: (value: number) => `$${value.toFixed(2)}`,
    title: 'Spend',
  },
];

const data: UsageRow[] = [
  { calls: 18420, id: '1', model: 'gpt-5', spend: 312.4 },
  { calls: 22105, id: '2', model: 'claude-sonnet-5', spend: 287.1 },
  { calls: 9310, id: '3', model: 'gemini-3-pro', spend: 141.7 },
];

export default () => (
  <Table
    bordered
    columns={columns}
    dataSource={data}
    footer={(rows) => `Total spend: $${rows.reduce((sum, row) => sum + row.spend, 0).toFixed(2)}`}
    pagination={false}
    rowKey="id"
    title={() => 'Model usage'}
  />
);
