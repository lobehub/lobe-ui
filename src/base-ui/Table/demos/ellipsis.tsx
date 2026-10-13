import { Table, type TableColumnsType } from '@lobehub/ui/base-ui';

interface DataType {
  address: string;
  age: number;
  key: string;
  name: string;
}

// `ellipsis` truncates cells and headers to one line and switches the table to a fixed layout.
const columns: TableColumnsType<DataType> = [
  {
    dataIndex: 'name',
    key: 'name',
    render: (text: string) => <a href="#">{text}</a>,
    title: 'Name',
  },
  { dataIndex: 'age', key: 'age', title: 'Age', width: 80 },
  { dataIndex: 'address', ellipsis: true, key: 'address 1', title: 'Address' },
  {
    dataIndex: 'address',
    ellipsis: true,
    key: 'address 2',
    title: 'Long Column Long Column Long Column',
  },
  { dataIndex: 'address', ellipsis: true, key: 'address 3', title: 'Long Column Long Column' },
  { dataIndex: 'address', ellipsis: true, key: 'address 4', title: 'Long Column' },
];

const data: DataType[] = [
  {
    address: 'New York No. 1 Lake Park, New York No. 1 Lake Park',
    age: 32,
    key: '1',
    name: 'John Brown',
  },
  {
    address: 'London No. 2 Lake Park, London No. 2 Lake Park',
    age: 42,
    key: '2',
    name: 'Jim Green',
  },
  {
    address: 'Sydney No. 1 Lake Park, Sydney No. 1 Lake Park',
    age: 32,
    key: '3',
    name: 'Joe Black',
  },
];

export default () => <Table columns={columns} dataSource={data} pagination={false} />;
