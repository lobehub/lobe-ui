import { Flexbox } from '@lobehub/ui';
import { Button, Table, type TableColumnsType, type TableRowSelection } from '@lobehub/ui/base-ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { type Key, useState } from 'react';

interface DataType {
  address: string;
  age: number;
  key: Key;
  name: string;
}

const columns: TableColumnsType<DataType> = [
  { dataIndex: 'name', render: (text: string) => <a>{text}</a>, title: 'Name' },
  { dataIndex: 'age', title: 'Age' },
  { dataIndex: 'address', title: 'Address' },
];

const dataSource = Array.from({ length: 46 }, (_, i): DataType => ({
  address: `London, Park Lane no. ${i}`,
  age: 32 + (i % 10),
  key: i,
  name: i === 1 ? 'Disabled User' : `Edward King ${i}`,
}));

type Selections = 'none' | 'presets' | 'custom';

/**
 * Checkbox / radio selection, disabled rows (`getCheckboxProps`), the `selections` dropdown
 * (presets or custom items), a controlled `selectedRowKeys` with a bulk operation, and
 * `preserveSelectedRowKeys` / `fixed` / `columnWidth`.
 */
export default () => {
  const store = useCreateStore();
  const control = useControls(
    {
      columnWidth: { max: 120, min: 32, step: 4, value: 48 },
      disableRow: true,
      fixed: false,
      hideSelectAll: false,
      selections: { options: ['none', 'presets', 'custom'], value: 'custom' },
      type: { options: ['checkbox', 'radio'], value: 'checkbox' },
    },
    { store },
  ) as {
    columnWidth: number;
    disableRow: boolean;
    fixed: boolean;
    hideSelectAll: boolean;
    selections: Selections;
    type: 'checkbox' | 'radio';
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [loading, setLoading] = useState(false);

  const reload = () => {
    setLoading(true);
    // Clear the selection once the (mock) request completes.
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const selections: TableRowSelection<DataType>['selections'] =
    control.selections === 'none'
      ? undefined
      : control.selections === 'presets'
        ? true
        : [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
            {
              key: 'odd',
              onSelect: (keys) => setSelectedRowKeys(keys.filter((_, index) => index % 2 === 0)),
              text: 'Select Odd Row',
            },
            {
              key: 'even',
              onSelect: (keys) => setSelectedRowKeys(keys.filter((_, index) => index % 2 !== 0)),
              text: 'Select Even Row',
            },
          ];

  const rowSelection: TableRowSelection<DataType> = {
    columnWidth: control.columnWidth,
    fixed: control.fixed,
    // Rows that cannot be selected.
    getCheckboxProps: (record) => ({
      disabled: control.disableRow && record.name === 'Disabled User',
      name: record.name,
    }),
    hideSelectAll: control.hideSelectAll,
    onChange: (keys, rows, info) => {
      console.info('selection', keys, rows, info.type);
      setSelectedRowKeys(keys);
    },
    selectedRowKeys,
    selections,
    type: control.type,
  };

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <StoryBook levaStore={store}>
      <Flexbox gap={16} style={{ width: '100%' }}>
        <Flexbox horizontal align="center" gap={16}>
          <Button disabled={!hasSelected} loading={loading} type="primary" onClick={reload}>
            Reload
          </Button>
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
        </Flexbox>
        <Table<DataType> columns={columns} dataSource={dataSource} rowSelection={rowSelection} />
      </Flexbox>
    </StoryBook>
  );
};
