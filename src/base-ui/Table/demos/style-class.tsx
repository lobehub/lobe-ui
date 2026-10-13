import { Flexbox } from '@lobehub/ui';
import {
  Table,
  type TableClassNames,
  type TableColumnsType,
  type TableProps,
  type TableStyles,
  Text,
} from '@lobehub/ui/base-ui';
import { createStaticStyles } from 'antd-style';

interface DataType {
  age: number;
  key: string;
  name: string;
  role: string;
}

const columns: TableColumnsType<DataType> = [
  { dataIndex: 'name', key: 'name', title: 'Name' },
  { dataIndex: 'age', key: 'age', title: 'Age' },
  { dataIndex: 'role', key: 'role', title: 'Role' },
];

const data: DataType[] = Array.from({ length: 8 }, (_, index) => ({
  age: 24 + index,
  key: String(index),
  name: ['Lily', 'Lucas', 'Mia', 'Noah', 'Olivia', 'Ethan', 'Ava', 'Leo'][index],
  role: ['Designer', 'Engineer', 'Researcher', 'PM'][index % 4],
}));

const classes = createStaticStyles(({ css, cssVar }) => ({
  bodyRow: css`
    &&&:nth-child(even) > * {
      background: ${cssVar.colorFillQuaternary};
    }
  `,
  // A tripled class outweighs the table's own cell rules (`.table .thead > tr > th`).
  headerCell: css`
    &&& {
      font-weight: 700;
      color: ${cssVar.colorPrimary};
    }
  `,
  pageItem: css`
    border-radius: 50%;
  `,
  root: css`
    padding: 8px;
    border: 1px dashed ${cssVar.colorPrimaryBorder};
    border-radius: 12px;
  `,
  section: css`
    overflow: hidden;
    border-radius: 8px;
  `,
  title: css`
    font-weight: 600;
    background: ${cssVar.colorPrimaryBg};
  `,
}));

// Object form: antd 6 Semantic DOM keys, nested for header / body / pagination.
const classNames: TableClassNames = {
  body: { row: classes.bodyRow },
  header: { cell: classes.headerCell },
  pagination: { item: classes.pageItem },
  root: classes.root,
  section: classes.section,
  title: classes.title,
};

const styles: TableStyles = {
  footer: { fontStyle: 'italic' },
  pagination: { root: { marginBlockEnd: 0 } },
};

// Function form: computed from the table's own props.
const stylesFn = ({ props }: { props: TableProps<DataType> }): TableStyles => ({
  body: { cell: props.size === 'small' ? { fontSize: 12 } : undefined },
  header: {
    cell: {
      background: props.variant === 'outlined' ? 'var(--ant-color-fill-tertiary)' : undefined,
    },
  },
  root: { boxShadow: props.variant === 'outlined' ? '0 2px 8px rgba(0, 0, 0, 0.06)' : undefined },
});

export default () => (
  <Flexbox gap={24}>
    <Flexbox gap={8}>
      <Text type="secondary">Object classNames / styles</Text>
      <Table<DataType>
        classNames={classNames}
        columns={columns}
        dataSource={data}
        footer={() => 'Footer'}
        pagination={{ pageSize: 3 }}
        styles={styles}
        title={() => 'Team members'}
      />
    </Flexbox>
    <Flexbox gap={8}>
      <Text type="secondary">Function styles (outlined, small)</Text>
      <Table<DataType>
        classNames={() => ({ header: { cell: classes.headerCell } })}
        columns={columns}
        dataSource={data}
        pagination={false}
        size="small"
        styles={stylesFn}
        variant="outlined"
      />
    </Flexbox>
    <Flexbox gap={8}>
      <Text type="secondary">Legacy flat keys (wrapper / header / body / row / cell)</Text>
      <Table<DataType>
        classNames={{ header: classes.headerCell, row: classes.bodyRow, wrapper: classes.section }}
        columns={columns}
        dataSource={data.slice(0, 4)}
        pagination={false}
        styles={{ body: { fontStyle: 'italic' }, cell: { paddingBlock: 6 } }}
      />
    </Flexbox>
    <Flexbox gap={8}>
      <Text type="secondary">Virtual list</Text>
      <Table<DataType>
        virtual
        classNames={{ body: { row: classes.bodyRow }, header: { cell: classes.headerCell } }}
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ y: 160 }}
        styles={{ root: { maxWidth: 480 } }}
      />
    </Flexbox>
  </Flexbox>
);
