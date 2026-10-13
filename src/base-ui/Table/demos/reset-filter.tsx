import { Flexbox, Text } from '@lobehub/ui';
import {
  Button,
  Table,
  type TableColumn,
  type TableFilters,
  type TableSorterResult,
} from '@lobehub/ui/base-ui';
import { useState } from 'react';

interface PersonRow {
  address: string;
  age: number;
  key: string;
  name: string;
}

const data: PersonRow[] = [
  { address: 'New York No. 1 Lake Park', age: 32, key: '1', name: 'John Brown' },
  { address: 'London No. 1 Lake Park', age: 42, key: '2', name: 'Jim Green' },
  { address: 'Sydney No. 1 Lake Park', age: 32, key: '3', name: 'Joe Black' },
  { address: 'London No. 2 Lake Park', age: 32, key: '4', name: 'Jim Red' },
];

// Uncontrolled: starts filtered to London, and Reset in the panel returns to that default.
const defaultColumns: TableColumn<PersonRow>[] = [
  { dataIndex: 'name', title: 'Name' },
  { dataIndex: 'age', title: 'Age' },
  {
    dataIndex: 'address',
    defaultFilteredValue: ['London'],
    filterResetToDefaultFilteredValue: true,
    filters: [
      { text: 'London', value: 'London' },
      { text: 'New York', value: 'New York' },
      { text: 'Sydney', value: 'Sydney' },
    ],
    onFilter: (value, record) => record.address.includes(String(value)),
    title: 'Address',
  },
];

export default () => {
  const [filteredInfo, setFilteredInfo] = useState<TableFilters>({});
  const [sortedInfo, setSortedInfo] = useState<TableSorterResult<PersonRow>>({});

  const orderOf = (columnKey: string) =>
    sortedInfo.columnKey === columnKey ? (sortedInfo.order ?? null) : null;

  const columns: TableColumn<PersonRow>[] = [
    {
      dataIndex: 'name',
      ellipsis: true,
      filteredValue: filteredInfo.name ?? null,
      filters: [
        { text: 'Joe', value: 'Joe' },
        { text: 'Jim', value: 'Jim' },
      ],
      key: 'name',
      onFilter: (value, record) => record.name.includes(String(value)),
      sortOrder: orderOf('name'),
      sorter: (a, b) => a.name.length - b.name.length,
      title: 'Name',
    },
    {
      dataIndex: 'age',
      ellipsis: true,
      key: 'age',
      sortOrder: orderOf('age'),
      sorter: (a, b) => a.age - b.age,
      title: 'Age',
    },
    {
      dataIndex: 'address',
      ellipsis: true,
      filteredValue: filteredInfo.address ?? null,
      filters: [
        { text: 'London', value: 'London' },
        { text: 'New York', value: 'New York' },
      ],
      key: 'address',
      onFilter: (value, record) => record.address.includes(String(value)),
      sortOrder: orderOf('address'),
      sorter: (a, b) => a.address.length - b.address.length,
      title: 'Address',
    },
  ];

  return (
    <Flexbox gap={16}>
      <Flexbox horizontal gap={8}>
        <Button onClick={() => setSortedInfo({ columnKey: 'age', order: 'descend' })}>
          Sort age
        </Button>
        <Button onClick={() => setFilteredInfo({})}>Clear filters</Button>
        <Button
          onClick={() => {
            setFilteredInfo({});
            setSortedInfo({});
          }}
        >
          Clear filters and sorters
        </Button>
      </Flexbox>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        onChange={(_, filters, sorter) => {
          console.info('Various parameters', filters, sorter);
          setFilteredInfo(filters);
          setSortedInfo(Array.isArray(sorter) ? (sorter[0] ?? {}) : sorter);
        }}
      />
      <Text type="secondary">defaultFilteredValue + filterResetToDefaultFilteredValue</Text>
      <Table columns={defaultColumns} dataSource={data} pagination={false} />
    </Flexbox>
  );
};
