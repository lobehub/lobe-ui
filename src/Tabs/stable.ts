import { stableClasses } from '@/utils/bem';

export const tabsClasses = stableClasses({
  block: 'tabs',
  dataAttributes: ['size', 'variant'],
  elements: ['list', 'indicator', 'tab', 'panel'],
});
