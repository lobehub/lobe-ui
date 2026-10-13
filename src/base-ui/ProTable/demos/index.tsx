import { type TableVariant } from '@lobehub/ui/base-ui';
import { type ProColumns, ProTable, type ProTableDensity } from '@lobehub/ui/base-ui/pro-table';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

import { mockRequest, type ModelRow, providerEnum, statusEnum } from './data';

const columns: ProColumns<ModelRow>[] = [
  { dataIndex: 'index', title: '#', valueType: 'index' },
  { dataIndex: 'model', title: 'Model', width: 200 },
  { dataIndex: 'provider', title: 'Provider', valueEnum: providerEnum },
  { dataIndex: 'status', title: 'Status', valueEnum: statusEnum },
  { dataIndex: 'owner', title: 'Owner' },
  { dataIndex: 'calls', hideInSearch: true, sorter: true, title: 'Calls', valueType: 'digit' },
  { dataIndex: 'progress', hideInSearch: true, title: 'Quota', valueType: 'progress', width: 160 },
  { dataIndex: 'createdAt', title: 'Created', valueType: 'date' },
];

/**
 * One playground for the table-level switches: layout (`variant`, `cardBordered`),
 * density, query form (`search`, `filterType`, `defaultCollapsed`), toolbar (`headerTitle`,
 * `options.*`), selection alert and pagination.
 */
export default () => {
  const store = useCreateStore();
  const card = useControls(
    {
      variant: { options: ['borderless', 'outlined', 'filled'], value: 'borderless' },
      cardBordered: false,
      defaultSize: { options: ['large', 'medium', 'small'], value: 'medium' },
      pagination: true,
      rowSelection: false,
    },
    { store },
  ) as {
    cardBordered: boolean;
    defaultSize: ProTableDensity;
    pagination: boolean;
    rowSelection: boolean;
    variant: TableVariant;
  };
  const query = useControls(
    {
      search: true,
      filterType: { options: ['query', 'light'], value: 'query' },
      defaultCollapsed: true,
      labelWidth: { options: ['auto', '60', '80', '120'], value: '80' },
      layout: { options: ['horizontal', 'vertical'], value: 'horizontal' },
    },
    { store },
  ) as {
    defaultCollapsed: boolean;
    filterType: 'query' | 'light';
    labelWidth: string;
    layout: 'horizontal' | 'vertical';
    search: boolean;
  };
  const bar = useControls(
    {
      headerTitle: 'Model routes',
      options: true,
      reload: true,
      density: true,
      fullScreen: true,
      setting: true,
      keywordSearch: false,
    },
    { store },
  ) as {
    density: boolean;
    fullScreen: boolean;
    headerTitle: string;
    keywordSearch: boolean;
    options: boolean;
    reload: boolean;
    setting: boolean;
  };

  return (
    <StoryBook levaStore={store}>
      <ProTable<ModelRow>
        cardBordered={card.cardBordered}
        columns={columns}
        defaultSize={card.defaultSize}
        headerTitle={bar.headerTitle || undefined}
        key={`${card.defaultSize}-${query.defaultCollapsed}-${query.filterType}`}
        pagination={card.pagination ? { defaultPageSize: 10, showSizeChanger: true } : false}
        request={mockRequest}
        rowKey="id"
        rowSelection={card.rowSelection ? {} : false}
        style={{ width: '100%' }}
        variant={card.variant}
        options={
          bar.options
            ? {
                density: bar.density,
                fullScreen: bar.fullScreen,
                reload: bar.reload,
                search: bar.keywordSearch,
                setting: bar.setting,
              }
            : false
        }
        search={
          query.search
            ? {
                defaultCollapsed: query.defaultCollapsed,
                filterType: query.filterType,
                labelWidth: query.labelWidth === 'auto' ? 'auto' : Number(query.labelWidth),
                layout: query.layout,
              }
            : false
        }
      />
    </StoryBook>
  );
};
