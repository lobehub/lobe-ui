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
    filters: [
      { text: 'Joe', value: 'Joe' },
      { text: 'Jim', value: 'Jim' },
      {
        children: [
          { text: 'Green', value: 'Green' },
          { text: 'Black', value: 'Black' },
        ],
        text: 'Submenu',
        value: 'Submenu',
      },
    ],
    // Name contains the picked value; sorts by length, descending only.
    onFilter: (value, record) => record.name.includes(String(value)),
    sortDirections: ['descend'],
    sorter: (a, b) => a.name.length - b.name.length,
    title: 'Name',
  },
  {
    dataIndex: 'age',
    defaultSortOrder: 'descend',
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
    showSorterTooltip={{ target: 'sorter-icon' }}
    onChange={(pagination, filters, sorter) => console.info('params', pagination, filters, sorter)}
  />
);
