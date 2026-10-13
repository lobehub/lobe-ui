import { Table, type TableColumnsType, type TableRowSelection } from '@lobehub/ui/base-ui';
import { type Key, useState } from 'react';

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

const dataSource = Array.from({ length: 46 }, (_, i): DataType => ({
  address: `London, Park Lane no. ${i}`,
  age: 32,
  key: i,
  name: `Edward King ${i}`,
}));

export default () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const rowSelection: TableRowSelection<DataType> = {
    onChange: (newSelectedRowKeys) => {
      console.info('selectedRowKeys changed:', newSelectedRowKeys);
      setSelectedRowKeys(newSelectedRowKeys);
    },
    selectedRowKeys,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: 'odd',
        onSelect: (changeableRowKeys) => {
          setSelectedRowKeys(changeableRowKeys.filter((_, index) => index % 2 === 0));
        },
        text: 'Select Odd Row',
      },
      {
        key: 'even',
        onSelect: (changeableRowKeys) => {
          setSelectedRowKeys(changeableRowKeys.filter((_, index) => index % 2 !== 0));
        },
        text: 'Select Even Row',
      },
    ],
  };

  return <Table<DataType> columns={columns} dataSource={dataSource} rowSelection={rowSelection} />;
};
