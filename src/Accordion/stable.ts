import { stableClasses } from '@/utils/bem';

export const accordionClasses = stableClasses({
  block: 'accordion',
  dataAttributes: ['variant', 'indicator-placement'],
  elements: ['item', 'header', 'trigger', 'indicator', 'action', 'panel', 'content'],
});
