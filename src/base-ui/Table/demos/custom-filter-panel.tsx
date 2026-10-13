import { Flexbox, Icon } from '@lobehub/ui';
import {
  Button,
  Input,
  Table,
  type TableColumn,
  type TableColumnType,
  type TableFilterDropdownProps,
} from '@lobehub/ui/base-ui';
import { Search } from 'lucide-react';
import { type ReactNode, useRef, useState } from 'react';

interface PersonRow {
  address: string;
  age: number;
  key: string;
  name: string;
}

type DataIndex = keyof PersonRow;

const data: PersonRow[] = [
  { address: 'New York No. 1 Lake Park', age: 32, key: '1', name: 'John Brown' },
  { address: 'London No. 1 Lake Park', age: 42, key: '2', name: 'Joe Black' },
  { address: 'Sydney No. 1 Lake Park', age: 32, key: '3', name: 'Jim Green' },
  { address: 'London No. 2 Lake Park', age: 32, key: '4', name: 'Jim Red' },
];

/** Wraps every case-insensitive match of `search` in a <mark>. */
const highlight = (text: string, search: string): ReactNode => {
  if (!search) return text;
  const parts = text.split(
    new RegExp(`(${search.replaceAll(/[$()*+.?[\\\]^{|}]/g, '\\$&')})`, 'gi'),
  );
  return parts.map((part, index) =>
    part.toLowerCase() === search.toLowerCase() ? (
      <mark key={index} style={{ background: '#ffc069', padding: 0 }}>
        {part}
      </mark>
    ) : (
      part
    ),
  );
};

export default () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState<DataIndex>();
  const searchInput = useRef<HTMLInputElement>(null);

  const handleSearch = (
    selectedKeys: TableFilterDropdownProps['selectedKeys'],
    confirm: TableFilterDropdownProps['confirm'],
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(String(selectedKeys[0] ?? ''));
    setSearchedColumn(dataIndex);
  };

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<PersonRow> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <Flexbox gap={8} padding={8} onKeyDown={(event) => event.stopPropagation()}>
        <Input
          placeholder={`Search ${dataIndex}`}
          ref={searchInput}
          value={String(selectedKeys[0] ?? '')}
          onChange={(event) => setSelectedKeys(event.target.value ? [event.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
        />
        <Flexbox horizontal gap={8}>
          <Button
            icon={Search}
            size="small"
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          >
            Search
          </Button>
          <Button
            size="small"
            onClick={() => {
              clearFilters?.();
              setSearchText('');
            }}
          >
            Reset
          </Button>
          <Button
            size="small"
            type="link"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(String(selectedKeys[0] ?? ''));
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button size="small" type="link" onClick={() => close()}>
            close
          </Button>
        </Flexbox>
      </Flexbox>
    ),
    filterDropdownProps: {
      onOpenChange: (open) => {
        if (open) setTimeout(() => searchInput.current?.select(), 100);
      },
    },
    filterIcon: (filtered) => (
      <Icon color={filtered ? '#1677ff' : undefined} icon={Search} size={12} />
    ),
    onFilter: (value, record) =>
      String(record[dataIndex]).toLowerCase().includes(String(value).toLowerCase()),
    render: (text) =>
      searchedColumn === dataIndex ? highlight(String(text ?? ''), searchText) : text,
  });

  const columns: TableColumn<PersonRow>[] = [
    {
      dataIndex: 'name',
      key: 'name',
      title: 'Name',
      width: '30%',
      ...getColumnSearchProps('name'),
    },
    { dataIndex: 'age', key: 'age', title: 'Age', width: '20%', ...getColumnSearchProps('age') },
    {
      dataIndex: 'address',
      key: 'address',
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => a.address.length - b.address.length,
      title: 'Address',
      ...getColumnSearchProps('address'),
    },
  ];

  return <Table columns={columns} dataSource={data} pagination={false} />;
};
