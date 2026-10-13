import { Button } from '@lobehub/ui/base-ui';
import {
  type ProColumns,
  ProTable,
  type ProTableColumnsStateMap,
} from '@lobehub/ui/base-ui/pro-table';
import { useState } from 'react';

import { type ModelRow, providerEnum, rows, statusEnum } from './data';

const columns: ProColumns<ModelRow>[] = [
  { dataIndex: 'model', disable: true, title: 'Model', width: 200 },
  { dataIndex: 'provider', title: 'Provider', valueEnum: providerEnum },
  { dataIndex: 'status', title: 'Status', valueEnum: statusEnum },
  { dataIndex: 'owner', title: 'Owner' },
  { dataIndex: 'calls', title: 'Calls', valueType: 'digit' },
  { dataIndex: 'spend', title: 'Spend', valueType: 'money' },
  { dataIndex: 'createdAt', title: 'Created', valueType: 'date' },
  { dataIndex: 'id', hideInSetting: true, title: 'ID' },
];

/**
 * `columnsState`: controlled show / pin / order (the toolbar setting panel writes it), saved to
 * `localStorage` with `persistenceKey`. "Model" is `disable`d, "ID" is `hideInSetting`.
 */
export default () => {
  const [state, setState] = useState<ProTableColumnsStateMap>({
    calls: { show: false },
    model: { fixed: 'start' },
  });
  return (
    <ProTable<ModelRow>
      columns={columns}
      dataSource={rows}
      headerTitle="Columns state"
      rowKey="id"
      scroll={{ x: 1100 }}
      search={false}
      tableExtraRender={() => <code style={{ fontSize: 12 }}>{JSON.stringify(state)}</code>}
      columnsState={{
        onChange: setState,
        persistenceKey: 'lobe-pro-table-demo-columns',
        persistenceType: 'localStorage',
        value: state,
      }}
      toolBarRender={() => [
        <Button
          key="spend"
          onClick={() => setState({ ...state, spend: { show: !(state.spend?.show ?? true) } })}
        >
          Toggle spend
        </Button>,
      ]}
    />
  );
};
