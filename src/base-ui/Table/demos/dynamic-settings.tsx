import { Flexbox } from '@lobehub/ui';
import {
  Segmented,
  Switch,
  Table,
  type TableColumnType,
  type TableExpandableConfig,
  type TablePaginationPlacement,
  type TableProps,
  type TableRowSelection,
  type TableSize,
  Text,
} from '@lobehub/ui/base-ui';
import { ChevronDown } from 'lucide-react';
import { type ReactNode, useState } from 'react';

interface DataType {
  address: string;
  age: number;
  description: string;
  key: number;
  name: string;
}

const columns: TableColumnType<DataType>[] = [
  { dataIndex: 'name', title: 'Name' },
  { dataIndex: 'age', sorter: (a, b) => a.age - b.age, title: 'Age' },
  {
    dataIndex: 'address',
    filters: [
      { text: 'London', value: 'London' },
      { text: 'New York', value: 'New York' },
    ],
    onFilter: (value, record) => record.address.startsWith(value as string),
    title: 'Address',
  },
  {
    key: 'action',
    render: () => (
      <Flexbox horizontal gap={16}>
        <a href="#">Delete</a>
        <a href="#" style={{ alignItems: 'center', display: 'inline-flex', gap: 4 }}>
          More actions <ChevronDown size={14} />
        </a>
      </Flexbox>
    ),
    sorter: true,
    title: 'Action',
  },
];

const data = Array.from({ length: 10 }, (_, i): DataType => ({
  address: `New York No. ${i} Lake Park`,
  age: Number(`${i}2`),
  description: `My name is John Brown, I am ${i}2 years old, living in New York No. ${i} Lake Park.`,
  key: i,
  name: 'John Brown',
}));

const defaultExpandable: TableExpandableConfig<DataType> = {
  expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.description}</p>,
};

const defaultTitle = () => 'Here is title';
const defaultFooter = () => 'Here is footer';

const Field = ({ children, label }: { children: ReactNode; label: string }) => (
  <Flexbox horizontal align="center" gap={8}>
    <Text>{label}</Text>
    {children}
  </Flexbox>
);

export default () => {
  const [bordered, setBordered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState<TableSize>('large');
  const [expandable, setExpandable] = useState<TableExpandableConfig<DataType> | undefined>(
    defaultExpandable,
  );
  const [showTitle, setShowTitle] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [rowSelection, setRowSelection] = useState<TableRowSelection<DataType> | undefined>({});
  const [hasData, setHasData] = useState(true);
  const [tableLayout, setTableLayout] = useState<'unset' | 'fixed'>('unset');
  const [top, setTop] = useState<TablePaginationPlacement>('none');
  const [bottom, setBottom] = useState<TablePaginationPlacement>('bottomEnd');
  const [ellipsis, setEllipsis] = useState(false);
  const [yScroll, setYScroll] = useState(false);
  const [xScroll, setXScroll] = useState<'unset' | 'scroll' | 'fixed'>('unset');

  const scroll: TableProps<DataType>['scroll'] = {};
  if (yScroll) scroll.y = 240;
  if (xScroll !== 'unset') scroll.x = '120vw';

  const tableColumns = columns.map((column) => ({ ...column, ellipsis }));
  if (xScroll === 'fixed') {
    tableColumns[0].fixed = true;
    tableColumns.at(-1)!.fixed = 'right';
  }

  const switches: [string, boolean, (checked: boolean) => void][] = [
    ['Bordered', bordered, setBordered],
    ['loading', loading, setLoading],
    ['Title', showTitle, setShowTitle],
    ['Column Header', showHeader, setShowHeader],
    ['Footer', showFooter, setShowFooter],
    ['Expandable', !!expandable, (on) => setExpandable(on ? defaultExpandable : undefined)],
    ['Checkbox', !!rowSelection, (on) => setRowSelection(on ? {} : undefined)],
    ['Fixed Header', yScroll, setYScroll],
    ['Has Data', hasData, setHasData],
    ['Ellipsis', ellipsis, setEllipsis],
  ];

  return (
    <Flexbox gap={16}>
      <Flexbox horizontal gap={16} style={{ columnGap: 24 }} wrap="wrap">
        {switches.map(([label, checked, onChange]) => (
          <Field key={label} label={label}>
            <Switch checked={checked} size="small" onChange={(next) => onChange(next)} />
          </Field>
        ))}
      </Flexbox>
      <Flexbox horizontal gap={16} style={{ columnGap: 24 }} wrap="wrap">
        <Field label="Size">
          <Segmented<TableSize>
            size="small"
            value={size}
            options={[
              { label: 'Large', value: 'large' },
              { label: 'Medium', value: 'medium' },
              { label: 'Small', value: 'small' },
            ]}
            onChange={setSize}
          />
        </Field>
        <Field label="Table Scroll">
          <Segmented<'unset' | 'scroll' | 'fixed'>
            size="small"
            value={xScroll}
            options={[
              { label: 'Unset', value: 'unset' },
              { label: 'Scroll', value: 'scroll' },
              { label: 'Fixed Columns', value: 'fixed' },
            ]}
            onChange={setXScroll}
          />
        </Field>
        <Field label="Table Layout">
          <Segmented<'unset' | 'fixed'>
            size="small"
            value={tableLayout}
            options={[
              { label: 'Unset', value: 'unset' },
              { label: 'Fixed', value: 'fixed' },
            ]}
            onChange={setTableLayout}
          />
        </Field>
        <Field label="Pagination Top">
          <Segmented<TablePaginationPlacement>
            size="small"
            value={top}
            options={[
              { label: 'TopStart', value: 'topStart' },
              { label: 'TopCenter', value: 'topCenter' },
              { label: 'TopEnd', value: 'topEnd' },
              { label: 'None', value: 'none' },
            ]}
            onChange={setTop}
          />
        </Field>
        <Field label="Pagination Bottom">
          <Segmented<TablePaginationPlacement>
            size="small"
            value={bottom}
            options={[
              { label: 'BottomStart', value: 'bottomStart' },
              { label: 'BottomCenter', value: 'bottomCenter' },
              { label: 'BottomEnd', value: 'bottomEnd' },
              { label: 'None', value: 'none' },
            ]}
            onChange={setBottom}
          />
        </Field>
      </Flexbox>
      <Table<DataType>
        bordered={bordered}
        columns={tableColumns}
        dataSource={hasData ? data : []}
        expandable={expandable}
        footer={showFooter ? defaultFooter : undefined}
        loading={loading}
        pagination={{ placement: [top, bottom] }}
        rowSelection={rowSelection}
        scroll={scroll}
        showHeader={showHeader}
        size={size}
        tableLayout={tableLayout === 'unset' ? undefined : tableLayout}
        title={showTitle ? defaultTitle : undefined}
      />
    </Flexbox>
  );
};
