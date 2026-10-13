import { Flexbox } from '@lobehub/ui';
import {
  ActionIcon,
  Badge,
  Table,
  type TableColumnsType,
  type TableSize,
} from '@lobehub/ui/base-ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { CircleStop, Trash2 } from 'lucide-react';

interface DataType {
  address: string;
  age: number;
  description: string;
  key: number;
  name: string;
}

interface BuildRow {
  date: string;
  key: string;
  name: string;
}

const data: DataType[] = [
  { address: 'New York No. 1 Lake Park', age: 32, key: 1, name: 'John Brown' },
  { address: 'London No. 1 Lake Park', age: 42, key: 2, name: 'Jim Green' },
  { address: 'Jiangsu No. 1 Lake Park', age: 29, key: 3, name: 'Not Expandable' },
  { address: 'Sydney No. 1 Lake Park', age: 32, key: 4, name: 'Joe Black' },
].map((row) => ({
  ...row,
  description: `My name is ${row.name}, I am ${row.age} years old, living in ${row.address}.`,
}));

const nestedColumns: TableColumnsType<BuildRow> = [
  { dataIndex: 'date', title: 'Date' },
  { dataIndex: 'name', title: 'Name' },
  { key: 'state', render: () => <Badge status="success" text="Finished" />, title: 'Status' },
  {
    align: 'end',
    key: 'operation',
    render: () => <ActionIcon icon={CircleStop} size="small" title="Stop" variant="filled" />,
    title: 'Action',
  },
];

const nestedData = Array.from({ length: 3 }, (_, i): BuildRow => ({
  date: '2026-10-13 23:12:00',
  key: String(i),
  name: `Build #${i + 1}`,
}));

type ColumnPosition = 'start' | 'after name' | 'hidden';

/**
 * Expandable rows: text or a nested Table as content, `rowExpandable`, `expandRowByClick`,
 * where the expand column goes (`Table.EXPAND_COLUMN`, or `showExpandColumn: false`), and the
 * selection column placed with `Table.SELECTION_COLUMN`.
 */
export default () => {
  const store = useCreateStore();
  const control = useControls(
    {
      columnPosition: { options: ['start', 'after name', 'hidden'], value: 'start' },
      content: { options: ['text', 'nested table'], value: 'text' },
      defaultExpandFirst: false,
      expandRowByClick: false,
      rowExpandable: true,
      selection: false,
      size: { options: ['large', 'medium', 'small'], value: 'medium' },
    },
    { store },
  ) as {
    columnPosition: ColumnPosition;
    content: 'text' | 'nested table';
    defaultExpandFirst: boolean;
    expandRowByClick: boolean;
    rowExpandable: boolean;
    selection: boolean;
    size: TableSize;
  };

  const columns: TableColumnsType<DataType> = [
    { dataIndex: 'name', key: 'name', title: 'Name' },
    ...(control.columnPosition === 'after name' ? [Table.EXPAND_COLUMN] : []),
    { dataIndex: 'age', key: 'age', title: 'Age' },
    // `Table.SELECTION_COLUMN` moves the checkboxes after Age.
    ...(control.selection ? [Table.SELECTION_COLUMN] : []),
    { dataIndex: 'address', key: 'address', title: 'Address' },
    {
      align: 'end',
      key: 'x',
      render: () => (
        <ActionIcon danger icon={Trash2} size="small" title="Delete" variant="filled" />
      ),
      title: 'Action',
    },
  ];

  return (
    <StoryBook levaStore={store}>
      <Flexbox style={{ width: '100%' }}>
        <Table<DataType>
          columns={columns}
          dataSource={data}
          key={String(control.defaultExpandFirst)}
          pagination={false}
          rowSelection={control.selection ? {} : undefined}
          size={control.size}
          expandable={{
            defaultExpandedRowKeys: control.defaultExpandFirst ? [1] : undefined,
            expandRowByClick: control.expandRowByClick,
            expandedRowRender: (record) =>
              control.content === 'text' ? (
                <p style={{ margin: 0 }}>{record.description}</p>
              ) : (
                <Table<BuildRow>
                  columns={nestedColumns}
                  dataSource={nestedData}
                  pagination={false}
                  size={control.size}
                />
              ),
            rowExpandable: control.rowExpandable
              ? (record) => record.name !== 'Not Expandable'
              : undefined,
            showExpandColumn: control.columnPosition !== 'hidden',
          }}
        />
      </Flexbox>
    </StoryBook>
  );
};
