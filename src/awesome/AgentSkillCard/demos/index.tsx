import { AgentSkillCard } from '@lobehub/ui/awesome';

export default () => (
  <AgentSkillCard
    style={{ marginInline: 'auto' }}
    agent={{
      code: 'Read https://ui.lobehub.com/skills.md and follow it to build UI with Lobe UI.',
      description: 'Send this prompt to your agent to discover the right skill',
    }}
    human={{
      code: 'npx skills add lobehub/lobe-ui',
      description: 'Install the skills into your project',
    }}
  />
);
