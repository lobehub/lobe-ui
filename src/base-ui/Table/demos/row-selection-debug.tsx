import { Flexbox } from '@lobehub/ui';
import {
  InputNumber,
  Table,
  type TableColumnsType,
  type TableRowSelection,
} from '@lobehub/ui/base-ui';
import { type Key, useRef, useState } from 'react';

/** Counts its own renders: with `shouldCellUpdate`, selecting a row must not re-render cells. */
const RenderTimes = () => {
  const timesRef = useRef(0);
  timesRef.current += 1;
  return <span> {timesRef.current}</span>;
};

interface DataType {
  address: string;
  age: number;
  key: Key;
  name: string;
}

const shouldCellUpdate = (record: DataType, prevRecord: DataType) => record !== prevRecord;

const columns: TableColumnsType<DataType> = [
  { dataIndex: 'name', shouldCellUpdate, title: 'Name' },
  { dataIndex: 'age', shouldCellUpdate, title: 'Age' },
  {
    dataIndex: 'address',
    render: (address: string) => (
      <>
        {address}
        <RenderTimes />
      </>
    ),
    shouldCellUpdate,
    title: 'Address',
  },
];

const genData = (length: number) =>
  Array.from({ length }, (_, i): DataType => ({
    address: `London, Park Lane no. ${i}`,
    age: 32,
    key: i,
    name: `Edward King ${i}`,
  }));

export default () => {
  const [data, setData] = useState<DataType[]>(() => genData(50));
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const rowSelection: TableRowSelection<DataType> = {
    onChange: (newSelectedRowKeys) => {
      console.info('selectedRowKeys changed:', newSelectedRowKeys);
      setSelectedRowKeys(newSelectedRowKeys);
    },
    selectedRowKeys,
  };

  return (
    <Flexbox gap={16}>
      <InputNumber
        min={0}
        style={{ width: 120 }}
        value={data.length}
        onChange={(count) => setData(genData(Number(count) || 0))}
      />
      <Table<DataType>
        columns={columns}
        dataSource={data}
        pagination={false}
        rowSelection={rowSelection}
        scroll={{ y: 400 }}
      />
    </Flexbox>
  );
};
