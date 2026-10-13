import { Table, type TableColumnsType } from '@lobehub/ui/base-ui';
import type { Key } from 'react';

interface DataType {
  address: string;
  age: number;
  key: Key;
  name: string;
}

const columns: TableColumnsType<DataType> = [
  { dataIndex: 'name', title: 'Name', width: 150 },
  { dataIndex: 'age', title: 'Age', width: 150 },
  { dataIndex: 'address', title: 'Address' },
];

const dataSource = Array.from({ length: 100 }, (_, i): DataType => ({
  address: `London, Park Lane no. ${i}`,
  age: 32,
  key: i,
  name: `Edward King ${i}`,
}));

// `scroll.y` splits the header from a body that scrolls on its own.
export default () => (
  <Table<DataType>
    columns={columns}
    dataSource={dataSource}
    pagination={{ pageSize: 50 }}
    scroll={{ y: 55 * 5 }}
  />
);
