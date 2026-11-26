import { Section, StatCard } from '@lobehub/ui/dashboard';

// Sample data from the A2UI playground `Section` (CopilotKit a2ui-playground, MIT).
export default () => (
  <Section
    desc="Activity across your workspace."
    eyebrow="Overview"
    title="This week"
    variant="a2ui"
  >
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <StatCard label="Commits" value="342" variant="a2ui" />
      <StatCard label="PRs merged" value="57" variant="a2ui" />
    </div>
  </Section>
);
