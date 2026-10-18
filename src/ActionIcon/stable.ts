import { stableClasses } from '@/utils/bem';

export const actionIconClasses = stableClasses({
  block: 'action-icon',
  dataAttributes: ['variant', 'size', 'active', 'glass', 'shadow', 'danger', 'loading'],
  elements: ['icon'],
});
