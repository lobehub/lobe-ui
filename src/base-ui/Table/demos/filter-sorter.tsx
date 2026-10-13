import { Flexbox } from '@lobehub/ui';
import {
  Table,
  type TableColumn,
  type TableSorterResult,
  type TableSorterTooltipProps,
} from '@lobehub/ui/base-ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { useState } from 'react';

interface ScoreRow {
  address: string;
  english: number;
  key: string;
  math: number;
  name: string;
}

const data: ScoreRow[] = [
  { address: 'New York No. 1 Lake Park', english: 70, key: '1', math: 60, name: 'John Brown' },
  { address: 'London No. 1 Lake Park', english: 89, key: '2', math: 66, name: 'Jim Green' },
  { address: 'Sydney No. 1 Lake Park', english: 70, key: '3', math: 90, name: 'Joe Black' },
  { address: 'London No. 2 Lake Park', english: 89, key: '4', math: 99, name: 'Jim Red' },
  { address: 'New York No. 2 Lake Park', english: 95, key: '5', math: 60, name: 'Joe Yellow' },
];

type FilterSearch = 'off' | 'on' | 'custom';

const describe = (sorter: TableSorterResult<ScoreRow> | TableSorterResult<ScoreRow>[]) => {
  const list = (Array.isArray(sorter) ? sorter : [sorter]).filter((item) => item.order);
  return list.length > 0
    ? list.map((item) => `${String(item.field)}: ${item.order}`).join(', ')
    : 'none';
};

/**
 * Header filters and sorters: nested filter options in a menu or a tree, `filterSearch` (on, or a
 * custom matcher), `sortDirections`, `defaultSortOrder`, multi-column sorting with
 * `sorter.multiple`, and where the sorter tooltip shows.
 */
export default () => {
  const store = useCreateStore();
  const control = useControls(
    {
      filterMode: { options: ['menu', 'tree'], value: 'menu' },
      filterMultiple: true,
      filterSearch: { options: ['off', 'on', 'custom'], value: 'on' },
      multipleSorter: false,
      sorterTooltip: { options: ['full-header', 'sorter-icon', 'off'], value: 'full-header' },
    },
    { store },
  ) as {
    filterMode: 'menu' | 'tree';
    filterMultiple: boolean;
    filterSearch: FilterSearch;
    multipleSorter: boolean;
    sorterTooltip: TableSorterTooltipProps['target'] | 'off';
  };
  const [state, setState] = useState('sorted by: math: descend');

  const multiple = (priority: number) => (control.multipleSorter ? priority : undefined);

  const columns: TableColumn<ScoreRow>[] = [
    {
      dataIndex: 'name',
      filterMode: control.filterMode,
      filterMultiple: control.filterMultiple,
      filterSearch: control.filterSearch !== 'off',
      filters: [
        { text: 'Joe', value: 'Joe' },
        {
          children: [
            { text: 'Green', value: 'Green' },
            { text: 'Black', value: 'Black' },
          ],
          text: 'Jim / Joe colors',
          value: 'colors',
        },
      ],
      // Name contains the picked value; sorts by length, descending only.
      onFilter: (value, record) => record.name.includes(String(value)),
      sortDirections: ['descend'],
      sorter: { compare: (a, b) => a.name.length - b.name.length, multiple: multiple(3) },
      title: 'Name',
    },
    {
      dataIndex: 'math',
      defaultSortOrder: 'descend',
      sorter: { compare: (a, b) => a.math - b.math, multiple: multiple(2) },
      title: 'Math',
    },
    {
      dataIndex: 'english',
      sorter: { compare: (a, b) => a.english - b.english, multiple: multiple(1) },
      title: 'English',
    },
    {
      dataIndex: 'address',
      // `custom`: a function decides which options match the input.
      filterSearch:
        control.filterSearch === 'custom'
          ? (input, item) => String(item.value).toLowerCase().includes(input.toLowerCase())
          : control.filterSearch === 'on',
      filters: [
        { text: 'London', value: 'London' },
        { text: 'New York', value: 'New York' },
      ],
      onFilter: (value, record) => record.address.startsWith(String(value)),
      title: 'Address',
      width: '35%',
    },
  ];

  return (
    <StoryBook levaStore={store}>
      <Flexbox gap={12} style={{ width: '100%' }}>
        <Table<ScoreRow>
          columns={columns}
          dataSource={data}
          key={String(control.multipleSorter)}
          pagination={false}
          showSorterTooltip={
            control.sorterTooltip === 'off' ? false : { target: control.sorterTooltip }
          }
          onChange={(_pagination, filters, sorter) =>
            setState(`sorted by: ${describe(sorter)} · filters: ${JSON.stringify(filters)}`)
          }
        />
        <code style={{ opacity: 0.65 }}>{state}</code>
      </Flexbox>
    </StoryBook>
  );
};
