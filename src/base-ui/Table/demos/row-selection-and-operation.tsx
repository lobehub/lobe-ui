import { Flexbox } from '@lobehub/ui';
import { Button, Table, type TableColumnsType, type TableRowSelection } from '@lobehub/ui/base-ui';
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
  const [loading, setLoading] = useState(false);

  const start = () => {
    setLoading(true);
    // Clear the selection once the (mock) request completes.
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const rowSelection: TableRowSelection<DataType> = {
    onChange: (newSelectedRowKeys) => {
      console.info('selectedRowKeys changed:', newSelectedRowKeys);
      setSelectedRowKeys(newSelectedRowKeys);
    },
    selectedRowKeys,
  };

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <Flexbox gap={16}>
      <Flexbox horizontal align="center" gap={16}>
        <Button disabled={!hasSelected} loading={loading} type="primary" onClick={start}>
          Reload
        </Button>
        {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
      </Flexbox>
      <Table<DataType> columns={columns} dataSource={dataSource} rowSelection={rowSelection} />
    </Flexbox>
  );
};
