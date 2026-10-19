import { stableClasses } from '@/utils/bem';

export const spinClasses = stableClasses({
  block: 'spin',
  dataAttributes: ['size', 'variant'],
  elements: ['indicator', 'overlay', 'tip'],
});
