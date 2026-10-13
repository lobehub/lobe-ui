import { Flexbox } from '@lobehub/ui';
import { ActionIcon, Table, type TableColumnsType, Tag } from '@lobehub/ui/base-ui';
import { Trash2, UserPlus } from 'lucide-react';

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
    align: 'end',
    render: () => (
      <Flexbox horizontal gap={4} justify="flex-end">
        <ActionIcon icon={UserPlus} size="small" title="Invite" variant="filled" />
        <ActionIcon danger icon={Trash2} size="small" title="Delete" variant="filled" />
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
