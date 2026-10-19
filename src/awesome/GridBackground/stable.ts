import { stableClasses } from '@/utils/bem';

export const awesomeGridBackgroundClasses = stableClasses({
  block: 'awesome-grid-background',
  dataAttributes: ['flip'],
  elements: ['grid', 'highlight', 'background', 'background-shape'],
});

export const awesomeGridShowcaseClasses = stableClasses({
  block: 'awesome-grid-showcase',
  elements: ['back', 'content', 'front'],
});
