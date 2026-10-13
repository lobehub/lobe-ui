import { Flexbox } from '@lobehub/ui';
import { Table, type TableColumnsType, type TableVariant, Tooltip } from '@lobehub/ui/base-ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

interface DataType {
  address: string;
  age: number;
  city: string;
  key: string;
  name: string;
}

const data: DataType[] = [
  {
    address: 'New York No. 1 Lake Park, New York No. 1 Lake Park',
    city: 'New York',
    name: 'John Brown',
    age: 32,
    key: '1',
  },
  {
    address: 'London No. 2 Lake Park, London No. 2 Lake Park',
    city: 'London',
    name: 'Jim Green',
    age: 42,
    key: '2',
  },
  {
    address: 'Sydney No. 1 Lake Park, Sydney No. 1 Lake Park',
    city: 'Sydney',
    name: 'Joe Black',
    age: 32,
    key: '3',
  },
];

type TooltipMode = 'native title' | 'custom tooltip';

/**
 * `ellipsis` truncates cells and headers to one line (and switches to a fixed layout). The native
 * `title` can give way to a styled Tooltip (`ellipsis: { showTitle: false }` + `render`), and the
 * table-level `column` prop sets shared defaults (`align`, `ellipsis`, `width`) that each column
 * may override.
 */
export default () => {
  const store = useCreateStore();
  const control = useControls(
    {
      variant: { options: ['borderless', 'outlined', 'filled'], value: 'borderless' },
      columnDefaults: false,
      ellipsis: true,
      tooltip: { options: ['native title', 'custom tooltip'], value: 'native title' },
    },
    { store },
  ) as { variant: TableVariant; columnDefaults: boolean; ellipsis: boolean; tooltip: TooltipMode };

  const custom = control.tooltip === 'custom tooltip';
  const longColumn = (key: string, title: string) => ({
    dataIndex: 'address' as const,
    ...(!control.columnDefaults && {
      ellipsis: control.ellipsis && (custom ? { showTitle: false } : true),
    }),
    key,
    render: custom
      ? (address: string) => (
          <Tooltip placement="topLeft" title={address}>
            <span>{address}</span>
          </Tooltip>
        )
      : undefined,
    title,
  });

  const columns: TableColumnsType<DataType> = [
    {
      // With `columnDefaults`, Name opts out of the shared center alignment and ellipsis.
      ...(control.columnDefaults && { align: 'start' as const, ellipsis: false }),
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <a href="#">{text}</a>,
      title: 'Name',
    },
    { dataIndex: 'age', key: 'age', title: 'Age', width: 80 },
    {
      children: [
        { dataIndex: 'city', key: 'city', title: 'City' },
        longColumn('address 1', 'Address'),
      ],
      key: 'location',
      title: 'Location',
    },
    longColumn('address 2', 'Long Column Long Column Long Column'),
    longColumn('address 3', 'Long Column'),
  ];

  return (
    <StoryBook levaStore={store}>
      <Flexbox style={{ width: '100%' }}>
        <Table<DataType>
          columns={columns}
          dataSource={data}
          pagination={false}
          variant={control.variant}
          column={
            control.columnDefaults
              ? { align: 'center', ellipsis: control.ellipsis, width: 160 }
              : undefined
          }
        />
      </Flexbox>
    </StoryBook>
  );
};
