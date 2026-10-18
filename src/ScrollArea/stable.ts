import { stableClasses } from '@/utils/bem';

export const scrollAreaClasses = stableClasses({
  block: 'scroll-area',
  elements: ['viewport', 'content', 'scrollbar', 'thumb', 'corner'],
});
