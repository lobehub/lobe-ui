import { Table, type TableColumnsType } from '@lobehub/ui/base-ui';

interface DataType {
  address: string;
  age: number;
  key: string;
  name: string;
}

// Pinned columns do not have to be adjacent: each one stacks after the pinned columns before it.
const columns: TableColumnsType<DataType> = [
  { dataIndex: 'name', fixed: 'start', key: 'name', title: 'Full Name', width: 100 },
  { dataIndex: 'age', key: 'age', title: 'Age', width: 100 },
  { dataIndex: 'address', fixed: 'start', key: '1', title: 'Column 1' },
  { dataIndex: 'address', key: '2', title: 'Column 2' },
  { dataIndex: 'address', fixed: 'start', key: '3', title: 'Column 3' },
  { dataIndex: 'address', key: '4', title: 'Column 4' },
  { dataIndex: 'address', key: '5', title: 'Column 5' },
  { dataIndex: 'address', key: '6', title: 'Column 6' },
  { dataIndex: 'address', fixed: 'end', key: '7', title: 'Column 7' },
  { dataIndex: 'address', key: '8', title: 'Column 8' },
  { dataIndex: 'address', key: '9', title: 'Column 9' },
  { dataIndex: 'address', fixed: 'end', key: '10', title: 'Column 10' },
  {
    fixed: 'end',
    key: 'operation',
    render: () => <a href="#">action</a>,
    title: 'Action',
    width: 100,
  },
];

const data: DataType[] = Array.from({ length: 10 }, (_, index) => ({
  address: `London Park no. ${index}`,
  age: 32,
  key: String(index),
  name: `Edward King ${index}`,
}));

export default () => (
  <Table
    bordered
    columns={columns}
    dataSource={data}
    pagination={false}
    scroll={{ x: 'max-content' }}
  />
);
