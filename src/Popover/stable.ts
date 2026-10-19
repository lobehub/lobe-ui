import { stableClasses } from '@/utils/bem';

export const popoverClasses = stableClasses({
  block: 'popover',
  elements: ['trigger', 'positioner', 'viewport', 'arrow', 'backdrop'],
});
