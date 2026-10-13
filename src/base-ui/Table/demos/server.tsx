import { Flexbox } from '@lobehub/ui';
import {
  Table,
  type TableColumn,
  type TableCurrentDataSource,
  type TableFilters,
  type TablePaginationConfig,
  type TableSorterResult,
  Tag,
} from '@lobehub/ui/base-ui';
import { useEffect, useMemo, useState } from 'react';

interface UserRow {
  email: string;
  gender: 'female' | 'male';
  id: string;
  name: string;
}

interface Query {
  current: number;
  filters: TableFilters;
  order?: TableSorterResult<UserRow>['order'];
  pageSize: number;
  sortField?: string;
}

const FIRST = ['Ada', 'Bob', 'Cleo', 'Dan', 'Eve', 'Finn', 'Gia', 'Hugo', 'Iris', 'Jude', 'Kai'];
const LAST = ['Stone', 'Reed', 'Hale', 'Moss', 'Vale', 'Lark'];

// Stands in for a REST endpoint (antd's demo uses randomuser.me).
const DB: UserRow[] = Array.from({ length: 46 }, (_, index) => {
  const name = `${FIRST[(index * 7) % FIRST.length]} ${LAST[index % LAST.length]}`;
  return {
    email: `${name.toLowerCase().replace(' ', '.')}${index}@example.com`,
    gender: index % 3 === 0 ? 'male' : 'female',
    id: String(index + 1),
    name,
  };
});

const fetchUsers = (query: Query) =>
  new Promise<{ results: UserRow[]; total: number }>((resolve) => {
    setTimeout(() => {
      let list = DB;
      const genders = query.filters.gender;
      if (genders?.length) list = list.filter((row) => genders.includes(row.gender));
      if (query.sortField && query.order) {
        const field = query.sortField as keyof UserRow;
        const direction = query.order === 'descend' ? -1 : 1;
        list = [...list].sort((a, b) => a[field].localeCompare(b[field]) * direction);
      }
      const start = (query.current - 1) * query.pageSize;
      resolve({ results: list.slice(start, start + query.pageSize), total: list.length });
    }, 600);
  });

// Every column state is controlled by the query, so the server is the single source of truth.
const getColumns = (query: Query): TableColumn<UserRow>[] => [
  // `sorter: true` keeps the rows as they come; the server sorts.
  {
    dataIndex: 'name',
    key: 'name',
    sortOrder: query.sortField === 'name' ? query.order : null,
    sorter: true,
    title: 'Name',
    width: '30%',
  },
  {
    dataIndex: 'gender',
    filteredValue: query.filters.gender ?? null,
    filters: [
      { text: 'Male', value: 'male' },
      { text: 'Female', value: 'female' },
    ],
    key: 'gender',
    title: 'Gender',
    width: '20%',
  },
  {
    dataIndex: 'email',
    key: 'email',
    sortOrder: query.sortField === 'email' ? query.order : null,
    sorter: true,
    title: 'Email',
  },
];

export default () => {
  const [query, setQuery] = useState<Query>({ current: 1, filters: {}, pageSize: 10 });
  const [data, setData] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastExtra, setLastExtra] = useState<TableCurrentDataSource<UserRow>>();

  useEffect(() => {
    let active = true;
    fetchUsers(query).then(({ results, total }) => {
      if (!active) return;
      setData(results);
      setTotal(total);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [query]);

  const columns = useMemo(() => getColumns(query), [query]);

  const handleChange = (
    pagination: TablePaginationConfig,
    filters: TableFilters,
    sorter: TableSorterResult<UserRow> | TableSorterResult<UserRow>[],
    extra: TableCurrentDataSource<UserRow>,
  ) => {
    const single = Array.isArray(sorter) ? sorter[0] : sorter;
    setLastExtra(extra);
    setLoading(true);
    setQuery({
      // The table already moved to page 1 on `filter`, like antd.
      current: pagination.current ?? 1,
      filters,
      order: single.order ?? undefined,
      pageSize: pagination.pageSize ?? 10,
      sortField: single.order ? (single.columnKey as string) : undefined,
    });
    // Like antd's demo: a new page size clears the loaded rows while the next page loads.
    if (pagination.pageSize !== query.pageSize) setData([]);
  };

  return (
    <Flexbox gap={12}>
      <Flexbox horizontal align={'center'} gap={8} wrap={'wrap'}>
        <span>Last change:</span>
        <Tag>{lastExtra?.action ?? '—'}</Tag>
        {lastExtra && <span>({lastExtra.currentDataSource.length} rows in currentDataSource)</span>}
        <span>Query:</span>
        <code>
          page {query.current} · size {query.pageSize} · sort{' '}
          {query.sortField ? `${query.sortField} ${query.order}` : 'none'} · gender{' '}
          {query.filters.gender?.join(', ') || 'all'}
        </code>
      </Flexbox>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id"
        scroll={{ y: 360 }}
        pagination={{
          current: query.current,
          pageSize: query.pageSize,
          pageSizeOptions: [5, 10, 20],
          showSizeChanger: true,
          showTotal: (count, [start, end]) => `${start}-${end} of ${count} users`,
          total,
        }}
        onChange={handleChange}
      />
    </Flexbox>
  );
};
