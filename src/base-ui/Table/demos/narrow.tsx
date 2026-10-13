import { Table, type TableColumnsType } from '@lobehub/ui/base-ui';
import type { Key } from 'react';

interface DataType {
  address: string;
  age: number;
  key: Key;
  name: string;
}

const columns: TableColumnsType<DataType> = [
  { dataIndex: 'name', title: 'Name' },
  { dataIndex: 'age', title: 'Age' },
  { dataIndex: 'address', title: 'Address' },
];

const dataSource = Array.from({ length: 200 }, (_, key): DataType => ({
  address: `Sample Address ${key}`,
  age: 30 + (key % 5),
  key,
  name: 'Sample Name',
}));

// A 300px box: the small pager has to wrap without overflowing the table.
export default () => (
  <div style={{ width: 300 }}>
    <Table<DataType>
      columns={columns}
      dataSource={dataSource}
      pagination={{ defaultCurrent: 13 }}
      size="small"
    />
  </div>
);
