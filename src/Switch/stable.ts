import { stableClasses } from '@/utils/bem';

export const switchClasses = stableClasses({
  block: 'switch',
  dataAttributes: ['size', 'loading'],
  elements: ['content', 'thumb'],
});
