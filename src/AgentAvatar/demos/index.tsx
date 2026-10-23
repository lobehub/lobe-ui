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
  <Flexbox horizontal gap={24} padding={24} wrap={'wrap'}>
    {names.map((name) => (
      <Flexbox align="center" gap={8} key={name}>
        <AgentAvatar name={name} size={48} />
        <Text style={{ fontSize: 12 }} type="secondary">
          {name}
        </Text>
      </Flexbox>
    ))}
  </Flexbox>
);
