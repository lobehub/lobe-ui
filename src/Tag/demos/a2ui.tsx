import { Flexbox, Tag } from '@lobehub/ui';

// Sample data from the A2UI playground TagList (CopilotKit a2ui-playground, MIT).
const tags = [
  'TypeScript',
  'React 19',
  'Edge runtime',
  'Postgres',
  'OpenTelemetry',
  'Tailwind',
  'pnpm',
];

export default () => {
  return (
    <Flexbox horizontal gap={6} wrap="wrap">
      {tags.map((tag) => (
        <Tag key={tag} variant="a2ui">
          {tag}
        </Tag>
      ))}
    </Flexbox>
  );
};
