import { Flexbox, Table, type TableColumnsType, type TableVariant, Text } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

interface DataType {
  key: string;
  model: string;
  note: string;
  provider: string;
  spend: number;
  tokens: number;
}

const providers = ['OpenAI', 'Anthropic', 'Google', 'Mistral'];

const data: DataType[] = Array.from({ length: 12 }, (_, index) => ({
  key: String(index),
  model: `model-${index + 1}`,
  note:
    index % 3 === 0
      ? 'A longer note that wraps onto a second line, so the other cells of this row show the vertical centering.'
      : 'Short note',
  provider: providers[index % providers.length],
  spend: 12.5 * (index + 1),
  tokens: 1200 * (index + 3),
}));

const columns: TableColumnsType<DataType> = [
  { dataIndex: 'model', fixed: 'start', key: 'model', title: 'Model', width: 140 },
  { dataIndex: 'provider', key: 'provider', title: 'Provider', width: 160 },
  { dataIndex: 'note', key: 'note', title: 'Note', width: 320 },
  ...Array.from({ length: 4 }, (_, index) => ({
    dataIndex: 'tokens' as const,
    key: `tokens-${index}`,
    title: `Tokens ${index + 1}`,
    width: 140,
  })),
  {
    align: 'end',
    dataIndex: 'spend',
    fixed: 'end',
    key: 'spend',
    render: (value: number) => `$${value.toFixed(2)}`,
    title: 'Spend',
    width: 120,
  },
];

const variants: TableVariant[] = ['filled', 'outlined', 'borderless'];

/**
 * The three variants side by side for checking surfaces in light and dark: the header layer,
 * fixed start / end columns (frosted while content scrolls under them), translucent hover and
 * selected fills, the fixed summary row, vertically centered cells next to a wrapped one, and
 * the outlined frame's bottom border when `scroll.y` clips the body.
 */
export default () => {
  const store = useCreateStore();
  const control = useControls(
    {
      scrollY: { max: 480, min: 0, step: 20, value: 240 },
      selection: true,
      summary: true,
    },
    { store },
  ) as { scrollY: number; selection: boolean; summary: boolean };

  return (
    <StoryBook levaStore={store}>
      <Flexbox gap={24} style={{ minWidth: 0, width: '100%' }}>
        {variants.map((variant) => (
          <Flexbox gap={8} key={variant} style={{ minWidth: 0 }}>
            <Text type="secondary">variant=&quot;{variant}&quot;</Text>
            <Table<DataType>
              columns={columns}
              dataSource={data}
              pagination={false}
              rowSelection={control.selection ? { defaultSelectedRowKeys: ['1', '2'] } : undefined}
              scroll={{ x: 1400, y: control.scrollY || undefined }}
              variant={variant}
              summary={
                control.summary
                  ? (pageData) => (
                      <Table.Summary fixed>
                        <Table.Summary.Row>
                          <Table.Summary.Cell colSpan={control.selection ? 2 : 1} index={0}>
                            Total
                          </Table.Summary.Cell>
                          <Table.Summary.Cell colSpan={6} index={control.selection ? 2 : 1} />
                          <Table.Summary.Cell align="end" index={control.selection ? 8 : 7}>
                            ${pageData.reduce((sum, row) => sum + row.spend, 0).toFixed(2)}
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      </Table.Summary>
                    )
                  : undefined
              }
            />
          </Flexbox>
        ))}
      </Flexbox>
    </StoryBook>
  );
};
