import { Table, type TableColumnsType, Tag } from '@lobehub/ui';

// Sample data from the A2UI playground DataTable (CopilotKit a2ui-playground, MIT).
interface Account {
  account: string;
  growth: number;
  mrr: number;
  plan: string;
  renewal: string;
  seats: number;
  status: string;
}

const rows: Account[] = [
  {
    account: 'Northwind Labs',
    growth: 18.2,
    mrr: 12_400,
    plan: 'Enterprise',
    renewal: '2027-02-14',
    seats: 240,
    status: 'Active',
  },
  {
    account: 'Kestrel Robotics',
    growth: 9.4,
    mrr: 6850,
    plan: 'Scale',
    renewal: '2026-12-01',
    seats: 96,
    status: 'Active',
  },
  {
    account: 'Helix Health',
    growth: 4.1,
    mrr: 9800,
    plan: 'Enterprise',
    renewal: '2026-11-20',
    seats: 180,
    status: 'Pending',
  },
  {
    account: 'Lumen Studio',
    growth: 22.7,
    mrr: 1240,
    plan: 'Pro',
    renewal: '2027-01-09',
    seats: 18,
    status: 'Active',
  },
  {
    account: 'Orbit Freight',
    growth: -3.6,
    mrr: 4300,
    plan: 'Scale',
    renewal: '2026-10-30',
    seats: 64,
    status: 'Overdue',
  },
  {
    account: 'Kestrel AI',
    growth: 41,
    mrr: 890,
    plan: 'Pro',
    renewal: '2026-11-05',
    seats: 12,
    status: 'Trial',
  },
  {
    account: 'Bramble Foods',
    growth: 6.5,
    mrr: 320,
    plan: 'Starter',
    renewal: '2027-03-22',
    seats: 5,
    status: 'Active',
  },
  {
    account: 'Quarry Finance',
    growth: 11.8,
    mrr: 15_100,
    plan: 'Enterprise',
    renewal: '2027-05-01',
    seats: 310,
    status: 'Active',
  },
];

const planColor: Record<string, string> = {
  Enterprise: 'purple',
  Pro: 'purple',
  Scale: 'purple',
  Starter: 'info',
};

const statusColor: Record<string, string> = {
  Active: 'success',
  Overdue: 'error',
  Pending: 'warning',
  Trial: 'warning',
};

const money = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  maximumFractionDigits: 0,
  style: 'currency',
});
const date = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

const badge = (colors: Record<string, string>) => (value: string) => (
  <Tag color={colors[value]} shape="round" size="small" variant="a2ui">
    {value}
  </Tag>
);

const columns: TableColumnsType<Account> = [
  {
    dataIndex: 'account',
    key: 'account',
    sorter: (a, b) => a.account.localeCompare(b.account),
    title: 'Account',
  },
  {
    dataIndex: 'plan',
    key: 'plan',
    render: badge(planColor),
    sorter: (a, b) => a.plan.localeCompare(b.plan),
    title: 'Plan',
  },
  {
    dataIndex: 'status',
    key: 'status',
    render: badge(statusColor),
    sorter: (a, b) => a.status.localeCompare(b.status),
    title: 'Status',
  },
  {
    align: 'right',
    dataIndex: 'mrr',
    key: 'mrr',
    render: (value: number) => money.format(value),
    sorter: (a, b) => a.mrr - b.mrr,
    title: 'MRR',
  },
  {
    align: 'right',
    dataIndex: 'growth',
    key: 'growth',
    render: (value: number) => `${value}%`,
    sorter: (a, b) => a.growth - b.growth,
    title: 'Growth',
  },
  {
    align: 'right',
    dataIndex: 'seats',
    key: 'seats',
    sorter: (a, b) => a.seats - b.seats,
    title: 'Seats',
  },
  {
    dataIndex: 'renewal',
    key: 'renewal',
    render: (value: string) => date.format(new Date(`${value}T00:00:00`)),
    sorter: (a, b) => a.renewal.localeCompare(b.renewal),
    title: 'Renewal',
  },
];

export default () => (
  <Table<Account>
    searchable
    columns={columns}
    dataSource={rows}
    pagination={{ pageSize: 5 }}
    rowKey="account"
    title={() => 'Top accounts'}
    variant="a2ui"
  />
);
