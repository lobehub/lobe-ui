import { AgentAvatar, Flexbox } from '@lobehub/ui';

const crew = [
  { color: 'volcano', shape: 'lobot' },
  { color: 'geekblue', shape: 'robot' },
  { color: 'orange', shape: 'cat' },
  { color: 'green', shape: 'frog' },
  { color: 'magenta', shape: 'bunny' },
] as const;

export default () => (
  <Flexbox horizontal gap={24} justify="center" padding={32} wrap="wrap">
    {crew.map(({ color, shape }) => (
      <AgentAvatar animated followPointer color={color} key={shape} shape={shape} size={80} />
    ))}
  </Flexbox>
);
