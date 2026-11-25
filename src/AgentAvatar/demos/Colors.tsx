import { AGENT_AVATAR_COLORS, AgentAvatar, Text } from '@lobehub/ui';

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
    {AGENT_AVATAR_COLORS.map((color) => (
      <div
        key={color}
        style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 8 }}
      >
        <AgentAvatar color={color} shape="lobot" size={64} tilt={false} />
        <Text style={{ fontSize: 12 }} type="secondary">
          {color}
        </Text>
      </div>
    ))}
  </div>
);
