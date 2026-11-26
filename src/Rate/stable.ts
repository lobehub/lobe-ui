import { stableClasses } from '@/utils/bem';

export const rateClasses = stableClasses({
  block: 'rate',
  dataAttributes: ['allow-half', 'variant'],
  elements: ['star', 'empty', 'fill', 'label', 'value', 'count'],
});
