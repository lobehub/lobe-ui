import { stableClasses } from '@/utils/bem';

export const tooltipClasses = stableClasses({
  block: 'tooltip',
  dataAttributes: ['placement'],
  elements: ['trigger', 'positioner', 'arrow', 'viewport'],
});
