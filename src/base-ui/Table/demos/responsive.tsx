import { Table, type TableColumnsType } from '@lobehub/ui/base-ui';

interface DataType {
  address: string;
  age: number;
  key: string;
  name: string;
}

// Resize the window: Age needs `md` (≥ 768px) and Address needs `lg` (≥ 992px).
const columns: TableColumnsType<DataType> = [
  {
    dataIndex: 'name',
    key: 'name',
    render: (text: string) => <a href="#">{text}</a>,
    title: 'Name (all screens)',
  },
  { dataIndex: 'age', key: 'age', responsive: ['md'], title: 'Age (medium screen or bigger)' },
  {
    dataIndex: 'address',
    key: 'address',
    responsive: ['lg'],
    title: 'Address (large screen or bigger)',
  },
];

const data: DataType[] = [
  { address: 'New York No. 1 Lake Park', age: 32, key: '1', name: 'John Brown' },
];

export default () => <Table columns={columns} dataSource={data} pagination={false} />;
