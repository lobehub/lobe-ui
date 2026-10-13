import { Button } from '@lobehub/ui/base-ui';
import { type ProColumns, ProTable } from '@lobehub/ui/base-ui/pro-table';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

import { mockRequest, type ModelRow, statusEnum } from './data';

const columns: ProColumns<ModelRow>[] = [
  { dataIndex: 'model', title: 'Model' },
  { dataIndex: 'status', title: 'Status', valueEnum: statusEnum },
  { dataIndex: 'calls', hideInSearch: true, title: 'Calls', valueType: 'digit' },
  { dataIndex: 'spend', hideInSearch: true, title: 'Spend', valueType: 'money' },
];

/**
 * Batch operations: `rowSelection` with the alert bar, custom `tableAlertRender` /
 * `tableAlertOptionRender`, `alwaysShowAlert`, and selected rows in `toolBarRender`.
 */
export default () => {
  const store = useCreateStore();
  const controls = useControls(
    {
      alwaysShowAlert: false,
      customAlert: true,
      hideAlert: false,
      type: { options: ['checkbox', 'radio'], value: 'checkbox' },
    },
    { store },
  ) as {
    alwaysShowAlert: boolean;
    customAlert: boolean;
    hideAlert: boolean;
    type: 'checkbox' | 'radio';
  };

  return (
    <StoryBook levaStore={store}>
      <ProTable<ModelRow>
        columns={columns}
        headerTitle="Batch operations"
        request={mockRequest}
        rowKey="id"
        rowSelection={{ alwaysShowAlert: controls.alwaysShowAlert, type: controls.type }}
        search={false}
        style={{ width: '100%' }}
        tableAlertOptionRender={
          controls.customAlert
            ? ({ onCleanSelected, selectedRowKeys }) => (
                <>
                  <Button size="small" type="link" onClick={onCleanSelected}>
                    Clear
                  </Button>
                  <Button danger disabled={!selectedRowKeys.length} size="small">
                    Delete {selectedRowKeys.length}
                  </Button>
                </>
              )
            : undefined
        }
        tableAlertRender={
          controls.hideAlert
            ? false
            : controls.customAlert
              ? ({ selectedRows }) =>
                  `${selectedRows.length} selected · $${selectedRows
                    .reduce((sum, row) => sum + row.spend, 0)
                    .toFixed(2)} spend`
              : undefined
        }
        toolBarRender={(_, { selectedRowKeys }) => [
          <Button disabled={!selectedRowKeys?.length} key="export">
            Export selected
          </Button>,
        ]}
      />
    </StoryBook>
  );
};
