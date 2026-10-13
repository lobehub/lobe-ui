import { Table, type TableColumnsType } from '@lobehub/ui/base-ui';

interface DataType {
  address: string;
  age: number;
  city: string;
  key: string;
  name: string;
}

// Only the fields that differ from the table-level `column` defaults are set per column.
const columns: TableColumnsType<DataType> = [
  { align: 'start', dataIndex: 'name', ellipsis: false, title: 'Name' },
  { dataIndex: 'age', title: 'Age' },
  {
    children: [
      { dataIndex: 'city', title: 'City' },
      { dataIndex: 'address', title: 'Street address that is far too long to fit' },
    ],
    title: 'Location',
  },
];

const data: DataType[] = [
  {
    address: 'New York No. 1 Lake Park, Manhattan',
    age: 32,
    city: 'New York',
    key: '1',
    name: 'John Brown',
  },
  {
    address: 'London No. 1 Lake Park, Westminster',
    age: 42,
    city: 'London',
    key: '2',
    name: 'Jim Green',
  },
  {
    address: 'Sydney No. 1 Lake Park, The Rocks',
    age: 32,
    city: 'Sydney',
    key: '3',
    name: 'Joe Black',
  },
];

export default () => (
  <Table
    bordered
    column={{ align: 'center', ellipsis: true, width: 160 }}
    columns={columns}
    dataSource={data}
    pagination={false}
  />
);
