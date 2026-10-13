import { Table, type TableColumnsType } from '@lobehub/ui/base-ui';

interface DataType {
  address: string;
  age: number;
  key: string;
  name: string;
}

const columns: TableColumnsType<DataType> = [
  { dataIndex: 'name', fixed: 'start', key: 'name', title: 'Full Name', width: 120 },
  { dataIndex: 'age', fixed: 'start', key: 'age', title: 'Age', width: 80 },
  ...Array.from({ length: 8 }, (_, index) => ({
    dataIndex: 'address' as const,
    key: String(index + 1),
    title: `Column ${index + 1}`,
  })),
  {
    fixed: 'end',
    key: 'operation',
    render: () => <a href="#">action</a>,
    title: 'Action',
    width: 100,
  },
];

const data: DataType[] = [
  { address: 'New York Park', age: 32, key: '1', name: 'John Brown' },
  { address: 'London Park', age: 40, key: '2', name: 'Jim Green' },
];

export default () => (
  <Table bordered columns={columns} dataSource={data} pagination={false} scroll={{ x: 1300 }} />
);
