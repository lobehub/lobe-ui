import { AgentSkillCard, LandingHero } from '@lobehub/ui/awesome';
import { ArrowRight } from 'lucide-react';

export default () => (
  <LandingHero
    accent="UI Kit"
    description="An open-source React component library for building AIGC web apps."
    title="LobeHub"
    actions={[
      {
        href: '/components/button',
        icon: ArrowRight,
        iconPlacement: 'end',
        label: 'Get Started',
        primary: true,
      },
    ]}
    aside={
      <AgentSkillCard
        human={{ code: 'npx skills add lobehub/lobe-ui', description: 'Install the skills' }}
        agent={{
          code: 'Read https://ui.lobehub.com/skills.md and follow it to build UI with @lobehub/ui.',
          description: 'Send this prompt to your agent',
        }}
      />
    }
  />
);
