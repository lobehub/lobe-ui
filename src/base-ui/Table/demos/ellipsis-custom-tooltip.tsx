import { Table, type TableColumnsType, Tooltip } from '@lobehub/ui/base-ui';

interface DataType {
  address: string;
  age: number;
  key: string;
  name: string;
}

// `showTitle: false` drops the native title so `render` can show a styled Tooltip instead.
const columns: TableColumnsType<DataType> = [
  {
    dataIndex: 'name',
    key: 'name',
    render: (text: string) => <a href="#">{text}</a>,
    title: 'Name',
  },
  { dataIndex: 'age', key: 'age', title: 'Age', width: 80 },
  ...[1, 2, 3].map((index) => ({
    dataIndex: 'address' as const,
    ellipsis: { showTitle: false },
    key: `address ${index}`,
    render: (address: string) => (
      <Tooltip placement="topLeft" title={address}>
        <span>{address}</span>
      </Tooltip>
    ),
    title: index === 1 ? 'Address' : 'Long Column',
  })),
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
