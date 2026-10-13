import { Table, type TableColumnsType } from '@lobehub/ui/base-ui';

interface DataType {
  age: number;
  building: string;
  companyAddress: string;
  companyName: string;
  gender: string;
  key: string;
  name: string;
  number: number;
  street: string;
}

const columns: TableColumnsType<DataType> = [
  {
    dataIndex: 'name',
    filters: [
      { text: 'Joe', value: 'Joe' },
      { text: 'John', value: 'John' },
    ],
    fixed: 'start',
    key: 'name',
    onFilter: (value, record) => record.name.startsWith(String(value)),
    title: 'Name',
    width: 120,
  },
  {
    children: [
      {
        dataIndex: 'age',
        key: 'age',
        sorter: (a, b) => a.age - b.age,
        title: 'Age',
        width: 110,
      },
      {
        children: [
          { dataIndex: 'street', key: 'street', title: 'Street', width: 150 },
          {
            children: [
              { dataIndex: 'building', key: 'building', title: 'Building', width: 100 },
              { dataIndex: 'number', key: 'number', title: 'Door No.', width: 100 },
            ],
            title: 'Block',
          },
        ],
        title: 'Address',
      },
    ],
    title: 'Other',
  },
  {
    children: [
      { dataIndex: 'companyAddress', key: 'companyAddress', title: 'Company Address', width: 200 },
      { dataIndex: 'companyName', key: 'companyName', title: 'Company Name' },
    ],
    title: 'Company',
  },
  { dataIndex: 'gender', fixed: 'end', key: 'gender', title: 'Gender', width: 80 },
];

const data: DataType[] = Array.from({ length: 100 }, (_, index) => ({
  age: index + 1,
  building: 'C',
  companyAddress: 'Lake Street 42',
  companyName: 'SoftLake Co',
  gender: 'M',
  key: String(index),
  name: index % 2 === 0 ? 'John Brown' : 'Joe Black',
  number: 2035,
  street: 'Lake Park',
}));

export default () => (
  <Table
    bordered
    columns={columns}
    dataSource={data}
    scroll={{ x: 'calc(700px + 50%)', y: 240 }}
    size="small"
  />
);
