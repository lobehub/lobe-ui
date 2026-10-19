import { stableClasses } from '@/utils/bem';

export const radioClasses = stableClasses({
  block: 'radio',
  elements: ['radio', 'indicator', 'text'],
});

export const radioGroupClasses = stableClasses({
  block: 'radio-group',
  dataAttributes: ['horizontal'],
  elements: ['item'],
});
