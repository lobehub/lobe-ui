import { Flexbox } from '@lobehub/ui';
import { Table, Tag } from '@lobehub/ui/base-ui';

interface DataType {
  address: string;
  age: number;
  firstName: string;
  key: string;
  lastName: string;
  tags: string[];
}

const data: DataType[] = [
  {
    address: 'New York No. 1 Lake Park',
    age: 32,
    firstName: 'John',
    key: '1',
    lastName: 'Brown',
    tags: ['nice', 'developer'],
  },
  {
    address: 'London No. 1 Lake Park',
    age: 42,
    firstName: 'Jim',
    key: '2',
    lastName: 'Green',
    tags: ['loser'],
  },
  {
    address: 'Sydney No. 1 Lake Park',
    age: 32,
    firstName: 'Joe',
    key: '3',
    lastName: 'Black',
    tags: ['cool', 'teacher'],
  },
];

export default () => (
  <Table<DataType> dataSource={data} pagination={false}>
    <Table.ColumnGroup title="Name">
      <Table.Column dataIndex="firstName" key="firstName" title="First Name" />
      <Table.Column dataIndex="lastName" key="lastName" title="Last Name" />
    </Table.ColumnGroup>
    <Table.Column dataIndex="age" key="age" title="Age" />
    <Table.Column dataIndex="address" key="address" title="Address" />
    <Table.Column
      dataIndex="tags"
      key="tags"
      title="Tags"
      render={(tags: string[]) => (
        <Flexbox horizontal gap={4} wrap="wrap">
          {tags.map((tag) => (
            <Tag
              color={tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'}
              key={tag}
            >
              {tag.toUpperCase()}
            </Tag>
          ))}
        </Flexbox>
      )}
    />
    <Table.Column
      key="action"
      title="Action"
      render={(_, record: DataType) => (
        <Flexbox horizontal gap={16}>
          <a href="#">Invite {record.lastName}</a>
          <a href="#">Delete</a>
        </Flexbox>
      )}
    />
  </Table>
);
