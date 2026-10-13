import { Table, type TableColumnsType, Tabs, type TabsItem } from '@lobehub/ui/base-ui';

interface DataType {
  key: string;
  name: string;
}

const columns: TableColumnsType<DataType> = [{ dataIndex: 'name', title: 'Name' }];

const dataSource: DataType[] = [{ key: '0', name: 'Jack' }];

const items: TabsItem[] = [
  {
    children: <Table bordered columns={columns} dataSource={dataSource} pagination={false} />,
    key: '1',
    label: 'Tab 1',
  },
];

const expandedRowRender = () => <Tabs defaultActiveKey="1" items={items} />;

export default () => (
  <Table<DataType>
    columns={columns}
    dataSource={dataSource}
    expandable={{ defaultExpandedRowKeys: ['0'], expandedRowRender }}
    pagination={false}
  />
);
