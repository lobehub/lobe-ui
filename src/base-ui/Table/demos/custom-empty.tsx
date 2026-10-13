import { Empty, Flexbox } from '@lobehub/ui';
import { Button, Switch, Table, type TableColumnsType, Text } from '@lobehub/ui/base-ui';
import { DatabaseZap } from 'lucide-react';
import { useState } from 'react';

interface DataType {
  address: string;
  age: number;
  key: string;
  name: string;
}

const columns: TableColumnsType<DataType> = [
  { dataIndex: 'name', key: 'name', title: 'Name' },
  { dataIndex: 'age', key: 'age', title: 'Age' },
  { dataIndex: 'address', key: 'address', title: 'Address' },
];

const data: DataType[] = [
  { address: 'New York No. 1 Lake Park', age: 32, key: '1', name: 'John Brown' },
  { address: 'London No. 1 Lake Park', age: 42, key: '2', name: 'Jim Green' },
];

export default () => {
  const [customize, setCustomize] = useState(true);
  const [showData, setShowData] = useState(false);

  return (
    <Flexbox gap={16}>
      <Flexbox horizontal gap={24}>
        <Flexbox horizontal align="center" gap={8}>
          <Switch checked={customize} onChange={() => setCustomize(!customize)} />
          <Text>Customize empty</Text>
        </Flexbox>
        <Flexbox horizontal align="center" gap={8}>
          <Switch checked={showData} onChange={() => setShowData(!showData)} />
          <Text>Show data</Text>
        </Flexbox>
      </Flexbox>
      <Table<DataType>
        columns={columns}
        dataSource={showData ? data : []}
        pagination={false}
        // `locale.emptyText` takes a node or, as here, a function called on render.
        locale={
          customize
            ? {
                emptyText: () => (
                  <Empty
                    description="Connect a data source to see rows here."
                    icon={DatabaseZap}
                    title="No customers yet"
                    action={
                      <Button size="small" onClick={() => setShowData(true)}>
                        Load sample data
                      </Button>
                    }
                  />
                ),
              }
            : undefined
        }
      />
    </Flexbox>
  );
};
