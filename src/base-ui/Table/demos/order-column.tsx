import { Table, type TableColumnsType } from '@lobehub/ui/base-ui';
import type { Key } from 'react';

interface DataType {
  address: string;
  age: number;
  description: string;
  key: Key;
  name: string;
}

// `Table.EXPAND_COLUMN` and `Table.SELECTION_COLUMN` place the special columns.
const columns: TableColumnsType<DataType> = [
  { dataIndex: 'name', key: 'name', title: 'Name' },
  Table.EXPAND_COLUMN,
  { dataIndex: 'age', key: 'age', title: 'Age' },
  Table.SELECTION_COLUMN,
  { dataIndex: 'address', key: 'address', title: 'Address' },
];

const data: DataType[] = [
  {
    address: 'New York No. 1 Lake Park',
    age: 32,
    description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
    key: 1,
    name: 'John Brown',
  },
  {
    address: 'London No. 1 Lake Park',
    age: 42,
    description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
    key: 2,
    name: 'Jim Green',
  },
  {
    address: 'Jiangsu No. 1 Lake Park',
    age: 29,
    description: 'This not expandable',
    key: 3,
    name: 'Not Expandable',
  },
  {
    address: 'Sydney No. 1 Lake Park',
    age: 32,
    description: 'My name is Joe Black, I am 32 years old, living in Sydney No. 1 Lake Park.',
    key: 4,
    name: 'Joe Black',
  },
];

export default () => (
  <Table<DataType>
    columns={columns}
    dataSource={data}
    rowSelection={{}}
    expandable={{
      expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.description}</p>,
    }}
  />
);
