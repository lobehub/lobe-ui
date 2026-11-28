import { stableClasses } from '@/utils/bem';

export const radioClasses = stableClasses({
  block: 'radio',
  dataAttributes: ['variant'],
  elements: ['radio', 'indicator', 'text'],
});

export const radioGroupClasses = stableClasses({
  block: 'radio-group',
  dataAttributes: ['horizontal', 'variant'],
  elements: ['item', 'label', 'options', 'description'],
});
