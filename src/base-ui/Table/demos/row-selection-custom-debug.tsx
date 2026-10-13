import { Table, type TableColumnsType, type TableRowSelection } from '@lobehub/ui/base-ui';
import type { Key } from 'react';

interface DataType {
  key: Key;
  name: string;
}

const columns: TableColumnsType<DataType> = [{ dataIndex: 'name', title: 'Name' }];

const dataSource = Array.from({ length: 46 }, (_, i): DataType => ({
  key: i,
  name: i % 2 === 0 ? `Edward King ${i}` : 'Another Row',
}));

// `renderCell` may return `{ children, props }`: every even row spans the next one.
const rowSelection: TableRowSelection<DataType> = {
  renderCell: (checked, _record, index, node) => ({
    children: (
      <>
        {String(checked)}: {node}
      </>
    ),
    props: { rowSpan: index % 2 === 0 ? 2 : 0 },
  }),
};

export default () => (
  <Table<DataType> columns={columns} dataSource={dataSource} rowSelection={rowSelection} />
);
