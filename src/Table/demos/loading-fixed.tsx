import { ActionIcon, Table, type TableColumnsType } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { Ellipsis } from 'lucide-react';

interface Row {
  id: string;
  name: string;
  status: string;
  target: string;
}

const columns: TableColumnsType<Row> = [
  { dataIndex: 'id', fixed: 'start', key: 'id', title: 'ID', width: 120 },
  { dataIndex: 'name', key: 'name', title: 'Name', width: 220 },
  ...Array.from({ length: 5 }, (_, index) => ({
    dataIndex: 'target' as const,
    key: `target-${index}`,
    title: `Target ${index + 1}`,
    width: 200,
  })),
  { dataIndex: 'status', key: 'status', title: 'Status', width: 120 },
  {
    align: 'end',
    fixed: 'end',
    key: 'action',
    render: () => <ActionIcon icon={Ellipsis} size="small" title="Actions" variant="filled" />,
    title: 'Action',
    width: 80,
  },
];

const data: Row[] = Array.from({ length: 6 }, (_, index) => ({
  id: `router-${index + 1}`,
  name: `Channel router ${index + 1}`,
  status: index % 2 ? 'Disabled' : 'Enabled',
  target: `provider-${index}/model-${index}`,
}));

/**
 * Loading with fixed start / end columns and horizontal scroll. The frosted backdrop of a fixed
 * side only shows while content is scrolled under it and never over the loading skeleton, so
 * row dividers run through the fixed columns. The spinner sits in a small outlined `Block`.
 */
export default () => {
  const store = useCreateStore();
  const { loading, withData } = useControls({ loading: true, withData: false }, { store }) as {
    loading: boolean;
    withData: boolean;
  };

  return (
    <StoryBook levaStore={store}>
      <div style={{ width: '100%' }}>
        <Table<Row>
          columns={columns}
          dataSource={withData ? data : []}
          loading={loading}
          pagination={false}
          rowKey="id"
          scroll={{ x: 1600 }}
        />
      </div>
    </StoryBook>
  );
};
