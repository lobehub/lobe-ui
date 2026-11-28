import { stableClasses } from '@/utils/bem';

export const switchClasses = stableClasses({
  block: 'switch',
  dataAttributes: ['size', 'loading', 'variant'],
  elements: ['content', 'thumb', 'field', 'label', 'description'],
});
