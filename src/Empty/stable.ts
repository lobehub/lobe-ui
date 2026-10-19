import { stableClasses } from '@/utils/bem';

export const emptyClasses = stableClasses({
  block: 'empty',
  dataAttributes: ['type', 'variant'],
  elements: ['cover', 'title', 'description', 'action'],
});
