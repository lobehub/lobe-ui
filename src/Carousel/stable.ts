import { stableClasses } from '@/utils/bem';

export const carouselClasses = stableClasses({
  block: 'carousel',
  dataAttributes: ['variant'],
  elements: ['viewport', 'track', 'slide', 'prev', 'next', 'dots', 'dot', 'scroller'],
});
