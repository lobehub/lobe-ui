import { AGENT_AVATAR_COLORS, AgentAvatar, Flexbox, Text } from '@lobehub/ui';

const shapes = ['face', 'cloud', 'cat'] as const;

export default () => (
  <Flexbox gap={16} padding={24}>
    {AGENT_AVATAR_COLORS.map((color) => (
      <Flexbox horizontal align="center" gap={16} key={color}>
        <Text style={{ width: 72 }} type="secondary">
          {color}
        </Text>
        {shapes.map((shape) => (
          <AgentAvatar color={color} key={shape} shape={shape} size={48} />
        ))}
        {shapes.map((shape) => (
          <AgentAvatar color={color} key={`${shape}-small`} shape={shape} size={24} />
        ))}
      </Flexbox>
    ))}
  </Flexbox>
);
