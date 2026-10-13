import { type ProColumns, ProTable, type ProTableValueType } from '@lobehub/ui/base-ui/pro-table';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

import { statusEnum } from './data';

interface Row {
  code: string;
  date: string;
  dateTime: number;
  digit: number;
  id: string;
  money: number;
  password: string;
  percent: number;
  progress: number;
  range: [string, string];
  status: string;
  switch: boolean;
  tags: string[];
  text: string;
}

const data: Row[] = Array.from({ length: 6 }, (_, index) => ({
  code: `route.${index}.enabled = true`,
  date: `2026-0${(index % 9) + 1}-1${index}`,
  dateTime: Date.UTC(2026, index, 3, 8 + index, 30),
  digit: 12_345.678 * (index + 1),
  id: String(index),
  money: index % 3 === 2 ? -98.5 : 1999.9 * (index + 1),
  password: 'secret',
  percent: 12.5 * index,
  progress: index * 18,
  range: [`2026-01-0${index + 1}`, `2026-02-0${index + 1}`],
  status: Object.keys(statusEnum)[index % 4],
  switch: index % 2 === 0,
  tags: index % 2 ? ['online'] : ['running', 'error'],
  text: index === 4 ? '' : `Text value ${index}`,
}));

const col = (
  dataIndex: keyof Row,
  valueType: ProTableValueType,
  extra?: Partial<ProColumns<Row>>,
): ProColumns<Row> => ({
  dataIndex,
  title: valueType,
  valueType,
  ...extra,
});

/** Every built-in `valueType`, read mode; toggle `columnEmptyText` and the money symbol. */
export default () => {
  const store = useCreateStore();
  const controls = useControls(
    {
      columnEmptyText: '-',
      customSymbol: '¥',
      precision: { max: 4, min: 0, step: 1, value: 2 },
    },
    { store },
  ) as { columnEmptyText: string; customSymbol: string; precision: number };

  const columns: ProColumns<Row>[] = [
    col('id', 'indexBorder', { title: 'indexBorder' }),
    col('text', 'text', { copyable: true }),
    col('password', 'password'),
    col('code', 'code'),
    col('digit', 'digit', { fieldProps: { precision: controls.precision } }),
    col('money', 'money', {
      fieldProps: { customSymbol: controls.customSymbol, precision: controls.precision },
    }),
    col('percent', 'percent'),
    col('progress', 'progress', { width: 140 }),
    col('switch', 'switch'),
    col('date', 'date'),
    col('dateTime', 'dateTime'),
    col('range', 'dateRange'),
    col('status', 'select', { title: 'valueEnum', valueEnum: statusEnum }),
    col('tags', 'checkbox', { title: 'valueEnum (array)', valueEnum: statusEnum }),
  ];

  return (
    <StoryBook levaStore={store}>
      <ProTable<Row>
        columnEmptyText={controls.columnEmptyText}
        columns={columns}
        dataSource={data}
        headerTitle="Value types"
        options={false}
        pagination={false}
        rowKey="id"
        scroll={{ x: 1600 }}
        search={false}
        style={{ width: '100%' }}
      />
    </StoryBook>
  );
};
