import { ConfigProvider, Flexbox } from '@lobehub/ui';
import {
  Segmented,
  Switch,
  Table,
  type TableColumnsType,
  type TableLocale,
  Text,
} from '@lobehub/ui/base-ui';
import { zhCn } from '@lobehub/ui/i18n';
import { motion } from 'motion/react';
import { useState } from 'react';

interface DataType {
  age: number;
  children?: DataType[];
  key: string;
  name: string;
}

const columns: TableColumnsType<DataType> = [
  {
    dataIndex: 'name',
    filterMode: 'tree',
    filterSearch: true,
    filters: [
      { text: 'Joe', value: 'Joe' },
      { text: 'Jim', value: 'Jim' },
    ],
    onFilter: (value, record) => record.name.startsWith(String(value)),
    title: 'Name',
  },
  { dataIndex: 'age', sorter: (a, b) => a.age - b.age, title: 'Age' },
];

const data: DataType[] = [
  { age: 32, children: [{ age: 3, key: '1-1', name: 'Joe Jr.' }], key: '1', name: 'Joe Black' },
  { age: 42, key: '2', name: 'Jim Green' },
];

// Only these fields change; every other text keeps its i18n default.
const customLocale: TableLocale = {
  emptyText: 'Nothing to show yet',
  filterConfirm: 'Apply',
  filterReset: 'Clear',
  sortTitle: 'Sort this column',
  triggerAsc: 'Sort A → Z',
};

type Mode = 'custom' | 'default' | 'zhCn';

export default () => {
  const [mode, setMode] = useState<Mode>('default');
  const [empty, setEmpty] = useState(false);

  const table = (
    <Table<DataType>
      columns={columns}
      dataSource={empty ? [] : data}
      locale={mode === 'custom' ? customLocale : undefined}
      pagination={false}
      rowSelection={{ selections: true }}
    />
  );

  return (
    <Flexbox gap={16}>
      <Flexbox horizontal align="center" gap={24}>
        <Segmented<Mode>
          value={mode}
          options={[
            { label: 'i18n default (en)', value: 'default' },
            { label: 'ConfigProvider zh-CN', value: 'zhCn' },
            { label: 'locale prop', value: 'custom' },
          ]}
          onChange={setMode}
        />
        <Flexbox horizontal align="center" gap={8}>
          <Switch checked={empty} onChange={() => setEmpty(!empty)} />
          <Text>Empty</Text>
        </Flexbox>
      </Flexbox>
      {mode === 'zhCn' ? (
        <ConfigProvider locale="zh-CN" motion={motion} resources={zhCn}>
          {table}
        </ConfigProvider>
      ) : (
        table
      )}
    </Flexbox>
  );
};
