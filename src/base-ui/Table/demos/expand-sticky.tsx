import { Table, type TableColumnsType } from '@lobehub/ui/base-ui';

interface DataType {
  address: string;
  age: number;
  description: string;
  key: number;
  name: string;
  team: string;
}

const columns: TableColumnsType<DataType> = [
  {
    dataIndex: 'team',
    key: 'team',
    onCell: (_, index = 0) => (index % 2 === 0 ? { rowSpan: 2 } : { rowSpan: 0 }),
    title: 'Team',
    width: 100,
  },
  Table.EXPAND_COLUMN,
  { dataIndex: 'name', key: 'name', title: 'Name', width: 150 },
  { dataIndex: 'age', key: 'age', title: 'Age' },
  { dataIndex: 'address', key: 'address', title: 'Address' },
  { key: 'x', render: () => <a href="#">Delete</a>, title: 'Action' },
];

const data: DataType[] = [
  {
    address: 'New York No. 1 Lake Park',
    age: 32,
    description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
    key: 1,
    name: 'John Brown',
    team: 'Team A',
  },
  {
    address: 'London No. 1 Lake Park',
    age: 42,
    description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
    key: 2,
    name: 'Jim Green',
    team: 'Team A',
  },
  {
    address: 'Jiangsu No. 1 Lake Park',
    age: 29,
    description: 'This not expandable',
    key: 3,
    name: 'Not Expandable',
    team: 'Team B',
  },
  {
    address: 'Sydney No. 1 Lake Park',
    age: 32,
    description: 'My name is Joe Black, I am 32 years old, living in Sydney No. 1 Lake Park.',
    key: 4,
    name: 'Joe Black',
    team: 'Team B',
  },
];

// `expandedRowOffset` keeps the first three columns (Team, expand, Name) beside the expanded row.
export default () => (
  <Table<DataType>
    bordered
    columns={columns}
    dataSource={data}
    expandable={{
      expandedRowOffset: 3,
      expandedRowRender: (record) => <div>{record.description}</div>,
    }}
  />
);
