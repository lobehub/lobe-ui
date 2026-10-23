import { stableClasses } from '@/utils/bem';

export const agentAvatarClasses = stableClasses({
  block: 'agent-avatar',
  dataAttributes: ['shape', 'color', 'state', 'animated'],
  elements: ['body', 'eyes', 'badge', 'thought'],
});
