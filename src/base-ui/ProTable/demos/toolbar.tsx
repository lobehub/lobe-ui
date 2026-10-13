import { ActionIcon, Button } from '@lobehub/ui/base-ui';
import { type ProColumns, ProTable } from '@lobehub/ui/base-ui/pro-table';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { Download, Plus } from 'lucide-react';

import { mockRequest, type ModelRow, statusEnum } from './data';

const columns: ProColumns<ModelRow>[] = [
  { dataIndex: 'model', title: 'Model' },
  { dataIndex: 'status', title: 'Status', valueEnum: statusEnum },
  { dataIndex: 'owner', title: 'Owner' },
  { dataIndex: 'spend', title: 'Spend', valueType: 'money' },
];

/**
 * Toolbar: `headerTitle` + `tooltip`, `toolbar.subTitle` / `actions` / `settings`, `toolBarRender`,
 * and the keyword input of `options.search` (sent as `params.keyword`).
 */
export default () => {
  const store = useCreateStore();
  const controls = useControls(
    {
      customSettings: false,
      keyword: true,
      subTitle: 'Gateway',
      title: 'Toolbar',
      tooltip: 'Routes the gateway serves',
    },
    { store },
  ) as {
    customSettings: boolean;
    keyword: boolean;
    subTitle: string;
    title: string;
    tooltip: string;
  };

  return (
    <StoryBook levaStore={store}>
      <ProTable<ModelRow>
        columns={columns}
        headerTitle={controls.title}
        request={mockRequest}
        rowKey="id"
        search={false}
        style={{ width: '100%' }}
        tooltip={controls.tooltip || undefined}
        options={{
          fullScreen: true,
          search: controls.keyword ? { placeholder: 'Search model' } : false,
        }}
        toolBarRender={() => [
          <Button icon={Plus} key="new" type="primary">
            New
          </Button>,
        ]}
        toolbar={{
          actions: [
            <Button icon={Download} key="export">
              Export
            </Button>,
          ],
          settings: controls.customSettings
            ? [<ActionIcon icon={Plus} key="add" title="Add route" />]
            : undefined,
          subTitle: controls.subTitle || undefined,
        }}
      />
    </StoryBook>
  );
};
