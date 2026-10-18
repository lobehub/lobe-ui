import { stableClasses } from '@/utils/bem';

export const toggleGroupClasses = stableClasses({
  block: 'toggle-group',
  dataAttributes: ['variant', 'size'],
  elements: ['item', 'item-icon', 'item-label'],
});
