import { Button } from '@lobehub/ui';
import {
  type ProColumns,
  ProTable,
  type ProTableActionType,
  type ProTableFormInstance,
} from '@lobehub/ui/pro-table';
import { useRef } from 'react';

import { mockRequest, type ModelRow, statusEnum } from './data';

const columns: ProColumns<ModelRow>[] = [
  { dataIndex: 'model', title: 'Model' },
  { dataIndex: 'status', title: 'Status', valueEnum: statusEnum },
  { dataIndex: 'owner', title: 'Owner' },
  { dataIndex: 'calls', hideInSearch: true, sorter: true, title: 'Calls', valueType: 'digit' },
];

/** `actionRef` (reload / reset / clearSelected / setPageInfo / fullScreen) and `formRef`. */
export default () => {
  const actionRef = useRef<ProTableActionType>(undefined);
  const formRef = useRef<ProTableFormInstance>(undefined);
  return (
    <ProTable<ModelRow>
      actionRef={actionRef}
      columns={columns}
      formRef={formRef}
      headerTitle="actionRef / formRef"
      options={{ fullScreen: true }}
      request={mockRequest}
      rowKey="id"
      rowSelection={{}}
      toolBarRender={() => [
        <Button key="reload" onClick={() => actionRef.current?.reload()}>
          reload
        </Button>,
        <Button key="page3" onClick={() => actionRef.current?.setPageInfo({ current: 3 })}>
          go to page 3
        </Button>,
        <Button key="clear" onClick={() => actionRef.current?.clearSelected()}>
          clearSelected
        </Button>,
        <Button
          key="owner"
          onClick={() => {
            formRef.current?.setFieldsValue({ owner: 'Eve' });
            formRef.current?.submit();
          }}
        >
          search owner Eve
        </Button>,
        <Button key="reset" onClick={() => actionRef.current?.reset()}>
          reset
        </Button>,
      ]}
    />
  );
};
