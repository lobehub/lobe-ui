import { Flexbox } from '@lobehub/ui';
import {
  Button,
  Input,
  Popover,
  Table,
  type TableCellAttributes,
  type TableColumnType,
  Text,
} from '@lobehub/ui/base-ui';
import { createStaticStyles } from 'antd-style';
import { type Key, type ReactNode, type TdHTMLAttributes, useState } from 'react';

const classes = createStaticStyles(({ css, cssVar }) => ({
  editableRow: css`
    .editable-cell-value-wrap {
      cursor: pointer;

      min-height: 30px;
      padding-block: 4px;
      padding-inline: 12px 24px;
      border: 1px solid transparent;
      border-radius: ${cssVar.borderRadiusSM};

      transition: border-color ${cssVar.motionDurationFast};
    }

    &:hover .editable-cell-value-wrap {
      border-color: ${cssVar.colorBorder};
    }
  `,
}));

interface DataType {
  address: string;
  age: string;
  key: Key;
  name: string;
}

/** A small stand-in for antd `Popconfirm`: a click-triggered Popover with OK / Cancel. */
const Confirm = ({
  children,
  onConfirm,
  title,
}: {
  children: ReactNode;
  onConfirm: () => void;
  title: ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover
      open={open}
      trigger="click"
      content={
        <Flexbox gap={12}>
          <Text>{title}</Text>
          <Flexbox horizontal gap={8} justify="flex-end">
            <Button size="small" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              size="small"
              type="primary"
              onClick={() => {
                setOpen(false);
                onConfirm();
              }}
            >
              OK
            </Button>
          </Flexbox>
        </Flexbox>
      }
      onOpenChange={setOpen}
    >
      {children}
    </Popover>
  );
};

interface EditableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  dataIndex?: keyof DataType;
  editable?: boolean;
  handleSave?: (record: DataType) => void;
  record?: DataType;
  title?: string;
}

// `components.body.cell`: `onCell` hands it the record and what it needs to save.
const EditableCell = ({
  dataIndex,
  editable,
  handleSave,
  record,
  title,
  children,
  ...restProps
}: EditableCellProps) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState('');
  const [error, setError] = useState<string>();

  if (!editable || !record || !dataIndex) return <td {...restProps}>{children}</td>;

  const startEdit = () => {
    setValue(String(record[dataIndex]));
    setError(undefined);
    setEditing(true);
  };

  const save = () => {
    if (!value.trim()) {
      setError(`${title} is required.`);
      return;
    }
    setEditing(false);
    handleSave?.({ ...record, [dataIndex]: value });
  };

  return (
    <td {...restProps}>
      {editing ? (
        <Flexbox gap={4}>
          <Input
            autoFocus
            aria-invalid={!!error}
            value={value}
            variant="filled"
            onBlur={save}
            onPressEnter={save}
            onChange={(event) => {
              setValue(event.target.value);
              if (event.target.value.trim()) setError(undefined);
            }}
          />
          {error && (
            <Text fontSize={12} type="danger">
              {error}
            </Text>
          )}
        </Flexbox>
      ) : (
        <div className="editable-cell-value-wrap" onClick={startEdit}>
          {children}
        </div>
      )}
    </td>
  );
};

type EditableColumn = TableColumnType<DataType> & { dataIndex: string; editable?: boolean };

export default () => {
  const [dataSource, setDataSource] = useState<DataType[]>([
    { address: 'London, Park Lane no. 0', age: '32', key: '0', name: 'Edward King 0' },
    { address: 'London, Park Lane no. 1', age: '32', key: '1', name: 'Edward King 1' },
  ]);
  const [count, setCount] = useState(2);

  const handleDelete = (key: Key) => {
    setDataSource((prev) => prev.filter((item) => item.key !== key));
  };

  const handleAdd = () => {
    setDataSource((prev) => [
      ...prev,
      {
        address: `London, Park Lane no. ${count}`,
        age: '32',
        key: count,
        name: `Edward King ${count}`,
      },
    ]);
    setCount((prev) => prev + 1);
  };

  const handleSave = (row: DataType) => {
    setDataSource((prev) =>
      prev.map((item) => (item.key === row.key ? { ...item, ...row } : item)),
    );
  };

  const defaultColumns: EditableColumn[] = [
    { dataIndex: 'name', editable: true, title: 'name', width: '30%' },
    { dataIndex: 'age', title: 'age' },
    { dataIndex: 'address', title: 'address' },
    {
      dataIndex: 'operation',
      render: (_, record) =>
        dataSource.length > 0 ? (
          <Confirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
            <a href="#" onClick={(event) => event.preventDefault()}>
              Delete
            </a>
          </Confirm>
        ) : null,
      title: 'operation',
    },
  ];

  const columns = defaultColumns.map(({ editable, ...column }) => {
    if (!editable) return column;
    return {
      ...column,
      // Extra keys go to the custom cell as props, so cast past the `td` attribute type.
      onCell: (record: DataType) =>
        ({
          dataIndex: column.dataIndex,
          editable,
          handleSave,
          record,
          title: column.title,
        }) as TableCellAttributes,
    };
  });

  return (
    <Flexbox gap={16}>
      <div>
        <Button type="primary" onClick={handleAdd}>
          Add a row
        </Button>
      </div>
      <Table<DataType>
        bordered
        columns={columns}
        components={{ body: { cell: EditableCell } }}
        dataSource={dataSource}
        rowClassName={() => classes.editableRow}
      />
    </Flexbox>
  );
};
