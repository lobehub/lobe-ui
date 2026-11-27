import { stableClasses } from '@/utils/bem';

export const popoverClasses = stableClasses({
  block: 'popover',
  dataAttributes: ['variant'],
  elements: ['trigger', 'positioner', 'viewport', 'arrow', 'backdrop'],
});
