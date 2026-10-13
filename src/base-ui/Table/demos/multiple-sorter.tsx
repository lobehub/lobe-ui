import { Table, type TableColumn, type TableSorterResult } from '@lobehub/ui/base-ui';
import { useState } from 'react';

interface ScoreRow {
  chinese: number;
  english: number;
  key: string;
  math: number;
  name: string;
}

const columns: TableColumn<ScoreRow>[] = [
  { dataIndex: 'name', title: 'Name' },
  {
    dataIndex: 'chinese',
    sorter: { compare: (a, b) => a.chinese - b.chinese, multiple: 3 },
    title: 'Chinese Score',
  },
  {
    dataIndex: 'math',
    sorter: { compare: (a, b) => a.math - b.math, multiple: 2 },
    title: 'Math Score',
  },
  {
    dataIndex: 'english',
    sorter: { compare: (a, b) => a.english - b.english, multiple: 1 },
    title: 'English Score',
  },
];

const data: ScoreRow[] = [
  { chinese: 98, english: 70, key: '1', math: 60, name: 'John Brown' },
  { chinese: 98, english: 89, key: '2', math: 66, name: 'Jim Green' },
  { chinese: 98, english: 70, key: '3', math: 90, name: 'Joe Black' },
  { chinese: 88, english: 89, key: '4', math: 99, name: 'Jim Red' },
];

const describe = (sorter: TableSorterResult<ScoreRow> | TableSorterResult<ScoreRow>[]) => {
  const list = (Array.isArray(sorter) ? sorter : [sorter]).filter((item) => item.order);
  return list.length > 0
    ? list.map((item) => `${String(item.field)}: ${item.order}`).join(', ')
    : 'none';
};

export default () => {
  const [sorted, setSorted] = useState('none');

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        onChange={(_pagination, _filters, sorter) => setSorted(describe(sorter))}
      />
      <p data-testid="sorter-state" style={{ marginBlock: '12px 0', opacity: 0.65 }}>
        Sorted by: {sorted}
      </p>
    </>
  );
};
