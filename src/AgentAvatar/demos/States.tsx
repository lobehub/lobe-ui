import { AGENT_AVATAR_STATES, AgentAvatar, Flexbox, Text } from '@lobehub/ui';

export default () => (
  <Flexbox horizontal gap={32} justify="center" padding={32} wrap="wrap">
    {AGENT_AVATAR_STATES.map((state) => (
      <Flexbox align="center" gap={12} key={state}>
        <AgentAvatar animated color="volcano" shape="bear" size={88} state={state} />
        <Text style={{ fontSize: 12 }} type="secondary">
          {state}
        </Text>
      </Flexbox>
    ))}
  </Flexbox>
);
