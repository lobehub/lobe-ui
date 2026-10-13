import {
  ActionIcon,
  Table,
  type TableColumnsType,
  type TableSize,
  type TableVariant,
} from '@lobehub/ui/base-ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { Ellipsis } from 'lucide-react';

interface DataType {
  address: string;
  age: number;
  key: string;
  name: string;
}

type Pinning = 'adjacent' | 'stacked';

// `adjacent`: Full Name + Age pinned at the start, Action at the end.
// `stacked`: pinned columns need not be adjacent; each one sticks after the pinned columns before it.
const columnsOf = (pinning: Pinning): TableColumnsType<DataType> => {
  const stacked = pinning === 'stacked';
  const pinnedStart = new Set(stacked ? ['1', '3'] : []);
  const pinnedEnd = new Set(stacked ? ['6', '8'] : []);
  return [
    { dataIndex: 'name', fixed: 'start', key: 'name', title: 'Full Name', width: 120 },
    {
      dataIndex: 'age',
      fixed: stacked ? undefined : ('start' as const),
      key: 'age',
      title: 'Age',
      width: 80,
    },
    ...Array.from({ length: 8 }, (_, index) => {
      const key = String(index + 1);
      return {
        dataIndex: 'address' as const,
        fixed: pinnedStart.has(key)
          ? ('start' as const)
          : pinnedEnd.has(key)
            ? ('end' as const)
            : undefined,
        key,
        title: `Column ${key}`,
        width: 150,
      };
    }),
    {
      align: 'end',
      fixed: 'end',
      key: 'operation',
      render: () => <ActionIcon icon={Ellipsis} size="small" title="Actions" variant="filled" />,
      title: 'Action',
      width: 64,
    },
  ];
};

const getData = (length: number): DataType[] =>
  Array.from({ length }, (_, index) => ({
    address: `London Park no. ${index}`,
    age: 32,
    key: String(index),
    name: `Edward King ${index}`,
  }));

/**
 * Fixed columns, stacked (non-adjacent) fixed columns and fixed columns + header in one place.
 */
export default () => {
  const store = useCreateStore();
  const control = useControls(
    {
      variant: { options: ['borderless', 'outlined', 'filled'], value: 'outlined' },
      pinning: { options: ['adjacent', 'stacked'], value: 'adjacent' },
      rows: { max: 50, min: 2, step: 1, value: 10 },
      // 0 = no `scroll.y`; set it to fix the header as well.
      scrollY: { max: 500, min: 0, step: 20, value: 0 },
      size: { options: ['large', 'medium', 'small'], value: 'medium' },
    },
    { store },
  ) as { variant: TableVariant; pinning: Pinning; rows: number; scrollY: number; size: TableSize };

  return (
    <StoryBook levaStore={store}>
      <div style={{ width: '100%' }}>
        <Table<DataType>
          columns={columnsOf(control.pinning)}
          dataSource={getData(control.rows)}
          pagination={false}
          scroll={{ x: 1500, y: control.scrollY || undefined }}
          size={control.size}
          variant={control.variant}
        />
      </div>
    </StoryBook>
  );
};
