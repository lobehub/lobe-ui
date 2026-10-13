import { type ProColumns, ProTable } from '@lobehub/ui/pro-table';

import { mockRequest, type ModelRow, providerEnum, statusEnum } from './data';

const columns: ProColumns<ModelRow>[] = [
  { dataIndex: 'model', title: 'Model' },
  { dataIndex: 'provider', title: 'Provider', valueEnum: providerEnum },
  { dataIndex: 'status', title: 'Status', valueEnum: statusEnum },
  { dataIndex: 'createdAt', title: 'Created', valueType: 'date' },
  { dataIndex: 'calls', hideInSearch: true, title: 'Calls', valueType: 'digit' },
];

/** `search.filterType: 'light'`: the fields move into the toolbar and query on change. */
export default () => (
  <ProTable<ModelRow>
    columns={columns}
    headerTitle="Light filter"
    request={mockRequest}
    rowKey="id"
    search={{ filterType: 'light' }}
  />
);
