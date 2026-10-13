import { Flexbox } from '@lobehub/ui';
import {
  Divider,
  RadioGroup,
  Table,
  type TableColumnsType,
  type TableRowSelection,
} from '@lobehub/ui/base-ui';
import { type Key, useState } from 'react';

interface DataType {
  address: string;
  age: number;
  key: Key;
  name: string;
}

const columns: TableColumnsType<DataType> = [
  { dataIndex: 'name', render: (text: string) => <a>{text}</a>, title: 'Name' },
  { dataIndex: 'age', title: 'Age' },
  { dataIndex: 'address', title: 'Address' },
];

const data: DataType[] = [
  { address: 'New York No. 1 Lake Park', age: 32, key: '1', name: 'John Brown' },
  { address: 'London No. 1 Lake Park', age: 42, key: '2', name: 'Jim Green' },
  { address: 'Sydney No. 1 Lake Park', age: 32, key: '3', name: 'Joe Black' },
  { address: 'Sydney No. 1 Lake Park', age: 99, key: '4', name: 'Disabled User' },
];

const rowSelection: TableRowSelection<DataType> = {
  // Rows that cannot be selected.
  getCheckboxProps: (record) => ({
    disabled: record.name === 'Disabled User',
    name: record.name,
  }),
  onChange: (selectedRowKeys, selectedRows) => {
    console.info(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows:', selectedRows);
  },
};

export default () => {
  const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>('checkbox');

  return (
    <Flexbox>
      <RadioGroup
        value={selectionType}
        options={[
          { label: 'Checkbox', value: 'checkbox' },
          { label: 'radio', value: 'radio' },
        ]}
        onChange={(value) => setSelectionType(value as 'checkbox' | 'radio')}
      />
      <Divider />
      <Table<DataType>
        columns={columns}
        dataSource={data}
        rowSelection={{ type: selectionType, ...rowSelection }}
      />
    </Flexbox>
  );
};
