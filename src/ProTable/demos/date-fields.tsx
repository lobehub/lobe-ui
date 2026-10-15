import { Button, Flexbox } from '@lobehub/ui';
import { type ProColumns, ProTable, type ProTableFormInstance } from '@lobehub/ui/pro-table';
import { useRef, useState } from 'react';

import { mockRequest, type ModelRow } from './data';

const columns: ProColumns<ModelRow>[] = [
  { dataIndex: 'model', title: 'Model' },
  { dataIndex: 'createdAt', hideInSearch: true, title: 'Created', valueType: 'date' },
  { dataIndex: 'day', hideInTable: true, title: 'Day', valueType: 'date' },
  { dataIndex: 'at', hideInTable: true, title: 'At', valueType: 'dateTime' },
  { colSize: 2, dataIndex: 'range', hideInTable: true, title: 'Range', valueType: 'dateRange' },
  { dataIndex: 'spend', hideInSearch: true, title: 'Spend', valueType: 'money' },
];

const describe = (value: unknown): unknown => {
  if (value instanceof Date) return `Date(${value.toISOString()})`;
  if (Array.isArray(value)) return value.map(describe);
  return value;
};

/**
 * Date search fields keep native `Date` form values (ProTable's contract) while the pickers work
 * in Dayjs: pick dates or fill them through `formRef`, then read the raw values (each one a
 * `Date`) and the formatted ones (`YYYY-MM-DD` strings) the request receives.
 */
export default () => {
  const formRef = useRef<ProTableFormInstance>(undefined);
  const [snapshot, setSnapshot] = useState<{ format: unknown; raw: unknown }>();

  const read = () => {
    const raw = formRef.current?.getFieldsValue() ?? {};
    setSnapshot({
      format: formRef.current?.getFieldsFormatValue(),
      raw: Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, describe(value)])),
    });
  };

  return (
    <ProTable<ModelRow>
      columns={columns}
      formRef={formRef}
      headerTitle="Date fields"
      request={mockRequest}
      rowKey="id"
      style={{ width: '100%' }}
      tableExtraRender={() => (
        <Flexbox gap={4} style={{ fontSize: 12 }}>
          <code>raw: {JSON.stringify(snapshot?.raw ?? {})}</code>
          <code>formatted: {JSON.stringify(snapshot?.format ?? {})}</code>
        </Flexbox>
      )}
      toolBarRender={() => [
        <Button
          key="fill"
          onClick={() => {
            formRef.current?.setFieldsValue({
              at: new Date(2026, 0, 2, 9, 30),
              day: new Date(2026, 0, 2),
              range: [new Date(2026, 0, 1), new Date(2026, 0, 31)],
            } as any);
            read();
          }}
        >
          Fill Date values via formRef
        </Button>,
        <Button key="read" onClick={read}>
          Read form values
        </Button>,
      ]}
    />
  );
};
