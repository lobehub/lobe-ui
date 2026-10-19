import { stableClasses } from '@/utils/bem';

export const avatarClasses = stableClasses({
  block: 'avatar',
  dataAttributes: ['shape', 'variant', 'shadow'],
  elements: ['loading', 'img', 'content'],
});

export const avatarGroupClasses = stableClasses({
  block: 'avatar-group',
  elements: ['avatar', 'count'],
});
