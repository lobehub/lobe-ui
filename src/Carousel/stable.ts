import { stableClasses } from '@/utils/bem';

export const carouselClasses = stableClasses({
  block: 'carousel',
  elements: ['viewport', 'track', 'slide', 'prev', 'next', 'dots', 'dot'],
});
