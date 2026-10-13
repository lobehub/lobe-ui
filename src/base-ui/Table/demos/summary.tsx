import { Flexbox } from '@lobehub/ui';
import { Table, type TableColumnsType, Text } from '@lobehub/ui/base-ui';

interface DataType {
  borrow: number;
  key: string;
  name: string;
  repayment: number;
}

interface FixedDataType {
  description: string;
  key: number;
  name: string;
}

const columns: TableColumnsType<DataType> = [
  { dataIndex: 'name', title: 'Name' },
  { dataIndex: 'borrow', title: 'Borrow' },
  { dataIndex: 'repayment', title: 'Repayment' },
];

const dataSource: DataType[] = [
  { borrow: 10, key: '1', name: 'John Brown', repayment: 33 },
  { borrow: 100, key: '2', name: 'Jim Green', repayment: 0 },
  { borrow: 10, key: '3', name: 'Joe Black', repayment: 10 },
  { borrow: 75, key: '4', name: 'Jim Red', repayment: 45 },
];

const fixedColumns: TableColumnsType<FixedDataType> = [
  { dataIndex: 'name', fixed: true, title: 'Name', width: 100 },
  { dataIndex: 'description', title: 'Description' },
];

const fixedDataSource: FixedDataType[] = Array.from({ length: 20 }, (_, index) => ({
  description: 'Everything that has a beginning, has an end.',
  key: index,
  name: ['Light', 'Bamboo', 'Little'][index % 3],
}));

export default () => (
  <Flexbox gap={24}>
    <Table<DataType>
      bordered
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      summary={(pageData) => {
        let totalBorrow = 0;
        let totalRepayment = 0;
        pageData.forEach(({ borrow, repayment }) => {
          totalBorrow += borrow;
          totalRepayment += repayment;
        });

        return (
          <>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <Text type="danger">{totalBorrow}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <Text>{totalRepayment}</Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>Balance</Table.Summary.Cell>
              <Table.Summary.Cell align="center" colSpan={2} index={1}>
                <Text type="danger">{totalBorrow - totalRepayment}</Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </>
        );
      }}
    />
    <Table<FixedDataType>
      bordered
      columns={fixedColumns}
      dataSource={fixedDataSource}
      pagination={false}
      scroll={{ x: 2000, y: 300 }}
      summary={() => (
        <Table.Summary fixed>
          <Table.Summary.Row>
            <Table.Summary.Cell index={0}>Summary</Table.Summary.Cell>
            <Table.Summary.Cell index={1}>This is a summary content</Table.Summary.Cell>
          </Table.Summary.Row>
        </Table.Summary>
      )}
    />
  </Flexbox>
);
