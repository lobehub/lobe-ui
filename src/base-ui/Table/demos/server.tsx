import { Table, type TableColumn, type TableSorterResult } from '@lobehub/ui/base-ui';
import { useMemo, useState } from 'react';

interface LogRow {
  createdAt: string;
  id: string;
  spend: number;
}

const all: LogRow[] = Array.from({ length: 42 }, (_, index) => ({
  createdAt: new Date(Date.UTC(2026, 8, 1 + (index % 26))).toISOString().slice(0, 10),
  id: String(index),
  spend: Math.round(((index * 37) % 100) * 1.7) / 10,
}));

const columns: TableColumn<LogRow>[] = [
  { dataIndex: 'createdAt', key: 'createdAt', sorter: true, title: 'Date' },
  { align: 'right', dataIndex: 'spend', key: 'spend', sorter: true, title: 'Spend' },
];

export default () => {
  const [page, setPage] = useState({ current: 1, pageSize: 10 });
  const [sorter, setSorter] = useState<TableSorterResult<LogRow>>({});

  const rows = useMemo(() => {
    const sorted = [...all];
    if (sorter.columnKey && sorter.order) {
      const key = sorter.columnKey as keyof LogRow;
      sorted.sort((a, b) => (a[key] > b[key] ? 1 : -1) * (sorter.order === 'descend' ? -1 : 1));
    }
    return sorted.slice((page.current - 1) * page.pageSize, page.current * page.pageSize);
  }, [page, sorter]);

  return (
    <Table
      columns={columns}
      dataSource={rows}
      pagination={{ current: page.current, pageSize: page.pageSize, total: all.length }}
      rowKey="id"
      size="small"
      onChange={(pagination, _filters, nextSorter) => {
        setPage({ current: pagination.current ?? 1, pageSize: pagination.pageSize ?? 10 });
        setSorter(nextSorter);
      }}
    />
  );
};
