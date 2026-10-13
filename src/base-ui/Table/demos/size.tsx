import { Flexbox } from '@lobehub/ui';
import { Divider, Table, type TableColumn } from '@lobehub/ui/base-ui';

interface ModelRow {
  context: string;
  id: string;
  model: string;
  provider: string;
}

const columns: TableColumn<ModelRow>[] = [
  { dataIndex: 'model', title: 'Model' },
  { dataIndex: 'provider', title: 'Provider' },
  { align: 'right', dataIndex: 'context', title: 'Context' },
];

const data: ModelRow[] = [
  { context: '400K', id: '1', model: 'gpt-5', provider: 'OpenAI' },
  { context: '200K', id: '2', model: 'claude-sonnet-5', provider: 'Anthropic' },
  { context: '1M', id: '3', model: 'gemini-3-pro', provider: 'Google' },
];

export default () => (
  <Flexbox gap={8}>
    <Divider>Large size table</Divider>
    <Table columns={columns} dataSource={data} pagination={false} rowKey="id" size="large" />
    <Divider>Medium size table</Divider>
    <Table columns={columns} dataSource={data} pagination={false} rowKey="id" size="medium" />
    <Divider>Small size table</Divider>
    <Table columns={columns} dataSource={data} pagination={false} rowKey="id" size="small" />
  </Flexbox>
);
