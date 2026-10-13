import { Flexbox } from '@lobehub/ui';
import { CheckboxGroup, Divider, Table, type TableColumnsType } from '@lobehub/ui/base-ui';
import { useState } from 'react';

interface DataType {
  address: string;
  age: number;
  key: string;
  name: string;
}

const columns: TableColumnsType<DataType> = [
  { dataIndex: 'name', key: 'name', title: 'Name' },
  { dataIndex: 'age', key: 'age', title: 'Age' },
  { dataIndex: 'address', key: 'address', title: 'Address' },
  { dataIndex: 'address', key: 'column4', title: 'Column 4' },
  { dataIndex: 'address', key: 'column5', title: 'Column 5' },
  { key: 'action', render: () => <a href="#">action</a>, title: 'Action' },
];

const options = columns.map(({ key, title }) => ({ label: title as string, value: key as string }));

const data: DataType[] = [
  { address: 'New York No. 1 Lake Park', age: 32, key: '1', name: 'John Brown' },
  { address: 'London No. 1 Lake Park', age: 42, key: '2', name: 'Jim Green' },
  { address: 'Sydney No. 1 Lake Park', age: 32, key: '3', name: 'Joe Black' },
];

export default () => {
  const [checked, setChecked] = useState(options.map((option) => option.value));

  // `hidden` keeps the column definition (and its sort / filter state) but skips rendering it.
  const visibleColumns = columns.map((column) => ({
    ...column,
    hidden: !checked.includes(column.key as string),
  }));

  return (
    <Flexbox gap={16}>
      <CheckboxGroup horizontal gap={16} options={options} value={checked} onChange={setChecked} />
      <Divider />
      <Table columns={visibleColumns} dataSource={data} pagination={false} />
    </Flexbox>
  );
};
