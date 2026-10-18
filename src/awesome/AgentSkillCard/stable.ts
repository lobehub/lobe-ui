import { stableClasses } from '@/utils/bem';

export const awesomeAgentSkillCardClasses = stableClasses({
  block: 'awesome-agent-skill-card',
  dataAttributes: ['mode'],
  elements: ['mode-switch', 'panel', 'agents', 'agent', 'description', 'code', 'footer'],
});
