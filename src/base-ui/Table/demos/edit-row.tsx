import { Flexbox } from '@lobehub/ui';
import {
  Button,
  Input,
  InputNumber,
  Popover,
  Table,
  type TableCellAttributes,
  type TableColumnType,
  Text,
} from '@lobehub/ui/base-ui';
import { createStaticStyles } from 'antd-style';
import {
  createContext,
  type ReactNode,
  type TdHTMLAttributes,
  use,
  useMemo,
  useState,
} from 'react';

const classes = createStaticStyles(({ css }) => ({
  editableRow: css`
    position: relative;
    vertical-align: top;
  `,
}));

interface DataType {
  address: string;
  age: number;
  key: string;
  name: string;
}

type Draft = Partial<Record<'address' | 'age' | 'name', string | number | null>>;

const originData = Array.from({ length: 100 }, (_, i): DataType => ({
  address: `London Park no. ${i}`,
  age: 32,
  key: i.toString(),
  name: `Edward ${i}`,
}));

/** The row being edited: plays the part of the antd `Form` instance. */
interface EditContextValue {
  draft: Draft;
  errors: Partial<Record<keyof Draft, string>>;
  setField: (field: keyof Draft, value: string | number | null) => void;
}

const EditContext = createContext<EditContextValue>({ draft: {}, errors: {}, setField: () => {} });

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
  dataIndex?: keyof Draft;
  editing?: boolean;
  inputType?: 'number' | 'text';
}

// `components.body.cell`: swaps the cell content for an input while its row is edited.
const EditableCell = ({
  dataIndex,
  editing,
  inputType,
  children,
  ...restProps
}: EditableCellProps) => {
  const { draft, errors, setField } = use(EditContext);

  if (!editing || !dataIndex) return <td {...restProps}>{children}</td>;

  const error = errors[dataIndex];
  const value = draft[dataIndex];

  return (
    <td {...restProps}>
      <Flexbox gap={4}>
        {inputType === 'number' ? (
          <InputNumber
            aria-invalid={!!error}
            style={{ width: '100%' }}
            value={typeof value === 'number' ? value : null}
            onChange={(next) => setField(dataIndex, next)}
          />
        ) : (
          <Input
            aria-invalid={!!error}
            value={(value as string) ?? ''}
            onChange={(event) => setField(dataIndex, event.target.value)}
          />
        )}
        {error && (
          <Text fontSize={12} type="danger">
            {error}
          </Text>
        )}
      </Flexbox>
    </td>
  );
};

type EditableColumn = TableColumnType<DataType> & { dataIndex: string; editable?: boolean };

export default () => {
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState('');
  const [draft, setDraft] = useState<Draft>({});
  const [errors, setErrors] = useState<EditContextValue['errors']>({});

  const isEditing = (record: DataType) => record.key === editingKey;

  const edit = (record: DataType) => {
    setDraft({ address: record.address, age: record.age, name: record.name });
    setErrors({});
    setEditingKey(record.key);
  };

  const cancel = () => setEditingKey('');

  const save = (key: string) => {
    const nextErrors: EditContextValue['errors'] = {};
    for (const field of ['name', 'age', 'address'] as const) {
      const value = draft[field];
      if (value === null || value === undefined || String(value).trim() === '')
        nextErrors[field] = `Please Input ${field}!`;
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setData((prev) =>
      prev.map((item) => (item.key === key ? ({ ...item, ...draft } as DataType) : item)),
    );
    setEditingKey('');
  };

  const editContext = useMemo<EditContextValue>(
    () => ({
      draft,
      errors,
      setField: (field, value) => setDraft((prev) => ({ ...prev, [field]: value })),
    }),
    [draft, errors],
  );

  const columns: EditableColumn[] = [
    { dataIndex: 'name', editable: true, title: 'name', width: '25%' },
    { dataIndex: 'age', editable: true, title: 'age', width: '15%' },
    { dataIndex: 'address', editable: true, title: 'address', width: '40%' },
    {
      dataIndex: 'operation',
      render: (_, record) =>
        isEditing(record) ? (
          <Flexbox horizontal gap={8}>
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                save(record.key);
              }}
            >
              Save
            </a>
            <Confirm title="Sure to cancel?" onConfirm={cancel}>
              <a href="#" onClick={(event) => event.preventDefault()}>
                Cancel
              </a>
            </Confirm>
          </Flexbox>
        ) : (
          <Button
            disabled={editingKey !== ''}
            size="small"
            type="link"
            onClick={() => edit(record)}
          >
            Edit
          </Button>
        ),
      title: 'operation',
    },
  ];

  const mergedColumns = columns.map(({ editable, ...column }) => {
    if (!editable) return column;
    return {
      ...column,
      // Extra keys go to the custom cell as props, so cast past the `td` attribute type.
      onCell: (record: DataType) =>
        ({
          dataIndex: column.dataIndex,
          editing: isEditing(record),
          inputType: column.dataIndex === 'age' ? 'number' : 'text',
        }) as TableCellAttributes,
    };
  });

  return (
    <EditContext value={editContext}>
      <Table<DataType>
        bordered
        columns={mergedColumns}
        components={{ body: { cell: EditableCell } }}
        dataSource={data}
        pagination={{ onChange: cancel }}
        rowClassName={() => classes.editableRow}
      />
    </EditContext>
  );
};
