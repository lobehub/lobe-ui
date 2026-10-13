import { type ProColumns, ProTable, Statistic } from '@lobehub/ui/base-ui';

import { mockRequest, type ModelRow, statusEnum } from './data';

const columns: ProColumns<ModelRow>[] = [
  { dataIndex: 'model', title: 'Model' },
  { dataIndex: 'status', title: 'Status', valueEnum: statusEnum },
  { dataIndex: 'calls', hideInSearch: true, title: 'Calls', valueType: 'digit' },
  { dataIndex: 'spend', hideInSearch: true, title: 'Spend', valueType: 'money' },
];

/** `tableExtraRender` (stats between form and table) and `tableRender` (rearranged parts). */
export default () => (
  <ProTable<ModelRow>
    cardBordered
    columns={columns}
    headerTitle="Custom layout"
    request={mockRequest}
    rowKey="id"
    tableExtraRender={(_, data) => (
      <div style={{ display: 'flex', gap: 32 }}>
        <Statistic title="Rows on page" value={data.length} />
        <Statistic
          precision={2}
          title="Page spend"
          value={data.reduce((sum, row) => sum + row.spend, 0)}
        />
      </div>
    )}
    tableRender={(_, __, { toolbar, alert, table }) => (
      <>
        {toolbar}
        {alert}
        <div style={{ borderInlineStart: '3px solid currentColor', paddingInlineStart: 12 }}>
          {table}
        </div>
      </>
    )}
  />
);
