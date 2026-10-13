import { Flexbox } from '@lobehub/ui';
import { Table, type TableColumnsType, Tag } from '@lobehub/ui/base-ui';

interface DataType {
  address: string;
  age: number;
  key: string;
  name: string;
  tags: string[];
}

const tagColor = (tag: string) => {
  if (tag === 'kawaii') return 'volcano';
  return tag.length > 5 ? 'geekblue' : 'green';
};

const columns: TableColumnsType<DataType> = [
  {
    dataIndex: 'name',
    key: 'name',
    render: (text: string) => <a href="#">{text}</a>,
    title: 'Name',
  },
  { dataIndex: 'age', key: 'age', title: 'Age' },
  { dataIndex: 'address', key: 'address', title: 'Address' },
  {
    dataIndex: 'tags',
    key: 'tags',
    render: (_, { tags }) => (
      <Flexbox horizontal align="center" gap={8} wrap="wrap">
        {tags.map((tag) => (
          <Tag color={tagColor(tag)} key={tag}>
            {tag.toUpperCase()}
          </Tag>
        ))}
      </Flexbox>
    ),
    title: 'Tags',
  },
  {
    key: 'action',
    render: (_, record) => (
      <Flexbox horizontal gap={16}>
        <a href="#">Invite {record.name}</a>
        <a href="#">Delete</a>
      </Flexbox>
    ),
    title: 'Action',
  },
];

const data: DataType[] = [
  {
    address: 'New York No. 1 Lake Park',
    age: 32,
    key: '1',
    name: 'John Brown',
    tags: ['nice', 'developer'],
  },
  { address: 'London No. 1 Lake Park', age: 42, key: '2', name: 'Jim Green', tags: ['kawaii'] },
  {
    address: 'Sydney No. 1 Lake Park',
    age: 32,
    key: '3',
    name: 'Joe Black',
    tags: ['cool', 'teacher'],
  },
];

export default () => <Table<DataType> columns={columns} dataSource={data} />;
