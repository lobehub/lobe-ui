import { Flexbox } from '@lobehub/ui';
import { Badge, DropdownMenu, Switch, Table, type TableColumnsType } from '@lobehub/ui/base-ui';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface DataType {
  createdAt: string;
  creator: string;
  key: string;
  name: string;
  platform: string;
  upgradeNum: number;
  version: string;
}

interface ExpandedDataType {
  date: string;
  key: string;
  name: string;
  upgradeNum: string;
}

const items = [
  { key: '1', label: 'Action 1' },
  { key: '2', label: 'Action 2' },
];

const expandDataSource = Array.from({ length: 3 }, (_, i): ExpandedDataType => ({
  date: '2014-12-24 23:12:00',
  key: String(i),
  name: 'This is production name',
  upgradeNum: 'Upgraded: 56',
}));

const dataSource = Array.from({ length: 3 }, (_, i): DataType => ({
  createdAt: '2014-12-24 23:12:00',
  creator: 'Jack',
  key: String(i),
  name: 'Screen',
  platform: 'iOS',
  upgradeNum: 500,
  version: '10.3.4.5654',
}));

const expandColumns: TableColumnsType<ExpandedDataType> = [
  { dataIndex: 'date', key: 'date', title: 'Date' },
  { dataIndex: 'name', key: 'name', title: 'Name' },
  { key: 'state', render: () => <Badge status="success" text="Finished" />, title: 'Status' },
  { dataIndex: 'upgradeNum', key: 'upgradeNum', title: 'Upgrade Status' },
  {
    key: 'operation',
    render: () => (
      <Flexbox horizontal align="center" gap={12}>
        <a href="#">Pause</a>
        <a href="#">Stop</a>
        <DropdownMenu items={items}>
          <a href="#" style={{ alignItems: 'center', display: 'inline-flex', gap: 2 }}>
            More <ChevronDown size={14} />
          </a>
        </DropdownMenu>
      </Flexbox>
    ),
    title: 'Action',
  },
];

const columns: TableColumnsType<DataType> = [
  { dataIndex: 'name', key: 'name', title: 'Name' },
  { dataIndex: 'platform', key: 'platform', title: 'Platform' },
  { dataIndex: 'version', key: 'version', title: 'Version' },
  { dataIndex: 'upgradeNum', key: 'upgradeNum', title: 'Upgraded' },
  { dataIndex: 'creator', key: 'creator', title: 'Creator' },
  { dataIndex: 'createdAt', key: 'createdAt', title: 'Date' },
  { key: 'operation', render: () => <a href="#">Publish</a>, title: 'Action' },
];

const createExpandedRowRender = (bordered: boolean) => () => (
  <Table<ExpandedDataType>
    bordered={bordered}
    columns={expandColumns}
    dataSource={expandDataSource}
    pagination={false}
  />
);

export default () => {
  const [rootTableBordered, setRootTableBordered] = useState(true);
  const [childTableBordered, setChildTableBordered] = useState(true);

  return (
    <Flexbox gap={16}>
      <Flexbox horizontal align="center" gap={24} wrap="wrap">
        <Flexbox horizontal align="center" as="label" gap={8}>
          Root Table Bordered
          <Switch checked={rootTableBordered} onChange={setRootTableBordered} />
        </Flexbox>
        <Flexbox horizontal align="center" as="label" gap={8}>
          Child Table Bordered
          <Switch checked={childTableBordered} onChange={setChildTableBordered} />
        </Flexbox>
      </Flexbox>
      <Table<DataType>
        bordered={rootTableBordered}
        columns={columns}
        dataSource={dataSource}
        expandable={{ expandedRowRender: createExpandedRowRender(childTableBordered) }}
        footer={() => 'cool'}
        title={() => 'cool'}
      />
    </Flexbox>
  );
};
