import { AGENT_AVATAR_COLORS, AGENT_AVATAR_SHAPES, AgentAvatar, Text } from '@lobehub/ui';

const bright = AGENT_AVATAR_COLORS.filter((color) => color !== 'gray');

export default () => (
  <div
    style={{
      display: 'grid',
      gap: 20,
      gridTemplateColumns: 'repeat(auto-fill, minmax(84px, 1fr))',
      padding: 24,
      width: '100%',
    }}
  >
    {AGENT_AVATAR_SHAPES.map((shape, index) => (
      <div
        key={shape}
        style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 8 }}
      >
        <AgentAvatar color={bright[index % bright.length]} shape={shape} size={64} tilt={false} />
        <Text style={{ fontSize: 12 }} type="secondary">
          {shape}
        </Text>
      </div>
    ))}
  </div>
);
