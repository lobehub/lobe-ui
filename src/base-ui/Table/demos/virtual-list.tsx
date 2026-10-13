import { Flexbox } from '@lobehub/ui';
import {
  ActionIcon,
  Button,
  Segmented,
  Switch,
  Table,
  type TableColumnsType,
  type TableRef,
  Text,
} from '@lobehub/ui/base-ui';
import { Ellipsis } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';

interface RecordType {
  address1: string;
  address2: string;
  address3: string;
  age: number;
  firstName: string;
  id: number;
  lastName: string;
}

const fixedColumns: TableColumnsType<RecordType> = [
  { dataIndex: 'id', fixed: true, title: 'ID', width: 100 },
  {
    dataIndex: 'firstName',
    fixed: true,
    // Every 4 rows share one merged cell.
    onCell: (_, index = 0) => {
      if (index % 4 === 0) return { rowSpan: 4 };
      return { rowSpan: 0 };
    },
    title: 'FirstName',
    width: 120,
  },
  { dataIndex: 'lastName', fixed: true, title: 'LastName', width: 120 },
  { dataIndex: 'age', title: 'Group', width: 120 },
  { dataIndex: 'address1', title: 'Address 1', width: 300 },
  { dataIndex: 'address2', title: 'Address 2', width: 300 },
  { dataIndex: 'address3', title: 'Address 3', width: 300 },
  {
    align: 'end',
    fixed: 'right',
    key: 'action',
    render: () => <ActionIcon icon={Ellipsis} size="small" title="Actions" variant="filled" />,
    title: 'Action',
    width: 64,
  },
];

const columns: TableColumnsType<RecordType> = fixedColumns.map(({ fixed: _, ...column }) => column);

const getData = (length: number): RecordType[] =>
  Array.from({ length }, (_, index) => ({
    address1: `New York No. ${index} Lake Park`,
    address2: `London No. ${index} Lake Park`,
    address3: `Sydney No. ${index} Lake Park`,
    age: Math.floor(index / 4),
    firstName: `First_${index.toString(16)}`,
    id: index,
    lastName: `Last_${index.toString(16)}`,
  }));

type DataCount = '0' | '100' | '10000';

export default () => {
  const [fixed, setFixed] = useState(true);
  const [variant, setVariant] = useState<'borderless' | 'outlined' | 'filled'>('outlined');
  const [expanded, setExpanded] = useState(false);
  const [selectable, setSelectable] = useState(true);
  const [count, setCount] = useState<DataCount>('10000');
  const tblRef = useRef<TableRef>(null);

  const data = useMemo(() => getData(Number(count)), [count]);
  const mergedColumns = useMemo(() => {
    if (!fixed) return columns;
    if (!expanded) return fixedColumns;
    // Expanded rows break the row spans, so drop them while expanding.
    return fixedColumns.map(({ onCell: _, ...column }) => column);
  }, [expanded, fixed]);

  const expandableProps = useMemo(() => {
    if (!expanded) return undefined;
    return {
      expandedRowRender: (record: RecordType) => (
        <p style={{ margin: 0 }}>🎉 Expanded {record.address1}</p>
      ),
      rowExpandable: (record: RecordType) => record.id % 2 === 0,
    };
  }, [expanded]);

  return (
    <Flexbox gap={16} style={{ width: '100%' }}>
      <Flexbox horizontal align="center" gap={16} wrap="wrap">
        <Flexbox horizontal align="center" gap={8}>
          <Segmented<'borderless' | 'outlined' | 'filled'>
            options={['borderless', 'outlined', 'filled']}
            value={variant}
            onChange={setVariant}
          />
        </Flexbox>
        <Flexbox horizontal align="center" gap={8}>
          <Switch checked={fixed} onChange={() => setFixed(!fixed)} />
          <Text>Fixed</Text>
        </Flexbox>
        <Flexbox horizontal align="center" gap={8}>
          <Switch checked={expanded} onChange={() => setExpanded(!expanded)} />
          <Text>Expandable</Text>
        </Flexbox>
        <Flexbox horizontal align="center" gap={8}>
          <Switch checked={selectable} onChange={() => setSelectable(!selectable)} />
          <Text>Selection</Text>
        </Flexbox>
        <Segmented<DataCount>
          options={['0', '100', '10000']}
          value={count}
          onChange={(value) => setCount(value)}
        />
      </Flexbox>
      <Flexbox horizontal gap={8} wrap="wrap">
        <Button onClick={() => tblRef.current?.scrollTo({ top: 0 })}>Scroll To Top</Button>
        <Button onClick={() => tblRef.current?.scrollTo({ index: 999 })}>
          Scroll To Index 999
        </Button>
        <Button onClick={() => tblRef.current?.scrollTo({ align: 'start', key: 5000 })}>
          Scroll To Key 5000 (start)
        </Button>
        <Button onClick={() => tblRef.current?.scrollTo({ align: 'end', index: 200, offset: 20 })}>
          Scroll To Index 200 (end, offset 20)
        </Button>
      </Flexbox>
      <Table<RecordType>
        virtual
        columns={mergedColumns}
        dataSource={data}
        expandable={expandableProps}
        pagination={false}
        ref={tblRef}
        rowKey="id"
        rowSelection={selectable ? { fixed: true, type: 'checkbox' } : undefined}
        scroll={{ x: 2000, y: 400 }}
        variant={variant}
      />
    </Flexbox>
  );
};
