import { Flexbox } from '@lobehub/ui';
import {
  InputNumber,
  Switch,
  Table,
  type TableColumnsType,
  type TableRowSelection,
} from '@lobehub/ui/base-ui';
import { useState } from 'react';

interface DataType {
  address: string;
  age: number;
  children?: DataType[];
  key: number;
  name: string;
}

const columns: TableColumnsType<DataType> = [
  { dataIndex: 'name', key: 'name', title: 'Name' },
  {
    dataIndex: 'age',
    key: 'age',
    sorter: (a, b) => a.age - b.age,
    title: 'Age',
    width: '12%',
  },
  {
    dataIndex: 'address',
    filters: [
      { text: 'New York', value: 'New York' },
      { text: 'London', value: 'London' },
    ],
    key: 'address',
    // Children are filtered first, so a parent stays while any descendant matches.
    onFilter: (value, record) =>
      record.address.startsWith(value as string) || Boolean(record.children?.length),
    title: 'Address',
    width: '30%',
  },
];

const data: DataType[] = [
  {
    address: 'New York No. 1 Lake Park',
    age: 60,
    children: [
      { address: 'New York No. 2 Lake Park', age: 42, key: 11, name: 'John Brown' },
      {
        address: 'New York No. 3 Lake Park',
        age: 30,
        children: [{ address: 'New York No. 3 Lake Park', age: 16, key: 121, name: 'Jimmy Brown' }],
        key: 12,
        name: 'John Brown jr.',
      },
      {
        address: 'London No. 1 Lake Park',
        age: 72,
        children: [
          {
            address: 'London No. 2 Lake Park',
            age: 42,
            children: [
              { address: 'London No. 3 Lake Park', age: 25, key: 1311, name: 'Jim Green jr.' },
              { address: 'London No. 4 Lake Park', age: 18, key: 1312, name: 'Jimmy Green sr.' },
            ],
            key: 131,
            name: 'Jim Green',
          },
        ],
        key: 13,
        name: 'Jim Green sr.',
      },
    ],
    key: 1,
    name: 'John Brown sr.',
  },
  { address: 'Sydney No. 1 Lake Park', age: 32, key: 2, name: 'Joe Black' },
];

const rowSelection: TableRowSelection<DataType> = {
  onChange: (selectedRowKeys, selectedRows, info) => {
    console.info(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows:', selectedRows, info);
  },
  onSelect: (record, selected, selectedRows) => {
    console.info(record, selected, selectedRows);
  },
};

export default () => {
  const [indentSize, setIndentSize] = useState(15);
  const [checkStrictly, setCheckStrictly] = useState(false);

  return (
    <Flexbox gap={16}>
      <Flexbox horizontal align="center" gap={16}>
        <Flexbox horizontal align="center" as="label" gap={8}>
          CheckStrictly
          <Switch checked={checkStrictly} onChange={setCheckStrictly} />
        </Flexbox>
        <Flexbox horizontal align="center" as="label" gap={8}>
          indentSize
          <InputNumber
            min={0}
            style={{ width: 96 }}
            value={indentSize}
            onChange={(value) => setIndentSize(Number(value ?? 0))}
          />
        </Flexbox>
      </Flexbox>
      <Table<DataType>
        columns={columns}
        dataSource={data}
        expandable={{ indentSize }}
        rowClassName={(_, __, indent) => `tree-level-${indent}`}
        rowSelection={{ ...rowSelection, checkStrictly }}
      />
    </Flexbox>
  );
};
