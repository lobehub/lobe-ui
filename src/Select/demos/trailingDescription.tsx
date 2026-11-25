import { Flexbox, Select, type SelectProps, Text } from '@lobehub/ui';

const plans = [
  { desc: '2 vCPU, 2 GiB memory, 20 GiB disk.', label: 'Small', value: 'small' },
  { desc: '4 vCPU, 4 GiB memory, 40 GiB disk.', label: 'Medium', value: 'medium' },
  { desc: '8 vCPU, 16 GiB memory, 80 GiB disk.', label: 'Large', value: 'large' },
];

const options: SelectProps['options'] = plans.map(({ desc, label, value }) => ({
  label: (
    <Flexbox horizontal align="center" gap={8} justify="space-between" width="100%">
      <span>{label}</span>
      <Text type="secondary">{desc}</Text>
    </Flexbox>
  ),
  value,
}));

export default () => <Select defaultValue="small" options={options} style={{ width: 420 }} />;
