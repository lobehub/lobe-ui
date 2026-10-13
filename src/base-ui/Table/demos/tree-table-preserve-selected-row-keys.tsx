import { Flexbox } from '@lobehub/ui';
import { Switch, Table, type TableColumnsType, type TableRowSelection } from '@lobehub/ui/base-ui';
import { useState } from 'react';

interface DataType {
  address: string;
  age: number;
  children?: DataType[];
  key: string;
  name: string;
}

const columns: TableColumnsType<DataType> = [
  { dataIndex: 'name', key: 'name', title: 'Name' },
  { dataIndex: 'age', key: 'age', title: 'Age', width: '12%' },
  { dataIndex: 'address', key: 'address', title: 'Address', width: '30%' },
];

const dataSource = Array.from({ length: 15 }, (_, i): DataType => ({
  address: `London Park no. ${i}`,
  age: 32,
  children: [
    { address: 'New York No. 3 Lake Park', age: 16, key: `subKey${i}1`, name: 'Brown' },
    { address: 'New York No. 3 Lake Park', age: 16, key: `subKey${i}2`, name: 'Jimmy' },
  ],
  key: `key${i}`,
  name: `Edward ${i}`,
}));

const rowSelection: TableRowSelection<DataType> = {
  onChange: (selectedRowKeys, selectedRows, info) => {
    console.info(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows:', selectedRows, info);
  },
  onSelect: (record, selected, selectedRows) => {
    console.info(record, selected, selectedRows);
  },
};

export default () => {
  const [checkStrictly, setCheckStrictly] = useState(false);
  const [preserveSelectedRowKeys, setPreserveSelectedRowKeys] = useState(true);

  return (
    <Flexbox gap={16}>
      <Flexbox horizontal align="center" gap={8}>
        CheckStrictly: <Switch checked={checkStrictly} onChange={setCheckStrictly} />
        preserveSelectedRowKeys:
        <Switch checked={preserveSelectedRowKeys} onChange={setPreserveSelectedRowKeys} />
      </Flexbox>
      <Table<DataType>
        columns={columns}
        dataSource={dataSource}
        pagination={{ defaultPageSize: 5 }}
        rowSelection={{ ...rowSelection, checkStrictly, preserveSelectedRowKeys }}
      />
    </Flexbox>
  );
};
