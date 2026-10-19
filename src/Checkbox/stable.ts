import { stableClasses } from '@/utils/bem';

export const checkboxClasses = stableClasses({
  block: 'checkbox',
  dataAttributes: ['shape'],
  elements: ['checkbox', 'indicator', 'text'],
});

export const checkboxGroupClasses = stableClasses({
  block: 'checkbox-group',
  dataAttributes: ['horizontal'],
  elements: ['item'],
});
