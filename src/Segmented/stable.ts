import { stableClasses } from '@/utils/bem';

export const segmentedClasses = stableClasses({
  block: 'segmented',
  dataAttributes: ['variant', 'size', 'block', 'glass', 'shadow'],
  elements: ['item', 'item-icon', 'item-label', 'indicator'],
});
