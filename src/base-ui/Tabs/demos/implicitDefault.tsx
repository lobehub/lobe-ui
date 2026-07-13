import { Flexbox, Text } from '@lobehub/ui';
import { Tabs } from '@lobehub/ui/base-ui';

const items = [
  {
    children: <Flexbox padding={16}>Unavailable panel</Flexbox>,
    disabled: true,
    key: 'unavailable',
    label: 'Unavailable',
  },
  {
    children: <Flexbox padding={16}>Arguments panel</Flexbox>,
    key: 'arguments',
    label: 'Arguments',
  },
  {
    children: <Flexbox padding={16}>Response panel</Flexbox>,
    key: 'response',
    label: 'Response',
  },
];

export default () => (
  <Flexbox gap={12}>
    <Text>
      No initial key is provided. Arguments is the first enabled item and its panel must be visible
      immediately.
    </Text>
    <Tabs items={items} orientation="vertical" />
  </Flexbox>
);
