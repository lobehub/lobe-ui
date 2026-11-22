import { AgentAvatar, Flexbox, Text } from '@lobehub/ui';

const names = [
  'Writer',
  'Translator',
  'Scientist',
  'Marketer',
  'Doctor',
  'Companion',
  'Data Analyst',
  'Architect',
];

export default () => (
  <Flexbox horizontal gap={24} justify="center" padding={24} wrap="wrap">
    {names.map((name) => (
      <Flexbox align="center" gap={8} key={name}>
        <AgentAvatar animated name={name} size={64} />
        <Text style={{ fontSize: 12 }} type="secondary">
          {name}
        </Text>
      </Flexbox>
    ))}
  </Flexbox>
);
