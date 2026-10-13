import { type ProColumns, ProTable } from '@lobehub/ui/base-ui';

import { type ModelRow, providerEnum, rows, statusEnum } from './data';

const columns: ProColumns<ModelRow>[] = [
  { dataIndex: 'index', title: '#', valueType: 'index' },
  { dataIndex: 'model', sorter: (a, b) => a.model.localeCompare(b.model), title: 'Model' },
  {
    dataIndex: 'provider',
    filters: true,
    onFilter: true,
    title: 'Provider',
    valueEnum: providerEnum,
  },
  { dataIndex: 'status', filters: true, onFilter: true, title: 'Status', valueEnum: statusEnum },
  { dataIndex: 'spend', sorter: (a, b) => a.spend - b.spend, title: 'Spend', valueType: 'money' },
  { dataIndex: 'createdAt', renderText: (value: string) => value.slice(0, 10), title: 'Created' },
];

/**
 * Local data: `dataSource` without `request`; `filters: true` + `onFilter: true` filter by the
 * `valueEnum` keys, function sorters sort locally, `renderText` reshapes the raw value.
 */
export default () => (
  <ProTable<ModelRow>
    columns={columns}
    dataSource={rows}
    headerTitle="Local data"
    rowKey="id"
    search={false}
  />
);
