import { Table, type TableColumnsType } from '@lobehub/ui/base-ui';

interface DataType {
  address: string;
  age: number;
  key: string;
  name: string;
  phone: number;
  tel: string;
}

// In the fifth row, other columns are merged into the first column by setting its colSpan to 0.
const sharedOnCell = (_: DataType, index: number) => (index === 4 ? { colSpan: 0 } : {});

const columns: TableColumnsType<DataType> = [
  {
    dataIndex: 'key',
    onCell: (_, index) => ({ colSpan: index === 4 ? 6 : 1 }),
    rowScope: 'row',
    title: 'RowHead',
  },
  {
    dataIndex: 'name',
    onCell: (_, index) => ({ colSpan: index === 4 ? 0 : 1 }),
    render: (text: string) => <a href="#">{text}</a>,
    title: 'Name',
  },
  { dataIndex: 'age', onCell: sharedOnCell, title: 'Age' },
  {
    colSpan: 2,
    dataIndex: 'tel',
    onCell: (_, index) => {
      if (index === 2) return { rowSpan: 2 };
      // These two are merged into the cell above.
      if (index === 3) return { rowSpan: 0 };
      if (index === 4) return { colSpan: 0 };
      return {};
    },
    title: 'Home phone',
  },
  { colSpan: 0, dataIndex: 'phone', onCell: sharedOnCell, title: 'Phone' },
  { dataIndex: 'address', onCell: sharedOnCell, title: 'Address' },
];

const data: DataType[] = [
  {
    address: 'New York No. 1 Lake Park',
    age: 32,
    key: '1',
    name: 'John Brown',
    phone: 18_889_898_989,
    tel: '0571-22098909',
  },
  {
    address: 'London No. 1 Lake Park',
    age: 42,
    key: '2',
    name: 'Jim Green',
    phone: 18_889_898_888,
    tel: '0571-22098333',
  },
  {
    address: 'Sydney No. 1 Lake Park',
    age: 32,
    key: '3',
    name: 'Joe Black',
    phone: 18_900_010_002,
    tel: '0575-22098909',
  },
  {
    address: 'London No. 2 Lake Park',
    age: 18,
    key: '4',
    name: 'Jim Red',
    phone: 18_900_010_002,
    tel: '0575-22098909',
  },
  {
    address: 'Dublin No. 2 Lake Park',
    age: 18,
    key: '5',
    name: 'Jake White',
    phone: 18_900_010_002,
    tel: '0575-22098909',
  },
];

export default () => <Table bordered columns={columns} dataSource={data} pagination={false} />;
