import { Flexbox } from '@lobehub/ui';
import {
  Checkbox,
  RadioGroup,
  Table,
  type TableColumn,
  type TableCurrentDataSource,
  type TablePaginationPlacement,
  type TablePaginationPosition,
  Tag,
} from '@lobehub/ui/base-ui';
import { useState } from 'react';

interface ModelRow {
  context: number;
  id: string;
  model: string;
  provider: string;
}

const PROVIDERS = ['OpenAI', 'Anthropic', 'Google', 'Mistral'];

const columns: TableColumn<ModelRow>[] = [
  { dataIndex: 'model', title: 'Model' },
  {
    dataIndex: 'provider',
    filters: PROVIDERS.map((provider) => ({ text: provider, value: provider })),
    onFilter: (value, record) => record.provider === value,
    render: (provider: string) => <Tag>{provider}</Tag>,
    title: 'Provider',
  },
  {
    align: 'right',
    dataIndex: 'context',
    render: (value) => `${value}K`,
    sorter: (a, b) => a.context - b.context,
    title: 'Context',
  },
];

// 60 rows: above 50, so the page-size changer shows by default (like antd).
const data: ModelRow[] = Array.from({ length: 60 }, (_, index) => ({
  context: 32 * ((index % 8) + 1),
  id: String(index),
  model: `model-${String(index + 1).padStart(2, '0')}`,
  provider: PROVIDERS[index % PROVIDERS.length],
}));

// The deprecated `position` names of each `placement`.
const LEGACY: Record<TablePaginationPlacement, TablePaginationPosition> = {
  bottomCenter: 'bottomCenter',
  bottomEnd: 'bottomRight',
  bottomStart: 'bottomLeft',
  none: 'none',
  topCenter: 'topCenter',
  topEnd: 'topRight',
  topStart: 'topLeft',
};

const topOptions = ['topStart', 'topCenter', 'topEnd', 'none'];
const bottomOptions = ['bottomStart', 'bottomCenter', 'bottomEnd', 'none'];

export default () => {
  const [top, setTop] = useState<TablePaginationPlacement>('topEnd');
  const [bottom, setBottom] = useState<TablePaginationPlacement>('bottomEnd');
  const [showTotal, setShowTotal] = useState(true);
  const [showQuickJumper, setShowQuickJumper] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [legacy, setLegacy] = useState(false);
  const [lastChange, setLastChange] = useState<string>();

  return (
    <Flexbox gap={16}>
      <Flexbox horizontal align={'center'} gap={8} wrap={'wrap'}>
        <span>Top:</span>
        <RadioGroup options={topOptions} value={top} onChange={(value) => setTop(value as any)} />
      </Flexbox>
      <Flexbox horizontal align={'center'} gap={8} wrap={'wrap'}>
        <span>Bottom:</span>
        <RadioGroup
          options={bottomOptions}
          value={bottom}
          onChange={(value) => setBottom(value as any)}
        />
      </Flexbox>
      <Flexbox horizontal gap={16} wrap={'wrap'}>
        <Checkbox checked={showTotal} onChange={setShowTotal}>
          showTotal
        </Checkbox>
        <Checkbox checked={showQuickJumper} onChange={setShowQuickJumper}>
          showQuickJumper
        </Checkbox>
        <Checkbox checked={disabled} onChange={setDisabled}>
          disabled
        </Checkbox>
        <Checkbox checked={legacy} onChange={setLegacy}>
          deprecated position
        </Checkbox>
      </Flexbox>
      <code>
        {legacy
          ? `position: ${JSON.stringify([LEGACY[top], LEGACY[bottom]])}`
          : `placement: ${JSON.stringify([top, bottom])}`}
        {' · onChange extra: '}
        {lastChange ?? '—'}
      </code>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        size="small"
        pagination={{
          disabled,
          pageSizeOptions: ['5', '10', '20'],
          ...(legacy ? { position: [LEGACY[top], LEGACY[bottom]] } : { placement: [top, bottom] }),
          showQuickJumper,
          showTotal: showTotal
            ? (total, [start, end]) => `${start}-${end} of ${total} items`
            : undefined,
        }}
        onChange={(pagination, _filters, _sorter, extra: TableCurrentDataSource<ModelRow>) =>
          setLastChange(
            `{ action: '${extra.action}', currentDataSource: ${extra.currentDataSource.length} rows } · page ${pagination.current}`,
          )
        }
      />
    </Flexbox>
  );
};
