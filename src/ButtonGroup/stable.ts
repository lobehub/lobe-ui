import { stableClasses } from '@/utils/bem';

export const buttonGroupClasses = stableClasses({
  block: 'button-group',
  dataAttributes: ['variant', 'checked'],
  elements: ['label', 'group', 'item'],
});
