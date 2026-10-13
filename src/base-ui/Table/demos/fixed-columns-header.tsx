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
    width: 150,
  })),
  {
    fixed: 'end',
    key: 'operation',
    render: () => <a href="#">action</a>,
    title: 'Action',
    width: 100,
  },
];

const data: DataType[] = Array.from({ length: 50 }, (_, index) => ({
  address: `London Park no. ${index}`,
  age: 32,
  key: String(index),
  name: `Edward ${index}`,
}));

export default () => (
  <Table
    columns={columns}
    dataSource={data}
    pagination={false}
    scroll={{ x: 1500, y: 300 }}
    size="small"
  />
);
