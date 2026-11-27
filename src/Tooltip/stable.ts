import { stableClasses } from '@/utils/bem';

export const tooltipClasses = stableClasses({
  block: 'tooltip',
  dataAttributes: ['placement', 'variant'],
  elements: ['trigger', 'positioner', 'arrow', 'viewport'],
});
