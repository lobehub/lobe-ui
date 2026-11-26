import { AvatarGroup } from '@lobehub/ui';

// Sample data from the A2UI playground AvatarGroup (CopilotKit a2ui-playground, MIT).
const people = [
  'Maya Okafor',
  'Leo Brandt',
  'Priya Raman',
  'Tomás Herrera',
  'Ines Duval',
  'Sam Whitaker',
  'Kenji Mori',
  'Ana Silva',
  'Ravi Patel',
];

export default () => (
  <AvatarGroup
    items={people.map((name) => ({ key: name, title: name }))}
    label="9 reviewers on this PR"
    max={5}
    variant="a2ui"
  />
);
