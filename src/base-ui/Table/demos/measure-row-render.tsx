import { Flexbox, Icon } from '@lobehub/ui';
import {
  Button,
  Input,
  Table,
  type TableColumnsType,
  type TableColumnType,
} from '@lobehub/ui/base-ui';
import { Search } from 'lucide-react';
import { createContext, type ReactNode, use } from 'react';

interface DataType {
  address: string;
  age: number;
  key: string;
  name: string;
}

const data: DataType[] = Array.from({ length: 30 }, (_, index) => ({
  address: ['New York No. 1 Lake Park', 'London No. 1 Lake Park', 'Sydney No. 1 Lake Park'][
    index % 3
  ],
  age: 30 + (index % 15),
  key: String(index),
  name: ['John Brown', 'Joe Black', 'Jim Green', 'Jim Red'][index % 4] + ` ${index}`,
}));

/** `true` inside rc-table's hidden measure row (set through `measureRowRender`). */
const MeasuringContext = createContext(false);

/** A rich header that only renders its decoration in the visible header, not the measure row. */
const HeaderTitle = ({ children, hint }: { children: ReactNode; hint: string }) => {
  const measuring = use(MeasuringContext);
  if (measuring) return <span>{children}</span>;
  return (
    <span title={hint}>
      {children}
      <sup style={{ marginInlineStart: 4, opacity: 0.45 }}>?</sup>
    </span>
  );
};

const searchProps = (dataIndex: keyof DataType): TableColumnType<DataType> => ({
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
    <Flexbox gap={8} padding={8} onKeyDown={(event) => event.stopPropagation()}>
      <Input
        placeholder={`Search ${dataIndex}`}
        value={String(selectedKeys[0] ?? '')}
        onChange={(event) => setSelectedKeys(event.target.value ? [event.target.value] : [])}
        onPressEnter={() => confirm()}
      />
      <Flexbox horizontal gap={8}>
        <Button icon={Search} size="small" type="primary" onClick={() => confirm()}>
          Search
        </Button>
        <Button size="small" onClick={() => clearFilters?.({ confirm: true })}>
          Reset
        </Button>
      </Flexbox>
    </Flexbox>
  ),
  filterIcon: (filtered) => <Icon color={filtered ? '#1677ff' : undefined} icon={Search} />,
  onFilter: (value, record) =>
    String(record[dataIndex]).toLowerCase().includes(String(value).toLowerCase()),
});

const columns: TableColumnsType<DataType> = [
  {
    dataIndex: 'name',
    key: 'name',
    title: <HeaderTitle hint="Full name">Name</HeaderTitle>,
    width: '30%',
    ...searchProps('name'),
  },
  {
    dataIndex: 'age',
    key: 'age',
    sorter: (a, b) => a.age - b.age,
    title: <HeaderTitle hint="Years">Age</HeaderTitle>,
    width: '20%',
  },
  {
    dataIndex: 'address',
    key: 'address',
    title: <HeaderTitle hint="Mailing address">Address</HeaderTitle>,
    ...searchProps('address'),
  },
];

// Header titles skip their decoration in the hidden measure row, which keeps sticky-header
// measuring cheap and never duplicates interactive content (antd#54906).
export default () => (
  <Table<DataType>
    bordered
    sticky
    columns={columns}
    dataSource={data}
    pagination={false}
    scroll={{ x: 'max-content' }}
    measureRowRender={(measureRow) => (
      <MeasuringContext value={true}>{measureRow}</MeasuringContext>
    )}
  />
);
