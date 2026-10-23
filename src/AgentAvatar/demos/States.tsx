import { AGENT_AVATAR_STATES, AgentAvatar, Flexbox, Text } from '@lobehub/ui';

export default () => (
  <Flexbox gap={24} padding={24}>
    <Flexbox horizontal gap={24} wrap={'wrap'}>
      {AGENT_AVATAR_STATES.map((state) => (
        <Flexbox align="center" gap={8} key={state}>
          <AgentAvatar animated color="orange" shape="face" size={64} state={state} />
          <Text style={{ fontSize: 12 }} type="secondary">
            {state}
          </Text>
        </Flexbox>
      ))}
    </Flexbox>
    <Flexbox horizontal align="center" gap={24} wrap={'wrap'}>
      {AGENT_AVATAR_STATES.map((state) => (
        <AgentAvatar animated key={state} name="Researcher" size={24} state={state} />
      ))}
    </Flexbox>
  </Flexbox>
);
