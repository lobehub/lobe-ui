import { ActionIcon, Button } from '@lobehub/ui/base-ui';
import { type ProColumns, ProTable, type ProTableActionType } from '@lobehub/ui/base-ui/pro-table';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import { useRef } from 'react';

import { mockRequest, type ModelRow, providerEnum, statusEnum } from './data';

const columns: ProColumns<ModelRow>[] = [
  { dataIndex: 'index', title: '#', valueType: 'indexBorder' },
  { copyable: true, dataIndex: 'model', ellipsis: true, title: 'Model', width: 200 },
  {
    dataIndex: 'provider',
    filters: true,
    title: 'Provider',
    valueEnum: providerEnum,
    valueType: 'select',
  },
  { dataIndex: 'status', title: 'Status', tooltip: 'Health of the route', valueEnum: statusEnum },
  { dataIndex: 'calls', hideInSearch: true, sorter: true, title: 'Calls', valueType: 'digit' },
  { dataIndex: 'spend', hideInSearch: true, sorter: true, title: 'Spend', valueType: 'money' },
  { dataIndex: 'createdAt', hideInSearch: true, title: 'Created', valueType: 'date' },
  {
    dataIndex: 'createdAt',
    hideInTable: true,
    key: 'createdRange',
    search: { transform: (value) => ({ endTime: value[1], startTime: value[0] }) },
    title: 'Created',
    valueType: 'dateRange',
  },
  {
    key: 'option',
    render: (_, record, __, action) => [
      <ActionIcon
        icon={Eye}
        key="view"
        size="small"
        title={`View ${record.model}`}
        variant="filled"
      />,
      <ActionIcon icon={Pencil} key="edit" size="small" title="Edit" variant="filled" />,
      <ActionIcon
        danger
        icon={Trash2}
        key="delete"
        size="small"
        title="Delete"
        variant="filled"
        onClick={() => action?.reload()}
      />,
    ],
    title: 'Action',
    valueType: 'option',
    width: 120,
  },
];

/** Pro "basic": `request` + query form + toolbar + an `option` column. */
export default () => {
  const actionRef = useRef<ProTableActionType>(undefined);
  return (
    <ProTable<ModelRow>
      actionRef={actionRef}
      columns={columns}
      headerTitle="Model routes"
      request={mockRequest}
      rowKey="id"
      tooltip="Every route the gateway serves"
      toolBarRender={() => [
        <Button icon={Plus} key="new" type="primary">
          New route
        </Button>,
      ]}
    />
  );
};
