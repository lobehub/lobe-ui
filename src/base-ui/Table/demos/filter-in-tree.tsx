import { Table, type TableColumn } from '@lobehub/ui/base-ui';

interface PersonRow {
  address: string;
  age: number;
  key: string;
  name: string;
}

const columns: TableColumn<PersonRow>[] = [
  {
    dataIndex: 'name',
    filterMode: 'tree',
    filterSearch: true,
    filters: [
      { text: 'Joe', value: 'Joe' },
      {
        children: [
          { text: 'Yellow', value: 'Yellow' },
          { text: 'Pink', value: 'Pink' },
        ],
        text: 'Category 1',
        value: 'Category 1',
      },
      {
        children: [
          { text: 'Green', value: 'Green' },
          { text: 'Black', value: 'Black' },
        ],
        text: 'Category 2',
        value: 'Category 2',
      },
    ],
    onFilter: (value, record) => record.name.includes(String(value)),
    title: 'Name',
    width: '30%',
  },
  {
    dataIndex: 'age',
    sorter: (a, b) => a.age - b.age,
    title: 'Age',
  },
  {
    dataIndex: 'address',
    filters: [
      { text: 'London', value: 'London' },
      { text: 'New York', value: 'New York' },
    ],
    filterSearch: true,
    onFilter: (value, record) => record.address.startsWith(String(value)),
    title: 'Address',
    width: '40%',
  },
];

const data: PersonRow[] = [
  { address: 'New York No. 1 Lake Park', age: 32, key: '1', name: 'John Brown' },
  { address: 'London No. 1 Lake Park', age: 42, key: '2', name: 'Jim Green' },
  { address: 'Sydney No. 1 Lake Park', age: 32, key: '3', name: 'Joe Black' },
  { address: 'London No. 2 Lake Park', age: 32, key: '4', name: 'Jim Red' },
];

export default () => (
  <Table
    columns={columns}
    dataSource={data}
    pagination={false}
    onChange={(pagination, filters, sorter) => console.info('params', pagination, filters, sorter)}
  />
);
