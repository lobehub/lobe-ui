import { stableClasses } from '@/utils/bem';

export const awesomeBentoGridClasses = stableClasses({
  block: 'awesome-bento-grid',
  elements: [],
});

export const awesomeBentoCardClasses = stableClasses({
  block: 'awesome-bento-card',
  dataAttributes: ['wide'],
  elements: ['header', 'title', 'hint', 'body'],
});
