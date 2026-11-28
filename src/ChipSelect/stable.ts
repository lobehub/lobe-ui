import { stableClasses } from '@/utils/bem';

export const chipSelectClasses = stableClasses({
  block: 'chip-select',
  dataAttributes: ['variant', 'checked'],
  elements: ['label', 'count', 'chips', 'chip', 'check'],
});
