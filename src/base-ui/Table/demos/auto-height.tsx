import { Flexbox } from '@lobehub/ui';
import {
  Segmented,
  Switch,
  Table,
  type TableColumnsType,
  type TableRef,
  Text,
} from '@lobehub/ui/base-ui';
import { useLayoutEffect, useState } from 'react';

interface DataType {
  address: string;
  age: number;
  key: number;
  name: string;
}

const columns: TableColumnsType<DataType> = [
  { dataIndex: 'name', title: 'Name', width: 160 },
  { dataIndex: 'age', title: 'Age', width: 80 },
  { dataIndex: 'address', title: 'Address' },
];

const dataSource: DataType[] = Array.from({ length: 200 }, (_, index) => ({
  address: `London, Park Lane no. ${index}`,
  age: 20 + (index % 30),
  key: index,
  name: `Edward King ${index}`,
}));

/** `scroll.y` = the box height minus everything in the table that is not the scrolling body. */
const useScrollY = (box: HTMLElement | null, tableRef: TableRef | null) => {
  const [scrollY, setScrollY] = useState<number>();

  useLayoutEffect(() => {
    if (!box || !tableRef) return;
    // `nativeElement` is the real element; ResizeObserver rejects the ref itself.
    const table = tableRef.nativeElement;
    const update = () => {
      const body = table.querySelector<HTMLElement>(
        '.lobe-table-body, .lobe-table-tbody-virtual-holder',
      );
      if (!body) return;
      const chrome = table.offsetHeight - body.offsetHeight;
      setScrollY(Math.max(box.clientHeight - chrome, 0));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(box);
    observer.observe(table);
    return () => observer.disconnect();
  }, [box, tableRef]);

  return scrollY;
};

type BoxHeight = '300' | '450' | '600';

export default () => {
  const [height, setHeight] = useState<BoxHeight>('450');
  const [virtual, setVirtual] = useState(false);
  const [box, setBox] = useState<HTMLDivElement | null>(null);
  const [table, setTable] = useState<TableRef | null>(null);
  const scrollY = useScrollY(box, table);

  return (
    <Flexbox gap={16} style={{ width: '100%' }}>
      <Flexbox horizontal align="center" gap={16}>
        <Segmented<BoxHeight>
          value={height}
          options={['300', '450', '600'].map((value) => ({
            label: `${value}px`,
            value: value as BoxHeight,
          }))}
          onChange={setHeight}
        />
        <Flexbox horizontal align="center" gap={8}>
          <Switch checked={virtual} onChange={() => setVirtual(!virtual)} />
          <Text>Virtual</Text>
        </Flexbox>
      </Flexbox>
      {/* The table fills a box of any height: `scroll.y` follows the box minus header and pager. */}
      <div
        ref={setBox}
        style={{
          border: '1px dashed var(--ant-color-border)',
          // A flex item keeps the pager's margins inside the measured table height.
          display: 'flex',
          flexDirection: 'column',
          height: Number(height),
        }}
      >
        <Table<DataType>
          columns={columns}
          dataSource={dataSource}
          pagination={{ defaultPageSize: 50, showSizeChanger: false }}
          ref={setTable}
          scroll={{ x: virtual ? 800 : undefined, y: scrollY ?? 300 }}
          size="small"
          virtual={virtual}
        />
      </div>
    </Flexbox>
  );
};
