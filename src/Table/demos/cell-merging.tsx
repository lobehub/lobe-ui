import { Table, type TableColumnsType, type TableVariant } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

interface DataType {
  key: string;
  model: string;
  provider: string;
  region: string;
  tokens: number;
}

const data: DataType[] = [
  { key: '1', model: 'gpt-5', provider: 'OpenAI', region: 'us-east', tokens: 12_000 },
  { key: '2', model: 'gpt-5-mini', provider: 'OpenAI', region: 'us-east', tokens: 8400 },
  { key: '3', model: 'o4', provider: 'OpenAI', region: 'eu-west', tokens: 3100 },
  { key: '4', model: 'claude-opus', provider: 'Anthropic', region: 'us-west', tokens: 9800 },
  { key: '5', model: 'claude-sonnet', provider: 'Anthropic', region: 'us-west', tokens: 15_200 },
  { key: '6', model: 'gemini-pro', provider: 'Google', region: 'asia', tokens: 6600 },
  { key: '7', model: 'gemini-flash', provider: 'Google', region: 'asia', tokens: 4300 },
  { key: '8', model: 'gemini-nano', provider: 'Google', region: 'asia', tokens: 900 },
];

const spanOf =
  (field: 'provider' | 'region') =>
  (_: DataType, index = 0) => {
    const value = data[index][field];
    if (index > 0 && data[index - 1][field] === value) return { rowSpan: 0 };
    let span = 1;
    while (data[index + span]?.[field] === value) span += 1;
    return { rowSpan: span };
  };

const columns: TableColumnsType<DataType> = [
  {
    dataIndex: 'provider',
    fixed: 'start',
    key: 'provider',
    onCell: spanOf('provider'),
    title: 'Provider',
    width: 140,
  },
  { dataIndex: 'model', key: 'model', title: 'Model', width: 180 },
  { dataIndex: 'region', key: 'region', onCell: spanOf('region'), title: 'Region', width: 140 },
  {
    colSpan: 2,
    dataIndex: 'tokens',
    key: 'tokens',
    title: 'Usage',
    width: 140,
  },
  {
    colSpan: 0,
    key: 'bar',
    render: (_, { tokens }) => '▮'.repeat(Math.max(1, Math.round(tokens / 2000))),
    width: 200,
  },
  ...Array.from({ length: 3 }, (_, index) => ({
    key: `extra-${index}`,
    render: () => '—',
    title: `Extra ${index + 1}`,
    width: 160,
  })),
];

/**
 * Merged cells (antd colSpan / rowSpan): `onCell` returns `rowSpan` to merge Provider and
 * Region down, `rowSpan: 0` hides the covered cells, and `column.colSpan` merges the Usage
 * header over two columns. Merged cells draw dividers on both sides, including next to the
 * fixed Provider column while the table scrolls.
 */
export default () => {
  const store = useCreateStore();
  const control = useControls(
    { variant: { options: ['filled', 'outlined', 'borderless'], value: 'outlined' } },
    { store },
  ) as { variant: TableVariant };

  return (
    <StoryBook levaStore={store}>
      <div style={{ minWidth: 0, width: '100%' }}>
        <Table<DataType>
          columns={columns}
          dataSource={data}
          pagination={false}
          scroll={{ x: 1300 }}
          variant={control.variant}
        />
      </div>
    </StoryBook>
  );
};
