import { stableClasses } from '@/utils/bem';

export const faviconClasses = stableClasses({
  block: 'favicon',
  dataAttributes: ['shape', 'fallback'],
  elements: ['image'],
});
