import { AGENT_AVATAR_SHAPES, AgentAvatar, Flexbox, Text } from '@lobehub/ui';

export default () => (
  <Flexbox gap={24} padding={24}>
    <Flexbox horizontal gap={20} wrap={'wrap'}>
      {AGENT_AVATAR_SHAPES.map((shape) => (
        <Flexbox align="center" gap={8} key={shape}>
          <AgentAvatar seed={shape} shape={shape} size={64} />
          <Text style={{ fontSize: 12 }} type="secondary">
            {shape}
          </Text>
        </Flexbox>
      ))}
    </Flexbox>
    <Flexbox horizontal align="center" gap={20} wrap={'wrap'}>
      {AGENT_AVATAR_SHAPES.map((shape) => (
        <AgentAvatar key={shape} seed={shape} shape={shape} size={24} />
      ))}
    </Flexbox>
  </Flexbox>
);
