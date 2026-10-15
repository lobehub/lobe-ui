import { type ProColumns, ProTable } from '@lobehub/ui/pro-table';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

import { mockRequest, type ModelRow, statusEnum } from './data';

const columns: ProColumns<ModelRow>[] = [
  { dataIndex: 'model', title: 'Model' },
  { dataIndex: 'status', title: 'Status', valueEnum: statusEnum },
  { dataIndex: 'progress', title: 'Quota', valueType: 'progress', width: 160 },
  { dataIndex: 'updatedAt', key: 'updatedAt', title: 'Fetched at', valueType: 'dateTime' },
];

/** `polling` (ms, at least 2000), `manualRequest` and `postData`; the "Fetched at" column moves on every round. */
export default () => {
  const store = useCreateStore();
  const controls = useControls(
    {
      manualRequest: false,
      polling: { max: 10_000, min: 0, step: 1000, value: 3000 },
    },
    { store },
  ) as { manualRequest: boolean; polling: number };

  return (
    <StoryBook levaStore={store}>
      <ProTable<ModelRow & { updatedAt?: number }>
        columns={columns}
        headerTitle={controls.polling ? `Polling every ${controls.polling / 1000}s` : 'Polling off'}
        key={String(controls.manualRequest)}
        manualRequest={controls.manualRequest}
        pagination={{ pageSize: 5 }}
        polling={controls.polling || undefined}
        request={mockRequest}
        rowKey="id"
        search={false}
        style={{ width: '100%' }}
        postData={(data) =>
          data.map((row) => ({
            ...row,
            progress: Math.round(Math.random() * 100),
            updatedAt: Date.now(),
          }))
        }
      />
    </StoryBook>
  );
};
