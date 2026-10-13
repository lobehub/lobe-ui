import { Switch, Table, type TableColumnsType } from '@lobehub/ui/base-ui';
import { useState } from 'react';

interface DataType {
  address: string;
  age: number;
  key: number;
  name: string;
}

const columns: TableColumnsType<DataType> = [
  { dataIndex: 'name', fixed: 'start', key: 'name', title: 'Full Name', width: 100 },
  { dataIndex: 'age', fixed: 'start', key: 'age', title: 'Age', width: 100 },
  ...Array.from({ length: 8 }, (_, index) => ({
    dataIndex: 'address' as const,
    key: String(index + 1),
    title: `Column ${index + 1}`,
    width: 150,
  })),
  { fixed: 'end', key: 'operation', render: () => <a>action</a>, title: 'Action', width: 100 },
];

const dataSource: DataType[] = Array.from({ length: 100 }, (_, index) => ({
  address: `London, Park Lane no. ${index}`,
  age: 32,
  key: index,
  name: `Edward ${index}`,
}));

export default () => {
  const [fixedTop, setFixedTop] = useState(false);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    // The box stands in for the page: the header, the fixed summary and the horizontal scrollbar
    // stick to its edges while it scrolls. Drop `getContainer` to follow `window` instead.
    <div ref={setContainer} style={{ height: 400, overflow: 'auto' }}>
      <Table<DataType>
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        scroll={{ x: 1500 }}
        sticky={{ getContainer: () => container ?? window, offsetHeader: 0 }}
        summary={() => (
          <Table.Summary fixed={fixedTop ? 'top' : 'bottom'}>
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={2} index={0}>
                <Switch
                  checked={fixedTop}
                  checkedChildren="Fixed Top"
                  unCheckedChildren="Fixed Bottom"
                  onChange={() => setFixedTop((prev) => !prev)}
                />
              </Table.Summary.Cell>
              <Table.Summary.Cell colSpan={8} index={2}>
                Scroll Context
              </Table.Summary.Cell>
              <Table.Summary.Cell index={10}>Fix Right</Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </div>
  );
};
