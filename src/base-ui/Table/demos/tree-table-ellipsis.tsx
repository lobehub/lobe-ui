import { Flexbox } from '@lobehub/ui';
import { Switch, Table, type TableColumnsType } from '@lobehub/ui/base-ui';
import { useState } from 'react';

interface DataType {
  address: string;
  age: number;
  children?: DataType[];
  key: number;
  name: string;
}

const data: DataType[] = [
  {
    address: 'New York No. 1 Lake Park',
    age: 60,
    children: [
      {
        address: 'New York No. 2 Lake Park',
        age: 42,
        key: 11,
        name: 'John Brown sr. John Brown sr. John Brown sr. John Brown sr. John Brown sr. John Brown sr.',
      },
      {
        address: 'New York No. 3 Lake Park',
        age: 30,
        children: [
          {
            address: 'New York No. 3 Lake Park',
            age: 16,
            key: 121,
            name: 'John Brown sr. John Brown sr. John Brown sr. John Brown sr. John Brown sr. John Brown sr.',
          },
        ],
        key: 12,
        name: 'John Brown sr. John Brown sr. John Brown sr. John Brown sr. John Brown sr. John Brown sr.',
      },
      {
        address: 'London No. 1 Lake Park',
        age: 72,
        children: [
          {
            address: 'London No. 2 Lake Park',
            age: 42,
            children: [
              {
                address: 'London No. 3 Lake Park',
                age: 25,
                key: 1311,
                name: 'Jim Green jr. Jim Green jr. Jim Green jr. Jim Green jr.',
              },
              {
                address: 'London No. 4 Lake Park',
                age: 18,
                key: 1312,
                name: 'Jimmy Green sr. Jimmy Green sr. Jimmy Green sr.',
              },
            ],
            key: 131,
            name: 'Jim Green. Jim Green. Jim Green. Jim Green. Jim Green. Jim Green.',
          },
        ],
        key: 13,
        name: 'Jim Green sr. Jim Green sr. Jim Green sr. Jim Green sr.',
      },
    ],
    key: 1,
    name: 'John Brown sr. John Brown sr. John Brown sr. John Brown sr. John Brown sr. John Brown sr.',
  },
  { address: 'Sydney No. 1 Lake Park', age: 32, key: 2, name: 'Joe Black' },
];

export default () => {
  const [fixed, setFixed] = useState(true);

  const columns: TableColumnsType<DataType> = [
    { dataIndex: 'name', ellipsis: true, fixed, key: 'name', title: 'Name', width: '30%' },
    { dataIndex: 'age', key: 'age', title: 'Age', width: '12%' },
    { dataIndex: 'address', key: 'address', title: 'Address' },
  ];

  return (
    <Flexbox gap={16}>
      <Flexbox horizontal align="center" as="label" gap={8}>
        Fixed first column
        <Switch checked={fixed} onChange={setFixed} />
      </Flexbox>
      <Table<DataType>
        columns={columns}
        dataSource={data}
        expandable={{ defaultExpandAllRows: true }}
        rowSelection={{ columnWidth: 100 }}
      />
    </Flexbox>
  );
};
