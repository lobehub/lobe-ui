import { AgentAvatar, Flexbox, Text } from '@lobehub/ui';

const sizes = [16, 20, 24, 32, 40, 64, 96];

export default () => (
  <Flexbox horizontal align="flex-end" gap={24} justify="center" padding={24} wrap="wrap">
    {sizes.map((size) => (
      <Flexbox align="center" gap={8} key={size}>
        <AgentAvatar color="geekblue" shape="lobot" size={size} tilt={false} />
        <Text style={{ fontSize: 12 }} type="secondary">
          {size}
        </Text>
      </Flexbox>
    ))}
  </Flexbox>
);
