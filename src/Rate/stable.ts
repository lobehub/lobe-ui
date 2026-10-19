import { stableClasses } from '@/utils/bem';

export const rateClasses = stableClasses({
  block: 'rate',
  dataAttributes: ['allow-half'],
  elements: ['star', 'empty', 'fill'],
});
