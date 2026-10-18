import { stableClasses } from '@/utils/bem';

export const actionIconGroupClasses = stableClasses({
  block: 'action-icon-group',
  dataAttributes: ['variant', 'size', 'glass', 'shadow'],
  elements: ['item', 'more'],
});
