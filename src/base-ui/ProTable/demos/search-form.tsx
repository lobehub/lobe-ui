import { Button } from '@lobehub/ui/base-ui';
import {
  type ProColumns,
  ProTable,
  type ProTableFormInstance,
} from '@lobehub/ui/base-ui/pro-table';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { useRef, useState } from 'react';

import { mockRequest, type ModelRow, providerEnum, statusEnum } from './data';

const columns: ProColumns<ModelRow>[] = [
  { dataIndex: 'model', order: 10, title: 'Model' },
  { dataIndex: 'provider', initialValue: 'OpenAI', title: 'Provider', valueEnum: providerEnum },
  { dataIndex: 'status', title: 'Status', valueEnum: statusEnum, valueType: 'checkbox' },
  {
    dataIndex: 'owner',
    formItemProps: {
      rules: [{ message: 'Letters only', pattern: /^[a-z]+$/i }],
    },
    title: 'Owner',
  },
  {
    dataIndex: 'calls',
    formItemProps: {
      rules: [
        {
          validator: (_, value) => {
            if (value !== undefined && value < 1000) throw new Error('At least 1,000 calls');
          },
        },
      ],
    },
    title: 'Calls',
    valueType: 'digit',
  },
  {
    colSize: 2,
    dataIndex: 'createdAt',
    search: { transform: (value) => ({ endTime: value[1], startTime: value[0] }) },
    title: 'Created',
    valueType: 'dateRange',
  },
  { dataIndex: 'spend', hideInSearch: true, title: 'Spend', valueType: 'money' },
];

/**
 * Query form: `labelWidth`, `span`, `layout`, `defaultColsNumber`, collapse, custom texts, a
 * `search.transform` (date range → `startTime` / `endTime`), `initialValue`, `order`, `formRef`
 * `beforeSearchSubmit`, and base-ui Form validation through `formItemProps.rules` (Owner: letters
 * only, Calls: a `validator`). The submitted params show under the form.
 */
export default () => {
  const store = useCreateStore();
  const controls = useControls(
    {
      collapseRender: true,
      defaultColsNumber: { max: 6, min: 0, step: 1, value: 0 },
      labelWidth: { max: 160, min: 40, step: 10, value: 80 },
      layout: { options: ['horizontal', 'vertical'], value: 'horizontal' },
      optionRender: true,
      searchText: 'Query',
      span: { options: [0, 6, 8, 12, 24], value: 0 },
    },
    { store },
  ) as {
    collapseRender: boolean;
    defaultColsNumber: number;
    labelWidth: number;
    layout: 'horizontal' | 'vertical';
    optionRender: boolean;
    searchText: string;
    span: number;
  };
  const formRef = useRef<ProTableFormInstance>(undefined);
  const [submitted, setSubmitted] = useState<Record<string, any>>();

  return (
    <StoryBook levaStore={store}>
      <ProTable<ModelRow>
        beforeSearchSubmit={(params) => ({ ...params, from: 'search-form' })}
        columns={columns}
        formRef={formRef}
        headerTitle="Search form"
        key={`${controls.defaultColsNumber}-${controls.span}`}
        request={mockRequest}
        rowKey="id"
        style={{ width: '100%' }}
        search={{
          collapseRender: controls.collapseRender ? undefined : false,
          defaultColsNumber: controls.defaultColsNumber || undefined,
          labelWidth: controls.labelWidth,
          layout: controls.layout,
          optionRender: controls.optionRender ? undefined : false,
          searchText: controls.searchText,
          span: controls.span || undefined,
        }}
        tableExtraRender={() => (
          <code style={{ fontSize: 12 }}>submitted: {JSON.stringify(submitted ?? {})}</code>
        )}
        toolBarRender={() => [
          <Button key="fill" onClick={() => formRef.current?.setFieldsValue({ owner: 'Ada' })}>
            Fill owner via formRef
          </Button>,
        ]}
        onSubmit={setSubmitted}
      />
    </StoryBook>
  );
};
