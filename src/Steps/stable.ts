import { stableClasses } from '@/utils/bem';

export const stepsClasses = stableClasses({
  block: 'steps',
  dataAttributes: ['orientation', 'variant'],
  elements: ['item', 'indicator', 'body', 'title', 'description', 'connector'],
});
