import { stableClasses } from '@/utils/bem';

export const agentAvatarClasses = stableClasses({
  block: 'agent-avatar',
  dataAttributes: ['shape', 'color', 'state', 'animated'],
  elements: ['body', 'eyes', 'badge', 'thought'],
});

export const agentAvatarPickerClasses = stableClasses({
  block: 'agent-avatar-picker',
  elements: ['preview', 'shapes', 'shape', 'colors', 'color'],
});
